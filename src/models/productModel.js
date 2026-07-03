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

module.exports = mongoose.model('Product', productSchema);
