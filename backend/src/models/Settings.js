const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  businessEmail: { type: String, required: true },
  businessPhone: { type: String, required: true },
  businessAddress: { type: String, required: true },
  timezone: { type: String, default: 'America/New_York' },
  currency: { type: String, default: 'INR' },
  language: { type: String, default: 'en' },
  notifications: {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    pushNotifications: { type: Boolean, default: true },
    orderUpdates: { type: Boolean, default: true },
    paymentAlerts: { type: Boolean, default: true },
    lowStockAlerts: { type: Boolean, default: true },
    customerMessages: { type: Boolean, default: true }
  },
  security: {
    twoFactorAuth: { type: Boolean, default: false },
    sessionTimeout: { type: Number, default: 30 },
    passwordExpiry: { type: Number, default: 90 },
    loginAttempts: { type: Number, default: 5 }
  },
  payment: {
    stripeEnabled: { type: Boolean, default: true },
    paypalEnabled: { type: Boolean, default: true },
    bankTransferEnabled: { type: Boolean, default: false },
    cashOnDelivery: { type: Boolean, default: true },
    processingFee: { type: Number, default: 2.9 },
    minimumAmount: { type: Number, default: 10.00 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);