const mongoose = require('mongoose');

// 🧪 Medicine Schema
const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shopkeeper',
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  }
});

// ✅ GeoSpatial Index for location field
medicineSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Medicine', medicineSchema);
