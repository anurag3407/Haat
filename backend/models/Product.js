const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['vegetables', 'fruits', 'grains', 'spices', 'dairy', 'meat', 'beverages', 'snacks', 'oil', 'general'],
    required: true
  },
  description: String,
  images: [String], // URLs to product images
  
  // Pricing structure
  pricing: {
    basePrice: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['kg', 'gram', 'liter', 'piece', 'dozen', 'quintal'],
      required: true
    },
    minimumQuantity: {
      type: Number,
      default: 1
    },
    // Bulk pricing tiers
    bulkPricing: [{
      minQuantity: Number,
      pricePerUnit: Number
    }]
  },
  
  // Availability
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    stock: {
      type: Number,
      default: 0
    },
    restockDate: Date
  },
  
  // Quality metrics
  quality: {
    grade: {
      type: String,
      enum: ['A', 'B', 'C'],
      default: 'A'
    },
    freshness: {
      type: String,
      enum: ['fresh', 'medium', 'needs_quick_sale']
    },
    expiryDate: Date,
    storageConditions: String
  },
  
  // Location-based pricing (for different markets)
  locationPricing: [{
    area: String,
    priceModifier: Number // percentage adjustment from base price
  }],
  
  // SEO and search
  tags: [String],
  searchTerms: [String],
  
  // Analytics
  analytics: {
    views: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Index for search functionality
ProductSchema.index({ 
  name: 'text', 
  description: 'text', 
  tags: 'text',
  searchTerms: 'text'
});

// Index for category-based queries
ProductSchema.index({ category: 1, 'availability.isAvailable': 1 });

module.exports = mongoose.model('Product', ProductSchema);
