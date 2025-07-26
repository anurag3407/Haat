const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  businessName: {
    type: String,
    required: true
  },
  businessType: {
    type: String,
    enum: ['wholesaler', 'distributor', 'farmer', 'manufacturer'],
    required: true
  },
  // Supplier rating system
  rating: {
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    reviews: [{
      vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
      createdAt: { type: Date, default: Date.now }
    }]
  },
  // Business capabilities
  capabilities: {
    minimumOrderValue: { type: Number, default: 0 },
    deliveryRadius: { type: Number, default: 10 }, // in kilometers
    acceptsGroupOrders: { type: Boolean, default: true },
    participatesInBidding: { type: Boolean, default: true }
  },
  // Product categories they supply
  categories: [{
    type: String,
    enum: ['vegetables', 'fruits', 'grains', 'spices', 'dairy', 'meat', 'beverages', 'snacks', 'oil', 'general']
  }],
  // Business verification
  verification: {
    isVerified: { type: Boolean, default: false },
    gstNumber: String,
    licenseNumber: String,
    documents: [String] // URLs to uploaded documents
  },
  // Analytics
  analytics: {
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    topCustomers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }],
    popularProducts: [String]
  }
}, {
  timestamps: true
});

// Method to update rating after review
SupplierSchema.methods.updateRating = function() {
  const reviews = this.rating.reviews;
  if (reviews.length === 0) return;
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating.averageRating = totalRating / reviews.length;
  this.rating.totalReviews = reviews.length;
  
  return this.save();
};

module.exports = mongoose.model('Supplier', SupplierSchema);
