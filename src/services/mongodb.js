const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const DB_URI = process.env.DB_CONNECTION_STRING;
    if (!DB_URI) {
      throw new Error("DB_CONNECTION_STRING não definida no .env");
    }
    
    // Impede reconexões desnecessárias se já estiver conectado (útil para scripts e testes)
    if (mongoose.connection.readyState === 1) {
      return;
    }

    await mongoose.connect(DB_URI);
    console.log('✅ Conectado ao MongoDB com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
