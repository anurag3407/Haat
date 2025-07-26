const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  
  // Bid details
  auction: {
    startingPrice: {
      type: Number,
      required: true
    },
    currentPrice: {
      type: Number,
      required: true
    },
    reservePrice: Number, // Minimum price supplier will accept
    quantity: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['kg', 'gram', 'liter', 'piece', 'dozen', 'quintal'],
      required: true
    }
  },
  
  // Timing
  timing: {
    startTime: {
      type: Date,
      default: Date.now
    },
    endTime: {
      type: Date,
      required: true
    },
    duration: {
      type: Number, // in minutes
      required: true
    }
  },
  
  // Bid type
  type: {
    type: String,
    enum: ['flash_bid', 'surplus_sale', 'quick_sale'],
    required: true
  },
  
  // Reasons for bidding (helps vendors make decisions)
  reason: {
    type: String,
    enum: ['surplus_stock', 'quick_expiry', 'end_of_day', 'bulk_clearance']
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'closed', 'completed', 'cancelled'],
    default: 'active'
  },
  
  // Location constraints
  location: {
    center: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number] // [longitude, latitude]
    },
    radius: {
      type: Number, // in kilometers
      default: 10
    }
  },
  
  // Bids from vendors
  bids: [{
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isWinning: {
      type: Boolean,
      default: false
    }
  }],
  
  // Winner details
  winner: {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor'
    },
    winningBid: Number,
    confirmedAt: Date
  },
  
  // Additional conditions
  conditions: {
    paymentMethod: {
      type: String,
      enum: ['cash', 'upi', 'both'],
      default: 'both'
    },
    deliveryRequired: {
      type: Boolean,
      default: false
    },
    inspectionAllowed: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Index for location-based queries
BidSchema.index({ "location.center": "2dsphere" });

// Index for active bids
BidSchema.index({ status: 1, 'timing.endTime': 1 });

// Method to place a bid
BidSchema.methods.placeBid = function(vendorId, amount) {
  // Check if bid is valid
  if (this.status !== 'active' || new Date() > this.timing.endTime) {
    throw new Error('Bidding has ended');
  }
  
  if (amount <= this.auction.currentPrice) {
    throw new Error('Bid must be higher than current price');
  }
  
  // Remove previous winning status
  this.bids.forEach(bid => bid.isWinning = false);
  
  // Add new bid
  this.bids.push({
    vendor: vendorId,
    amount: amount,
    isWinning: true
  });
  
  // Update current price
  this.auction.currentPrice = amount;
  
  return this.save();
};

// Method to close bid
BidSchema.methods.closeBid = function() {
  this.status = 'closed';
  
  // Find winning bid
  const winningBid = this.bids
    .filter(bid => bid.isWinning)
    .sort((a, b) => b.amount - a.amount)[0];
  
  if (winningBid && winningBid.amount >= (this.auction.reservePrice || 0)) {
    this.winner = {
      vendor: winningBid.vendor,
      winningBid: winningBid.amount,
      confirmedAt: new Date()
    };
    this.status = 'completed';
  }
  
  return this.save();
};

module.exports = mongoose.model('Bid', BidSchema);
