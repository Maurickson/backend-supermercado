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
  { name: 'Cebola Branca (1kg)', type: 'Hortifruti', description: 'Cebola a granel', price: 4.50, stock: 50, quantitySold: 0, validity: new Date('2026-07-10') }
];

async function seedProducts() {
  await connectDB();

  try {
    await Product.insertMany(newProducts);
    console.log(`✅ ${newProducts.length} produtos adicionados com sucesso ao banco!`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

seedProducts();
