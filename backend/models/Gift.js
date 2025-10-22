const mongoose = require('mongoose');

const GiftSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'event',
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  amount: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('gift', GiftSchema);
