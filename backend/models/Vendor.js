const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stallName: {
    type: String,
    required: true
  },
  businessType: {
    type: String,
    enum: ['chaat', 'dosa', 'paratha', 'tea', 'juice', 'fruits', 'vegetables', 'general'],
    required: true
  },
  // Vendor Trust Score (VTS)
  trustScore: {
    score: {
      type: Number,
      default: 50, // Start with neutral score
      min: 0,
      max: 100
    },
    paymentHistory: {
      onTimePayments: { type: Number, default: 0 },
      totalOrders: { type: Number, default: 0 }
    },
    orderCompletionRate: {
      completedOrders: { type: Number, default: 0 },
      totalCommittedOrders: { type: Number, default: 0 }
    },
    supplierReviews: {
      totalReviews: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 }
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  // Business details
  businessHours: {
    open: String,
    close: String
  },
  // Analytics
  analytics: {
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    favoriteSuppliers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' }],
    frequentProducts: [String]
  }
}, {
  timestamps: true
});

// Method to calculate and update trust score
VendorSchema.methods.updateTrustScore = function() {
  const { paymentHistory, orderCompletionRate, supplierReviews } = this.trustScore;
  
  // Payment score (40% weight)
  const paymentScore = paymentHistory.totalOrders > 0 
    ? (paymentHistory.onTimePayments / paymentHistory.totalOrders) * 40 
    : 20; // Default for new vendors
  
  // Completion rate score (35% weight)
  const completionScore = orderCompletionRate.totalCommittedOrders > 0 
    ? (orderCompletionRate.completedOrders / orderCompletionRate.totalCommittedOrders) * 35 
    : 17.5; // Default for new vendors
  
  // Supplier review score (25% weight)
  const reviewScore = supplierReviews.totalReviews > 0 
    ? (supplierReviews.averageRating / 5) * 25 
    : 12.5; // Default for new vendors
  
  this.trustScore.score = Math.round(paymentScore + completionScore + reviewScore);
  this.trustScore.lastUpdated = new Date();
  
  return this.save();
};

module.exports = mongoose.model('Vendor', VendorSchema);
