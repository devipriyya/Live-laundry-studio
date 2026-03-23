const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function() { return !this.firebaseUid; } }, // Password required only if no Firebase UID
  phone: { type: String },
  profilePicture: { type: String },
  role: { type: String, enum: ['customer','admin','deliveryBoy','laundryStaff','staff','assistant'], default: 'customer' },
  isBlocked: { type: Boolean, default: false },
  firebaseUid: { type: String, unique: true, sparse: true }, // Add firebaseUid field
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other', 'prefer-not-to-say'], default: 'prefer-not-to-say' },
  bio: { type: String },
  
  // Delivery Boy specific fields
  deliveryBoyInfo: {
    vehicleType: { type: String, enum: ['bike', 'scooter', 'car', 'van', 'bicycle'], default: 'bike' },
    vehicleNumber: { type: String },
    licenseNumber: { type: String },
    licenseExpiry: { type: Date },
    emergencyContact: { type: String },
    emergencyContactName: { type: String },
    bankAccountNumber: { type: String },
    bankName: { type: String },
    ifscCode: { type: String },
    upiId: { type: String },
    workingHours: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '18:00' }
    },
    availableDays: [{ type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }],
    isAvailable: { type: Boolean, default: true },
    currentLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
      lastUpdated: { type: Date }
    },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    totalDeliveries: { type: Number, default: 0 },
    documentsVerified: { type: Boolean, default: false }
  },
  
  // General Staff specific fields
  staffInfo: {
    designation: { type: String },
    department: { type: String },
    salary: { type: Number, default: 0 },
    hireDate: { type: Date },
    address: { type: String },
    emergencyContact: { type: String },
    skills: [{ type: String }],
    gender: { type: String },
    shift: { type: String, default: 'Morning' },
    experience: { type: String },
    idType: { type: String },
    idNumber: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    completedOrders: { type: Number, default: 0 }
  },

  // Laundry Staff specific fields
  laundryStaffInfo: {
    designation: { type: String },
    department: { type: String },
    weeklySchedule: {
      monday: { start: { type: String, default: '09:00' }, end: { type: String, default: '18:00' }, break: { type: String, default: '13:00 - 14:00' } },
      tuesday: { start: { type: String, default: '09:00' }, end: { type: String, default: '18:00' }, break: { type: String, default: '13:00 - 14:00' } },
      wednesday: { start: { type: String, default: '09:00' }, end: { type: String, default: '18:00' }, break: { type: String, default: '13:00 - 14:00' } },
      thursday: { start: { type: String, default: '09:00' }, end: { type: String, default: '18:00' }, break: { type: String, default: '13:00 - 14:00' } },
      friday: { start: { type: String, default: '09:00' }, end: { type: String, default: '18:00' }, break: { type: String, default: '13:00 - 14:00' } },
      saturday: { start: { type: String, default: '09:00' }, end: { type: String, default: '15:00' }, break: { type: String, default: '12:00 - 12:30' } },
      sunday: { start: { type: String, default: 'OFF' }, end: { type: String, default: 'OFF' }, break: { type: String, default: '' } }
    },
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    totalOrdersCompleted: { type: Number, default: 0 },
    workload: { type: Number, default: 0 },
    avgCompletionTime: { type: Number, default: 2.0 } // in hours
  },
  
  addresses: [{
    type: { type: String, enum: ['Home', 'Office', 'Other'], required: true },
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  }],
  preferences: {
    fabricCare: { type: String, enum: ['gentle', 'standard', 'intensive'], default: 'gentle' },
    detergentType: { type: String, enum: ['eco-friendly', 'hypoallergenic', 'standard', 'premium'], default: 'eco-friendly' },
    starchLevel: { type: String, enum: ['none', 'light', 'medium', 'heavy'], default: 'light' },
    specialInstructions: { type: String },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      orderUpdates: { type: Boolean, default: true },
      promotions: { type: Boolean, default: false }
    },
    language: { type: String, default: 'en' },
    currency: { type: String, default: 'USD' },
    theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'light' }
  },
  stats: {
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    loyaltyPoints: { type: Number, default: 0 },
    memberSince: { type: Date, default: Date.now }
  }
}, { timestamps: true });

UserSchema.pre('save', async function(next){
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = function(password) {
  if (!this.password) return false; // Firebase users don't have passwords
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);