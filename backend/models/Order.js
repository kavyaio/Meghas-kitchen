const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
    }
  ],
  totalAmount: { type: Number, required: true },
  deliveryFee: { type: Number, default: 40 },
  discount: { type: Number, default: 0 },
  tip: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true },
  
  status: { 
    type: String, 
    enum: ['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Confirmed'
  },
  
  paymentMethod: { type: String, required: true }, // UPI, CARD, NETBANKING, COD
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Refund Pending', 'Refunded', 'COD Cancelled'],
    default: 'Pending'
  },
  transactionId: { type: String },
  
  deliveryAddress: { type: String, required: true },
  specialInstructions: { type: String },
  deliveryPartner: {
    name: String,
    phone: String,
    rating: Number
  },
  
  cancellationReason: { type: String },
  cancelledAt: { type: Date }

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
