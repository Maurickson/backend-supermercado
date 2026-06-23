const chromaService = require('../services/chroma');
const llmService = require('../services/llm');
// const Phrases = require('../models/Phrases'); // Opcional: para salvar histórico futuramente

exports.askAssistant = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'A pergunta não pode estar vazia.' });
    }

    // 1. Recupera os produtos mais relevantes do ChromaDB com base na pergunta
    // Vamos buscar os 10 produtos mais semanticamente próximos da pergunta
    const retrievedProducts = await chromaService.searchSimilarProducts(question, 10);

    // 2. Chama o LLM para gerar a resposta baseada nos produtos recuperados
    const assistantReply = await llmService.generateShoppingList(question, retrievedProducts);

    // 3. (Opcional) Poderia salvar a pergunta e resposta no MongoDB (models/Phrases.js) aqui
    /*
    await Phrases.create({
      userQuery: question,
      assistantResponse: assistantReply,
      timestamp: new Date()
    });
    */

    return res.status(200).json(assistantReply);

  } catch (error) {
    console.error('Erro no assistente de compras:', error);
    return res.status(500).json({ error: 'Erro interno ao processar a pergunta.' });
  }
};
