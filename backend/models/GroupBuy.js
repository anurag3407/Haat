const mongoose = require('mongoose');

const GroupBuySchema = new mongoose.Schema({
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
  
  // Group buy requirements
  requirements: {
    targetQuantity: {
      type: Number,
      required: true
    },
    minimumParticipants: {
      type: Number,
      default: 3
    },
    pricePerUnit: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['kg', 'gram', 'liter', 'piece', 'dozen', 'quintal'],
      required: true
    }
  },
  
  // Geographic constraints
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
      default: 5
    },
    area: String // Area name like "Paharganj Market"
  },
  
  // Current status
  status: {
    type: String,
    enum: ['active', 'closed', 'fulfilled', 'cancelled'],
    default: 'active'
  },
  
  // Timing
  schedule: {
    startTime: {
      type: Date,
      default: Date.now
    },
    endTime: {
      type: Date,
      required: true
    },
    deliveryDate: Date
  },
  
  // Participants
  participants: [{
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['committed', 'paid', 'confirmed', 'cancelled'],
      default: 'committed'
    }
  }],
  
  // Progress tracking
  progress: {
    currentQuantity: {
      type: Number,
      default: 0
    },
    currentParticipants: {
      type: Number,
      default: 0
    },
    completionPercentage: {
      type: Number,
      default: 0
    }
  },
  
  // Additional terms
  terms: {
    paymentDeadline: Date,
    deliveryMethod: {
      type: String,
      enum: ['pickup', 'delivery', 'both'],
      default: 'both'
    },
    cancellationPolicy: String
  }
}, {
  timestamps: true
});

// Index for location-based queries
GroupBuySchema.index({ "location.center": "2dsphere" });

// Index for active group buys
GroupBuySchema.index({ status: 1, 'schedule.endTime': 1 });

// Method to update progress
GroupBuySchema.methods.updateProgress = function() {
  this.progress.currentQuantity = this.participants.reduce((total, p) => 
    p.status !== 'cancelled' ? total + p.quantity : total, 0
  );
  this.progress.currentParticipants = this.participants.filter(p => 
    p.status !== 'cancelled'
  ).length;
  this.progress.completionPercentage = Math.round(
    (this.progress.currentQuantity / this.requirements.targetQuantity) * 100
  );
  
  // Auto-close if target reached or time exceeded
  if (this.progress.currentQuantity >= this.requirements.targetQuantity) {
    this.status = 'closed';
  } else if (new Date() > this.schedule.endTime) {
    this.status = 'cancelled';
  }
  
  return this.save();
};

module.exports = mongoose.model('GroupBuy', GroupBuySchema);
