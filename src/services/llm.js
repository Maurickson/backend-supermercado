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
    historyStr = "Histórico recente da conversa (lembre-se do que já conversaram):\n" + 
      history.map(h => `Cliente: "${h.userQuery}"\nAssistente (Você): "${h.assistantResponse?.mensagem || ''}"`).join('\n\n') + "\n\n";
  }

  const prompt = `
Você é um atendente simpático, empático e natural de um supermercado inteligente.
Aja como um ser humano conversando com o cliente.

${historyStr}Produtos disponíveis no estoque (se precisar sugerir, use APENAS estes produtos e seus IDs):
${productListStr}

Pergunta ATUAL do cliente: "${userQuery}"

Regras de comportamento:
1. Se o cliente pedir sugestões de compras, produtos, receitas ou tiver dúvidas sobre itens, preencha o array "itensSugeridos" com os produtos que se encaixam no pedido e responda na "mensagem".
2. Se o cliente estiver apenas batendo papo, agradecendo, se despedindo ou não pedir nada que precise de produtos do estoque, DEIXE O ARRAY "itensSugeridos" VAZIO ([]) e apenas responda na "mensagem" de forma natural e amigável (ex: "De nada! Volte sempre!").

Retorne um objeto JSON estrito (application/json) com o seguinte formato:
{
  "mensagem": "Sua resposta natural e amigável. Se sugerir produtos, fale sobre eles de forma apetitosa.",
  "itensSugeridos": [
    {
      "id": "ID do produto",
      "nome": "Nome do produto",
      "quantidade": <numero inteiro>,
      "precoUnitario": <numero float>,
      "precoTotalItem": <numero float>
    }
  ],
  "totalEstimado": <soma total float dos itens sugeridos (se houver, senao 0)>
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
