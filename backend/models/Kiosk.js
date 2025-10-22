const mongoose = require('mongoose');

const KioskSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'event',
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'inactive',
  },
});

module.exports = mongoose.model('kiosk', KioskSchema);
