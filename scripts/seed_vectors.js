const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('../src/services/mongodb');
const Product = require('../src/models/productModel');
const chromaService = require('../src/services/chroma');

async function runSeed() {
  await connectDB();

  try {

    console.log('⏳ Buscando produtos do banco de dados...');
    const products = await Product.find({});
    
    if (products.length === 0) {
      console.log('⚠️ Nenhum produto encontrado no MongoDB.');
      process.exit(0);
    }

    console.log(`✅ Encontrados ${products.length} produtos. Convertendo e enviando para o ChromaDB...`);
    
    // Opcionalmente podemos aplicar promoções antes de mandar pro Chroma
    // const processedProducts = products.map(p => Product.applyPromotion(p));
    
    await chromaService.upsertProducts(products);
    
    console.log('🎉 Sincronização concluída com sucesso!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Erro durante a sincronização:', error);
    process.exit(1);
  }
}

runSeed();
