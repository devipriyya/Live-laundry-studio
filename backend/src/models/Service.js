const mongoose = require('mongoose');
const ServiceSchema = new mongoose.Schema({
  name: String,
  pricePerKg: Number,
  description: String
}, { timestamps: true });
module.exports = mongoose.model('Service', ServiceSchema);
