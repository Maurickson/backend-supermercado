const { ChromaClient, CloudClient } = require('chromadb');
const { DefaultEmbeddingFunction } = require('@chroma-core/default-embed');

// CHROMA_MODE=cloud (padrão) usa o Chroma Cloud; CHROMA_MODE=local usa um Chroma
// rodando localmente (ex: via Docker em http://localhost:8000).
const isLocal = (process.env.CHROMA_MODE || 'cloud').toLowerCase() === 'local';

const client = isLocal
  ? new ChromaClient({ path: process.env.CHROMA_LOCAL_URL || 'http://localhost:8000' })
  : new CloudClient({
      apiKey: process.env.CHROMA_API_KEY,
      tenant: process.env.CHROMA_TENANT,
      database: process.env.CHROMA_DATABASE,
    });

console.log(`🧠 ChromaDB em modo: ${isLocal ? 'LOCAL' : 'CLOUD'}`);

const COLLECTION_NAME = 'products';

// Gera os embeddings localmente (roda no próprio Node), sem custo de API externa
const embeddingFunction = new DefaultEmbeddingFunction();

async function getCollection() {
  return await client.getOrCreateCollection({
    name: COLLECTION_NAME,
    embeddingFunction,
    metadata: { "hnsw:space": "cosine" } // Usa similaridade de cosseno
  });
}

/**
 * Insere ou atualiza produtos no banco vetorial
 */
async function upsertProducts(products) {
  const collection = await getCollection();
  
  const ids = products.map(p => p._id.toString());
  // O Documento é o que será transformado em embedding para busca semântica
  const documents = products.map(p => `${p.name}. ${p.description || ''}. Tipo: ${p.type}. Preço: R$${p.price}`);
  // Metadados são dados puros devolvidos após a busca
  const metadatas = products.map(p => ({
    id: p._id.toString(),
    name: p.name,
    price: p.price,
    type: p.type
  }));

  await collection.upsert({
    ids: ids,
    documents: documents,
    metadatas: metadatas
  });

  console.log(`✅ ${products.length} produtos atualizados no ChromaDB.`);
}

/**
 * Busca produtos baseando-se na pergunta do usuário
 */
async function searchSimilarProducts(queryText, nResults = 5) {
  try {
    const collection = await getCollection();
    const results = await collection.query({
      queryTexts: [queryText],
      nResults: nResults
    });

    if (results && results.metadatas && results.metadatas.length > 0) {
      return results.metadatas[0]; // Retorna a lista de metadados dos N produtos mais próximos
    }
    return [];
  } catch (error) {
    console.error("Erro ao buscar no ChromaDB:", error);
    return [];
  }
}

module.exports = {
  upsertProducts,
  searchSimilarProducts
};
