const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  // Order type
  type: {
    type: String,
    enum: ['direct', 'group_buy', 'bid_win'],
    required: true
  },
  
  // Participants
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  
  // Reference to group buy or bid (if applicable)
  groupBuy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GroupBuy'
  },
  bid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid'
  },
  
  // Order items
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['kg', 'gram', 'liter', 'piece', 'dozen', 'quintal'],
      required: true
    },
    pricePerUnit: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    }
  }],
  
  // Pricing
  pricing: {
    subtotal: {
      type: Number,
      required: true
    },
    deliveryCharge: {
      type: Number,
      default: 0
    },
    taxes: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  
  // Timeline
  timeline: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  
  // Delivery details
  delivery: {
    method: {
      type: String,
      enum: ['pickup', 'delivery'],
      required: true
    },
    address: {
      street: String,
      area: String,
      city: String,
      pincode: String,
      coordinates: [Number] // [longitude, latitude]
    },
    scheduledDate: Date,
    deliveredAt: Date,
    deliveryPerson: String,
    trackingNumber: String
  },
  
  // Payment details
  payment: {
    method: {
      type: String,
      enum: ['cash', 'upi', 'bank_transfer'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    dueDate: Date
  },
  
  // Quality and feedback
  feedback: {
    vendorRating: {
      type: Number,
      min: 1,
      max: 5
    },
    vendorComment: String,
    supplierRating: {
      type: Number,
      min: 1,
      max: 5
    },
    supplierComment: String,
    qualityRating: {
      type: Number,
      min: 1,
      max: 5
    },
    deliveryRating: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  
  // Special instructions
  instructions: {
    vendorNotes: String,
    supplierNotes: String,
    deliveryInstructions: String
  }
}, {
  timestamps: true
});

// Index for vendor and supplier queries
OrderSchema.index({ vendor: 1, status: 1 });
OrderSchema.index({ supplier: 1, status: 1 });

// Index for date-based queries
OrderSchema.index({ createdAt: -1 });

// Method to update status and timeline
OrderSchema.methods.updateStatus = function(newStatus, note = '') {
  this.status = newStatus;
  this.timeline.push({
    status: newStatus,
    timestamp: new Date(),
    note: note
  });
  
  return this.save();
};

// Method to calculate total
OrderSchema.methods.calculateTotal = function() {
  const subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  this.pricing.subtotal = subtotal;
  this.pricing.total = subtotal + this.pricing.deliveryCharge + this.pricing.taxes - this.pricing.discount;
  
  return this.save();
};

module.exports = mongoose.model('Order', OrderSchema);
