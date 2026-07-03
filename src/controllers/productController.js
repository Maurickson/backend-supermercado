const productModel = require('../models/productModel');

// Função para calcular promoção
function applyPromotion(product) {
  const now = new Date();

  if (
    product.hasPromotion &&
    product.promotionPercentage > 0 &&
    (!product.promotionStart || now >= new Date(product.promotionStart)) &&
    (!product.promotionEnd || now <= new Date(product.promotionEnd))
  ) {
    const discount = (product.price * product.promotionPercentage) / 100;

    return {
      ...product._doc,
      finalPrice: Number((product.price - discount).toFixed(2)),
      onPromotion: true,
    };
  }

  return {
    ...product._doc,
    finalPrice: product.price,
    onPromotion: false,
  };
}

// GET — todos os produtos
const getAllProducts = async (req, res) => {
  try {
    const all = await productModel.find();
    const withPromo = all.map(applyPromotion);

    res.status(200).json(withPromo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar produtos' });
  }
};

// GET — produto por ID
const getProductById = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado!' });
    }

    res.status(200).json(applyPromotion(product));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar o produto' });
  }
};

// POST — criar produto
const createProduct = async (req, res) => {
  try {
    const created = await productModel.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Erro ao criar produto!', error: error.message });
  }
};

// PUT — atualizar produto
const updateProduct = async (req, res) => {
  try {
    const updated = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Produto não encontrado!' });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar o produto' });
  }
};

// DELETE — apagar produto
const deleteProduct = async (req, res) => {
  try {
    const deleted = await productModel.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Produto não encontrado!' });
    }

    res.status(200).json({ message: 'Produto deletado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao deletar o produto!' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
