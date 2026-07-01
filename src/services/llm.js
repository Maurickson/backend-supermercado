const { GoogleGenerativeAI } = require("@google/generative-ai");

// Inicializa o SDK usando a chave de API definida nas variáveis de ambiente (.env)
// A chave pode ser obtida gratuitamente no Google AI Studio (aistudio.google.com)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "COLOQUE_A_CHAVE_AQUI");

async function generateShoppingList(userQuery, retrievedProducts, history = []) {
  if (!retrievedProducts || retrievedProducts.length === 0) {
    return "Desculpe, não encontrei produtos correspondentes na nossa loja para essa busca.";
  }

  // Configura qual modelo usar e força a saída em JSON
  const model = genAI.getGenerativeModel({ 
    model: "gemini-flash-latest",
    generationConfig: { responseMimeType: "application/json" }
  });

  // Formata os produtos para o LLM entender (agora passando o ID também)
  const productListStr = retrievedProducts.map(p => `- ID: ${p.id} | ${p.name}: R$ ${p.price}`).join('\n');

  let historyStr = '';
  if (history && history.length > 0) {
    historyStr = "Histórico recente da conversa (lembre-se do que você já sugeriu para poder alterar itens se o cliente pedir):\n" + 
      history.map(h => `Cliente: "${h.userQuery}"\nAssistente (Você): ${JSON.stringify(h.assistantResponse)}`).join('\n\n') + "\n\n";
  }

  const prompt = `
Você é um assistente virtual de um supermercado inteligente.
Sua missão é sugerir os produtos disponíveis que melhor atendam à pergunta do cliente e caibam no orçamento (se informado).

${historyStr}Produtos disponíveis (use APENAS estes produtos e seus IDs):
${productListStr}

Pergunta ATUAL do cliente: "${userQuery}"

Retorne um objeto JSON estrito (application/json) com o seguinte formato:
{
  "mensagem": "Sua resposta amigável e criativa para o cliente. Foque nas alternativas deliciosas que você está sugerindo, em vez de focar no que não tem.",
  "itensSugeridos": [
    {
      "id": "ID do produto",
      "nome": "Nome do produto",
      "quantidade": <numero inteiro>,
      "precoUnitario": <numero float>,
      "precoTotalItem": <numero float>
    }
  ],
  "totalEstimado": <soma total float>
}
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();
    return JSON.parse(responseText); // Transforma a string JSON em objeto JS
  } catch (error) {
    console.error("Erro ao gerar resposta com Gemini:", error);
    return {
      mensagem: "Desculpe, tive um problema ao tentar formular a lista de compras no momento. Tente novamente mais tarde.",
      itensSugeridos: [],
      totalEstimado: 0
    };
  }
}

module.exports = {
  generateShoppingList
};
