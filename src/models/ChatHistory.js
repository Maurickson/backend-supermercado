const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    userQuery: {
      type: String,
      required: true
    },
    assistantResponse: {
      type: Object, // Guardaremos o JSON gerado pela IA
      required: true
    }
  },
  {
    timestamps: true // Cria automaticamente createdAt e updatedAt
  }
);

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
