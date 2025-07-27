const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // Review identification
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  
  // Reviewer (vendor or supplier)
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Reviewee (supplier or vendor)
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Review type
  type: {
    type: String,
    enum: ['vendor_to_supplier', 'supplier_to_vendor'],
    required: true
  },
  
  // Overall rating
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  
  // Detailed ratings (for suppliers)
  detailedRatings: {
    quality: {
      type: Number,
      min: 1,
      max: 5
    },
    timeliness: {
      type: Number,
      min: 1,
      max: 5
    },
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    pricing: {
      type: Number,
      min: 1,
      max: 5
    },
    packaging: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  
  // Written review
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true,
    minlength: [10, 'Comment must be at least 10 characters'],
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  
  // Review images (optional)
  images: [{
    url: String,
    publicId: String,
    caption: String
  }],
  
  // Tags for categorizing reviews
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Helpful votes from other users
  helpfulVotes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isHelpful: {
      type: Boolean,
      required: true
    },
    votedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Response from reviewee
  response: {
    message: {
      type: String,
      maxlength: 500
    },
    respondedAt: Date,
    isPublic: {
      type: Boolean,
      default: true
    }
  },
  
  // Review verification
  isVerified: {
    type: Boolean,
    default: true // Auto-verified since it's tied to an order
  },
  
  // Report/flag information
  reports: [{
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      enum: ['spam', 'inappropriate', 'fake', 'harassment', 'other'],
      required: true
    },
    description: String,
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Review status
  status: {
    type: String,
    enum: ['active', 'hidden', 'removed'],
    default: 'active'
  },
  
  // Metadata
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  
  // For featured reviews
  isFeatured: {
    type: Boolean,
    default: false
  },
  featuredAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index to ensure one review per order per reviewer
reviewSchema.index({ order: 1, reviewer: 1 }, { unique: true });

// Indexes for performance
reviewSchema.index({ reviewee: 1, status: 1, createdAt: -1 });
reviewSchema.index({ reviewer: 1, createdAt: -1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ type: 1, status: 1 });
reviewSchema.index({ isFeatured: 1, createdAt: -1 });

// Virtual for helpful votes count
reviewSchema.virtual('helpfulCount').get(function() {
  return this.helpfulVotes.filter(vote => vote.isHelpful).length;
});

// Virtual for unhelpful votes count
reviewSchema.virtual('unhelpfulCount').get(function() {
  return this.helpfulVotes.filter(vote => !vote.isHelpful).length;
});

// Virtual for average detailed rating
reviewSchema.virtual('averageDetailedRating').get(function() {
  if (!this.detailedRatings) return this.rating;
  
  const ratings = Object.values(this.detailedRatings).filter(rating => rating != null);
  if (ratings.length === 0) return this.rating;
  
  const sum = ratings.reduce((total, rating) => total + rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
});

// Method to add helpful vote
reviewSchema.methods.addHelpfulVote = function(userId, isHelpful) {
  // Remove existing vote from this user
  this.helpfulVotes = this.helpfulVotes.filter(
    vote => vote.user.toString() !== userId.toString()
  );
  
  // Add new vote
  this.helpfulVotes.push({
    user: userId,
    isHelpful: isHelpful
  });
  
  return this.save();
};

// Method to add response
reviewSchema.methods.addResponse = function(message, isPublic = true) {
  this.response = {
    message: message,
    respondedAt: new Date(),
    isPublic: isPublic
  };
  
  return this.save();
};

// Method to report review
reviewSchema.methods.reportReview = function(reporterId, reason, description) {
  this.reports.push({
    reporter: reporterId,
    reason: reason,
    description: description
  });
  
  return this.save();
};

// Static method to get average rating for a user
reviewSchema.statics.getAverageRating = async function(userId, type = null) {
  const matchCondition = { reviewee: userId, status: 'active' };
  if (type) {
    matchCondition.type = type;
  }
  
  const result = await this.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratings: {
          $push: {
            overall: '$rating',
            detailed: '$detailedRatings'
          }
        }
      }
    }
  ]);
  
  if (result.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }
  
  const data = result[0];
  
  // Calculate rating distribution
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  data.ratings.forEach(rating => {
    const rounded = Math.round(rating.overall);
    distribution[rounded]++;
  });
  
  return {
    averageRating: Math.round(data.averageRating * 10) / 10,
    totalReviews: data.totalReviews,
    distribution: distribution
  };
};

// Static method to get detailed rating breakdown for suppliers
reviewSchema.statics.getDetailedRatingBreakdown = async function(supplierId) {
  const result = await this.aggregate([
    { 
      $match: { 
        reviewee: supplierId, 
        type: 'vendor_to_supplier', 
        status: 'active',
        detailedRatings: { $exists: true }
      } 
    },
    {
      $group: {
        _id: null,
        avgQuality: { $avg: '$detailedRatings.quality' },
        avgTimeliness: { $avg: '$detailedRatings.timeliness' },
        avgCommunication: { $avg: '$detailedRatings.communication' },
        avgPricing: { $avg: '$detailedRatings.pricing' },
        avgPackaging: { $avg: '$detailedRatings.packaging' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);
  
  if (result.length === 0) {
    return {
      quality: 0,
      timeliness: 0,
      communication: 0,
      pricing: 0,
      packaging: 0,
      totalReviews: 0
    };
  }
  
  const data = result[0];
  return {
    quality: Math.round((data.avgQuality || 0) * 10) / 10,
    timeliness: Math.round((data.avgTimeliness || 0) * 10) / 10,
    communication: Math.round((data.avgCommunication || 0) * 10) / 10,
    pricing: Math.round((data.avgPricing || 0) * 10) / 10,
    packaging: Math.round((data.avgPackaging || 0) * 10) / 10,
    totalReviews: data.totalReviews
  };
};

module.exports = mongoose.model('Review', reviewSchema);
