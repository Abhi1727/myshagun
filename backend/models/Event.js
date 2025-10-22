const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  gifts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'gift',
    },
  ],
});

module.exports = mongoose.model('event', EventSchema);
