const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true },
  phone: { type: String, required: true, unique: true },
  
  // Profile settings
  address: { type: String },
  diningPreference: { 
    type: String, 
    enum: ['any', 'veg', 'vegan', 'jain'],
    default: 'any' 
  },
  
  // Loyalty and Rewards
  loyaltyPoints: { type: Number, default: 0 },
  membershipTier: { 
    type: String, 
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
    default: 'Bronze' 
  },
  
  // Arrays for relationships
  favoriteOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  savedRestaurants: [{ type: String }],
  
  // Account settings
  emailNotifications: { type: Boolean, default: true },
  smsAlerts: { type: Boolean, default: true },
  twoFactorAuth: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
