const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const mid = require('../auth-middleware');

// Leitura de produtos é pública (vitrine); escrita exige autenticação (painel admin)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', mid, productController.createProduct);
router.post('/:id/image-from-url', mid, productController.updateProductImageFromUrl);
router.put('/:id', mid, productController.updateProduct);
router.delete('/:id', mid, productController.deleteProduct);

module.exports = router;
