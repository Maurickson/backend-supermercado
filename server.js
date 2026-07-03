const dotenv = require('dotenv');
dotenv.config();
const express = require('express');

const userRoutes = require('./src/routers/userRoutes');
const productRoutes = require('./src/routers/productRoutes');
const shoppingRoutes = require('./src/routers/shoppingRoutes');
const connectDB = require('./src/services/mongodb');

const app = express();
const cors = require('cors');
const morgan = require('morgan');

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// --- ROTAS ---
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/shopping', shoppingRoutes);

// --- INICIALIZAÇÃO ---
const PORT = process.env.PORT || 3001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 O servidor está rodando na porta ${PORT}`);
  });
});
