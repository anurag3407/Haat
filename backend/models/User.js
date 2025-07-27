const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
  },
  role: {
    type: String,
    enum: ['vendor', 'supplier'],
    required: [true, 'Role is required']
  },
  avatar: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Location information
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false
    },
    address: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    }
  },
  // Business information
  businessInfo: {
    businessName: {
      type: String,
      trim: true
    },
    businessType: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    operatingHours: {
      start: String,
      end: String
    }
  },
  // Vendor-specific fields
  civilScore: {
    type: Number,
    default: 500,
    min: 0,
    max: 1000
  },
  civilScoreHistory: [{
    score: Number,
    change: Number,
    reason: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  totalOrders: {
    type: Number,
    default: 0
  },
  successfulOrders: {
    type: Number,
    default: 0
  },
  // Supplier-specific fields
  supplierRating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  categories: [{
    type: String,
    trim: true
  }],
  // Refresh token for JWT
  refreshToken: {
    type: String,
    select: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for geospatial queries
userSchema.index({ "location": "2dsphere" });

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ civilScore: -1 });
userSchema.index({ "supplierRating.average": -1 });

// Virtual for success rate
userSchema.virtual('successRate').get(function() {
  if (this.totalOrders === 0) return 0;
  return Math.round((this.successfulOrders / this.totalOrders) * 100);
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update civil score method
userSchema.methods.updateCivilScore = function(change, reason) {
  const previousScore = this.civilScore;
  this.civilScore = Math.max(0, Math.min(1000, this.civilScore + change));
  
  this.civilScoreHistory.push({
    score: this.civilScore,
    change: change,
    reason: reason
  });
  
  // Keep only last 50 score changes
  if (this.civilScoreHistory.length > 50) {
    this.civilScoreHistory = this.civilScoreHistory.slice(-50);
  }
  
  return this.save();
};

// Update supplier rating method
userSchema.methods.updateSupplierRating = function(newRating) {
  const currentTotal = this.supplierRating.average * this.supplierRating.count;
  this.supplierRating.count += 1;
  this.supplierRating.average = (currentTotal + newRating) / this.supplierRating.count;
  
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
