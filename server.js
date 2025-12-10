const dotenv = require('dotenv');
dotenv.config();
const express = require('express');

const userRoutes = require('./src/routers/userRoutes');
const productRoutes = require('./src/routers/productRoutes');

const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

app.use(express.json());
app.use(cors('*'));

// --- ROTAS ---
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);

// --- CONEXÃO COM O BANCO ---
const PORT = process.env.PORT || 3001;
const DB_URI = process.env.DB_CONNECTION_STRING;

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log('✅ Conectado ao MongoDB com sucesso!');
    app.listen(PORT, () => {
      console.log(`🚀 O servidor está rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar ao MongoDB:', err);
  });
