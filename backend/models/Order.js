const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Order identification
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  
  // Order creator (vendor)
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Assigned supplier (if accepted)
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  // Order type
  type: {
    type: String,
    enum: ['individual', 'group'],
    required: true
  },
  
  // Order details
  title: {
    type: String,
    required: [true, 'Order title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Order description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  
  category: {
    type: String,
    required: true,
    trim: true
  },
  
  // Product images
  images: [{
    url: String,
    publicId: String,
    caption: String
  }],
  
  // Voice note (if provided)
  voiceNote: {
    url: String,
    duration: Number,
    transcript: String
  },
  
  // Quantity and pricing
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  
  estimatedPrice: {
    type: Number,
    required: [true, 'Estimated price is required'],
    min: [0, 'Price cannot be negative']
  },
  
  finalPrice: {
    type: Number,
    default: null
  },
  
  // Group buy specific fields
  groupBuy: {
    isGroupBuy: {
      type: Boolean,
      default: false
    },
    minParticipants: {
      type: Number,
      default: 1
    },
    maxParticipants: {
      type: Number,
      default: 50
    },
    currentParticipants: {
      type: Number,
      default: 1
    },
    participants: [{
      vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      quantity: {
        type: Number,
        required: true
      },
      joinedAt: {
        type: Date,
        default: Date.now
      }
    }],
    deadline: {
      type: Date,
      required: function() { return this.type === 'group'; }
    }
  },
  
  // Delivery information
  delivery: {
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere'
      }
    },
    preferredTime: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'flexible']
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date
  },
  
  // Order status
  status: {
    type: String,
    enum: [
      'pending',           // Waiting for supplier bids
      'bidding',          // Suppliers are bidding
      'accepted',         // Supplier accepted, preparing
      'confirmed',        // Order confirmed by vendor
      'preparing',        // Supplier is preparing order
      'ready',           // Ready for pickup/delivery
      'in_transit',      // On the way
      'delivered',       // Successfully delivered
      'completed',       // Order completed and rated
      'cancelled',       // Order cancelled
      'expired'          // Group buy expired
    ],
    default: 'pending'
  },
  
  // Status timeline
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Supplier bids
  bids: [{
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    message: {
      type: String,
      maxlength: 500
    },
    estimatedTime: {
      type: Number, // in minutes
      required: true
    },
    isAccepted: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Payment information
  payment: {
    method: {
      type: String,
      enum: ['cash', 'card', 'mobile', 'credit'],
      default: 'cash'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending'
    },
    paidAt: Date,
    transactionId: String
  },
  
  // Tracking information
  tracking: {
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number] // [longitude, latitude]
    },
    route: [{
      location: {
        type: [Number] // [longitude, latitude]
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      note: String
    }],
    deliveryPerson: {
      name: String,
      phone: String,
      vehicle: String
    }
  },
  
  // Review and rating
  review: {
    vendorToSupplier: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: {
        type: String,
        maxlength: 500
      },
      createdAt: Date
    },
    supplierToVendor: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: {
        type: String,
        maxlength: 500
      },
      createdAt: Date
    }
  },
  
  // Special requirements
  specialRequirements: {
    type: String,
    maxlength: 500
  },
  
  // Notes and communication
  notes: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: {
      type: String,
      required: true,
      maxlength: 1000
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Cancellation information
  cancellation: {
    reason: String,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: Date,
    refundAmount: Number
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
orderSchema.index({ vendor: 1, status: 1 });
orderSchema.index({ supplier: 1, status: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ type: 1, status: 1 });
orderSchema.index({ category: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ "delivery.address.coordinates": "2dsphere" });

// Virtual for total participants in group buy
orderSchema.virtual('totalParticipants').get(function() {
  return this.groupBuy.participants.length;
});

// Virtual for total quantity in group buy
orderSchema.virtual('totalQuantity').get(function() {
  if (this.type === 'individual') return this.quantity;
  return this.groupBuy.participants.reduce((total, participant) => {
    return total + participant.quantity;
  }, 0);
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.orderNumber = `ORD-${timestamp}-${random}`.toUpperCase();
    
    // Initialize status history
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: 'Order created'
    });
  }
  next();
});

// Method to add participant to group buy
orderSchema.methods.addParticipant = function(vendorId, quantity) {
  if (this.type !== 'group') {
    throw new Error('Cannot add participant to non-group order');
  }
  
  // Check if vendor already participating
  const existingParticipant = this.groupBuy.participants.find(
    p => p.vendor.toString() === vendorId.toString()
  );
  
  if (existingParticipant) {
    existingParticipant.quantity += quantity;
  } else {
    this.groupBuy.participants.push({
      vendor: vendorId,
      quantity: quantity
    });
  }
  
  this.groupBuy.currentParticipants = this.groupBuy.participants.length;
  return this.save();
};

// Method to update status
orderSchema.methods.updateStatus = function(newStatus, note, updatedBy) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note: note,
    updatedBy: updatedBy
  });
  
  return this.save();
};

// Method to add bid
orderSchema.methods.addBid = function(supplierId, price, message, estimatedTime) {
  // Check if supplier already has a bid
  const existingBidIndex = this.bids.findIndex(
    bid => bid.supplier.toString() === supplierId.toString()
  );
  
  if (existingBidIndex > -1) {
    // Update existing bid
    this.bids[existingBidIndex].price = price;
    this.bids[existingBidIndex].message = message;
    this.bids[existingBidIndex].estimatedTime = estimatedTime;
    this.bids[existingBidIndex].createdAt = new Date();
  } else {
    // Add new bid
    this.bids.push({
      supplier: supplierId,
      price: price,
      message: message,
      estimatedTime: estimatedTime
    });
  }
  
  // Update status to bidding if it's still pending
  if (this.status === 'pending') {
    this.status = 'bidding';
  }
  
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema);
