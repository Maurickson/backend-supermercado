const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: 'Geral',
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    quantitySold: {
      type: Number,
      required: true,
      default: 0,
    },
    validity: {
      type: Date,
      required: true,
    },
    manufactureDate: {
      type: Date,
      required: false,
    },

    hasPromotion: { type: Boolean, default: false },
    promotionPercentage: { type: Number, default: 0 }, // ex: 20 = 20%
    promotionStart: { type: Date, default: null },
    promotionEnd: { type: Date, default: null },
  },
  {
    timestamps: false,
  }
);

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
    };
  }

  return { ...product._doc, finalPrice: product.price };
}
module.exports = mongoose.model('Product', productSchema);
module.exports.applyPromotion = applyPromotion;
