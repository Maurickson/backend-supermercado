const express = require('express');
const router = express.Router();
const shoppingController = require('../controllers/shoppingController');
// const authMiddleware = require('../middlewares/auth-middleware'); // Opcional: se o chat for restrito a logados

// Rota POST para fazer perguntas ao assistente (Chat do Mercado)
// Exemplo: POST /api/shopping/ask { "question": "Café da manhã por 50 reais" }
router.post('/ask', shoppingController.askAssistant);

module.exports = router;
