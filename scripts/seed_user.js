const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const bcrypt = require('bcrypt');
const connectDB = require('../src/services/mongodb');
const User = require('../src/models/userModel');

// Usuário administrador padrão para testes
const adminUser = {
  name: 'Administrador',
  email: 'admin@supermercado.com',
  cpf: '000.000.000-00',
  pass: 'admin123',
};

async function seedUser() {
  await connectDB();

  try {
    const existing = await User.findOne({ email: adminUser.email });
    if (existing) {
      console.log(`⚠️ Usuário ${adminUser.email} já existe. Nada a fazer.`);
      process.exit(0);
    }

    const hashedPass = await bcrypt.hash(adminUser.pass, 10);
    await User.create({ ...adminUser, pass: hashedPass });

    console.log('✅ Usuário administrador criado com sucesso!');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Senha: ${adminUser.pass}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
    process.exit(1);
  }
}

seedUser();
