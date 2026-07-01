const crypto = require('crypto');
const chromaService = require('../services/chroma');
const llmService = require('../services/llm');
const ChatHistory = require('../models/ChatHistory');

exports.askAssistant = async (req, res) => {
  try {
    const { question, userId } = req.body;
    let { sessionId } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'A pergunta não pode estar vazia.' });
    }

    // Se o cliente não enviar um sessionId, geramos um novo automaticamente
    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }

    // Busca as últimas 4 mensagens desta sessão para servir de contexto
    const history = await ChatHistory.find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(4);
    
    // Inverte o array para a ordem cronológica correta antes de enviar para o LLM
    history.reverse();

    // 1. Recupera os produtos mais relevantes do ChromaDB com base na pergunta
    const retrievedProducts = await chromaService.searchSimilarProducts(question, 10);

    // 2. Chama o LLM para gerar a resposta baseada nos produtos recuperados e no histórico
    const assistantReply = await llmService.generateShoppingList(question, retrievedProducts, history);

    // 3. Salva a interação atual no MongoDB
    await ChatHistory.create({
      sessionId,
      userId: userId || null,
      userQuery: question,
      assistantResponse: assistantReply
    });

    // 4. Retorna a resposta e avisa o Frontend qual é o sessionId ativo
    assistantReply.sessionId = sessionId;

    return res.status(200).json(assistantReply);

  } catch (error) {
    console.error('Erro no assistente de compras:', error);
    return res.status(500).json({ error: 'Erro interno ao processar a pergunta.' });
  }
};
