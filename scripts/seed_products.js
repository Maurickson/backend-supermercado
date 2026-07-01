const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('../src/services/mongodb');
const Product = require('../src/models/productModel');

const newProducts = [
  { name: 'Pão de Forma Tradicional 500g', type: 'Padaria', description: 'Pão de forma macio e fresquinho', price: 6.99, stock: 50, quantitySold: 0, validity: new Date('2026-07-01') },
  { name: 'Leite Integral Longa Vida 1L', type: 'Laticínios', description: 'Leite UHT integral', price: 4.89, stock: 100, quantitySold: 0, validity: new Date('2026-08-01') },
  { name: 'Ovos Brancos Grandes (Dúzia)', type: 'Ovos', description: 'Ovos frescos selecionados', price: 9.50, stock: 30, quantitySold: 0, validity: new Date('2026-07-15') },
  { name: 'Maçã Fuji (1kg)', type: 'Hortifruti', description: 'Maçãs fuji doces e crocantes', price: 8.99, stock: 40, quantitySold: 0, validity: new Date('2026-06-30') },
  { name: 'Banana Prata (1kg)', type: 'Hortifruti', description: 'Banana prata in natura', price: 5.50, stock: 60, quantitySold: 0, validity: new Date('2026-06-25') },
  { name: 'Queijo Mussarela Fatiado 200g', type: 'Laticínios', description: 'Mussarela fatiada fresca', price: 11.90, stock: 25, quantitySold: 0, validity: new Date('2026-07-10') },
  { name: 'Presunto Cozido Fatiado 200g', type: 'Frios', description: 'Presunto de porco fatiado', price: 8.90, stock: 30, quantitySold: 0, validity: new Date('2026-07-10') },
  { name: 'Açúcar Refinado 1kg', type: 'Mercearia', description: 'Açúcar branco refinado', price: 4.20, stock: 100, quantitySold: 0, validity: new Date('2027-01-01') },
  { name: 'Sal Refinado 1kg', type: 'Mercearia', description: 'Sal marinho iodado', price: 2.50, stock: 80, quantitySold: 0, validity: new Date('2027-01-01') },
  { name: 'Óleo de Soja 900ml', type: 'Mercearia', description: 'Óleo de soja puro', price: 6.80, stock: 90, quantitySold: 0, validity: new Date('2027-01-01') },
  { name: 'Molho de Tomate Tradicional 340g', type: 'Mercearia', description: 'Molho de tomate pronto', price: 2.99, stock: 150, quantitySold: 0, validity: new Date('2027-01-01') },
  { name: 'Bolo de Laranja Pullman 250g', type: 'Padaria', description: 'Bolo pronto sabor laranja', price: 7.50, stock: 20, quantitySold: 0, validity: new Date('2026-07-05') },
  { name: 'Suco de Laranja Integral 1L', type: 'Bebidas', description: 'Suco 100% natural', price: 12.90, stock: 40, quantitySold: 0, validity: new Date('2026-08-01') },
  { name: 'Biscoito Água e Sal 200g', type: 'Biscoitos', description: 'Biscoito crocante e leve', price: 3.50, stock: 60, quantitySold: 0, validity: new Date('2026-12-01') },
  { name: 'Achocolatado em Pó Nescau 400g', type: 'Matinais', description: 'Achocolatado com vitaminas', price: 8.90, stock: 70, quantitySold: 0, validity: new Date('2026-12-01') },
  { name: 'Creme Dental Sorriso 90g', type: 'Higiene Pessoal', description: 'Pasta de dente proteção anticárie', price: 3.80, stock: 100, quantitySold: 0, validity: new Date('2028-01-01') },
  { name: 'Papel Higiênico Folha Dupla (4 rolos)', type: 'Higiene Pessoal', description: 'Papel higiênico macio', price: 6.90, stock: 80, quantitySold: 0, validity: new Date('2030-01-01') },
  { name: 'Detergente Líquido Ypê Neutro 500ml', type: 'Limpeza', description: 'Detergente para louças', price: 2.20, stock: 200, quantitySold: 0, validity: new Date('2028-01-01') },
  { name: 'Coxão Mole Bovino (1kg)', type: 'Açougue', description: 'Carne bovina fresca', price: 35.90, stock: 15, quantitySold: 0, validity: new Date('2026-06-25') },
  { name: 'Cebola Branca (1kg)', type: 'Hortifruti', description: 'Cebola a granel', price: 4.50, stock: 50, quantitySold: 0, validity: new Date('2026-07-10') },
  
  // Bebidas
  { name: 'Coca-Cola 2L', type: 'Bebidas', description: 'Refrigerante Cola', price: 9.99, stock: 100, quantitySold: 0, validity: new Date('2027-01-01') },
  { name: 'Cerveja Heineken Long Neck 330ml', type: 'Bebidas', description: 'Cerveja puro malte', price: 6.50, stock: 120, quantitySold: 0, validity: new Date('2027-01-01') },
  { name: 'Vinho Tinto Cabernet Sauvignon 750ml', type: 'Bebidas', description: 'Vinho tinto seco', price: 45.00, stock: 30, quantitySold: 0, validity: new Date('2030-01-01') },
  { name: 'Água Mineral sem Gás 1.5L', type: 'Bebidas', description: 'Água mineral natural', price: 3.20, stock: 200, quantitySold: 0, validity: new Date('2027-01-01') },
  { name: 'Refrigerante Guaraná Antarctica 2L', type: 'Bebidas', description: 'Refrigerante sabor guaraná', price: 8.50, stock: 80, quantitySold: 0, validity: new Date('2027-01-01') },

  // Sobremesas
  { name: 'Sorvete Kibon Napolitano 1.5L', type: 'Sobremesas', description: 'Sorvete 3 sabores', price: 22.90, stock: 40, quantitySold: 0, validity: new Date('2026-12-01') },
  { name: 'Pudim de Leite Condensado 500g', type: 'Sobremesas', description: 'Pudim pronto para consumo', price: 15.90, stock: 20, quantitySold: 0, validity: new Date('2026-07-10') },
  { name: 'Barra de Chocolate Garoto Ao Leite 90g', type: 'Sobremesas', description: 'Chocolate ao leite', price: 5.50, stock: 150, quantitySold: 0, validity: new Date('2027-01-01') },
  { name: 'Goiabada Cascão 300g', type: 'Sobremesas', description: 'Doce de goiaba tradicional', price: 7.80, stock: 50, quantitySold: 0, validity: new Date('2027-01-01') },
  { name: 'Leite Condensado Moça 395g', type: 'Mercearia', description: 'Leite condensado integral', price: 6.99, stock: 100, quantitySold: 0, validity: new Date('2027-01-01') },

  // Entradas e Petiscos
  { name: 'Pão de Alho Tradicional 400g', type: 'Padaria', description: 'Pão de alho para churrasco', price: 12.90, stock: 60, quantitySold: 0, validity: new Date('2026-08-01') },
  { name: 'Queijo Coalho no Espeto 300g', type: 'Laticínios', description: 'Queijo coalho para assar', price: 18.50, stock: 40, quantitySold: 0, validity: new Date('2026-08-01') },
  { name: 'Patê de Atum 150g', type: 'Mercearia', description: 'Patê sabor atum', price: 6.20, stock: 40, quantitySold: 0, validity: new Date('2027-01-01') },
  { name: 'Torrada Salgada Bauducco 140g', type: 'Biscoitos', description: 'Torradas crocantes', price: 4.50, stock: 80, quantitySold: 0, validity: new Date('2027-01-01') },
  { name: 'Azeitona Verde Sem Caroço 200g', type: 'Mercearia', description: 'Azeitonas em conserva', price: 8.90, stock: 50, quantitySold: 0, validity: new Date('2027-01-01') },

  // Pratos Principais (Ingredientes)
  { name: 'Peito de Frango Congelado 1kg', type: 'Açougue', description: 'Cortes de peito de frango', price: 19.90, stock: 50, quantitySold: 0, validity: new Date('2026-12-01') },
  { name: 'Picanha Bovina Fatiada 1kg', type: 'Açougue', description: 'Picanha premium fatiada', price: 89.90, stock: 15, quantitySold: 0, validity: new Date('2026-08-01') },
  { name: 'Macarrão Espaguete Barilla 500g', type: 'Mercearia', description: 'Massa de sêmola grano duro', price: 7.90, stock: 100, quantitySold: 0, validity: new Date('2027-01-01') },
  { name: 'Feijão Carioca 1kg', type: 'Mercearia', description: 'Feijão carioca tipo 1', price: 8.50, stock: 120, quantitySold: 0, validity: new Date('2027-01-01') },
  { name: 'Arroz Branco 5kg', type: 'Mercearia', description: 'Arroz branco tipo 1', price: 24.90, stock: 80, quantitySold: 0, validity: new Date('2027-01-01') },
  { name: 'Filé de Salmão Congelado 500g', type: 'Peixaria', description: 'Salmão fresco congelado', price: 45.00, stock: 20, quantitySold: 0, validity: new Date('2026-10-01') }
];

async function seedProducts() {
  await connectDB();

  try {
    console.log('Limpando coleção atual de produtos...');
    await Product.deleteMany({});
    
    console.log('Inserindo novos produtos...');
    await Product.insertMany(newProducts);
    console.log(`✅ ${newProducts.length} produtos adicionados com sucesso ao banco!`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

seedProducts();
