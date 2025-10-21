const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  itemName: { 
    type: String, 
    required: true, 
    unique: true 
  },
  category: {
    type: String,
    enum: ['detergent', 'softener', 'stain-remover', 'packaging', 'equipment', 'other'],
    required: true
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  currentStock: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  minStockLevel: { 
    type: Number, 
    default: 10 
  },
  maxStockLevel: { 
    type: Number, 
    default: 100 
  },
  unit: {
    type: String,
    enum: ['kg', 'liter', 'piece', 'box', 'bottle'],
    default: 'piece'
  },
  pricePerUnit: {
    type: Number,
    required: true
  },
  supplier: {
    name: String,
    contact: String,
    email: String
  },
  lastRestocked: {
    type: Date
  },
  expiryDate: {
    type: Date
  },
  location: {
    type: String,
    default: 'Main Storage'
  },
  notes: String,
  status: {
    type: String,
    enum: ['in-stock', 'low-stock', 'out-of-stock', 'discontinued'],
    default: 'in-stock'
  }
}, { timestamps: true });

// Update status based on stock levels
InventorySchema.pre('save', function(next) {
  if (this.currentStock <= 0) {
    this.status = 'out-of-stock';
  } else if (this.currentStock <= this.minStockLevel) {
    this.status = 'low-stock';
  } else {
    this.status = 'in-stock';
  }
  next();
});

// Indexes
InventorySchema.index({ itemName: 1 });
InventorySchema.index({ category: 1 });
InventorySchema.index({ status: 1 });

module.exports = mongoose.model('Inventory', InventorySchema);
