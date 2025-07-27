const express = require('express');
const Review = require('../models/Review');
const User = require('../models/User');
const Order = require('../models/Order');
const { 
  authenticateToken, 
  requireVendorOrSupplier,
  reviewRateLimit 
} = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', authenticateToken, requireVendorOrSupplier, reviewRateLimit, async (req, res) => {
  try {
    const {
      orderId,
      revieweeId,
      rating,
      detailedRatings,
      comment,
      tags,
      images
    } = req.body;
    
    // Validation
    if (!orderId || !revieweeId || !rating || !comment) {
      return res.status(400).json({
        message: 'Missing required fields',
        error: 'VALIDATION_ERROR'
      });
    }
    
    // Verify the order exists and user can review it
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
        error: 'ORDER_NOT_FOUND'
      });
    }
    
    // Check if user can review this order
    const isVendor = order.vendor.toString() === req.user._id.toString();
    const isSupplier = order.supplier?.toString() === req.user._id.toString();
    
    if (!isVendor && !isSupplier) {
      return res.status(403).json({
        message: 'You can only review orders you participated in',
        error: 'ACCESS_DENIED'
      });
    }
    
    // Check if order is completed
    if (order.status !== 'completed') {
      return res.status(400).json({
        message: 'Can only review completed orders',
        error: 'ORDER_NOT_COMPLETED'
      });
    }
    
    // Check if review already exists
    const existingReview = await Review.findOne({
      order: orderId,
      reviewer: req.user._id
    });
    
    if (existingReview) {
      return res.status(400).json({
        message: 'You have already reviewed this order',
        error: 'REVIEW_EXISTS'
      });
    }
    
    // Determine review type
    const reviewType = req.user.role === 'vendor' ? 'vendor_to_supplier' : 'supplier_to_vendor';
    
    // Create review
    const reviewData = {
      order: orderId,
      reviewer: req.user._id,
      reviewee: revieweeId,
      type: reviewType,
      rating: parseInt(rating),
      comment: comment.trim(),
      tags: tags || [],
      images: images || []
    };
    
    // Add detailed ratings for supplier reviews
    if (reviewType === 'vendor_to_supplier' && detailedRatings) {
      reviewData.detailedRatings = detailedRatings;
    }
    
    const review = new Review(reviewData);
    await review.save();
    
    // Update reviewee's rating
    const reviewee = await User.findById(revieweeId);
    if (reviewee && reviewee.role === 'supplier') {
      await reviewee.updateSupplierRating(parseInt(rating));
    }
    
    // Populate the review
    await review.populate('reviewer', 'name role businessInfo');
    await review.populate('reviewee', 'name role businessInfo');
    
    res.status(201).json({
      message: 'Review created successfully',
      review
    });
    
  } catch (error) {
    console.error('Review creation error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        error: error.message
      });
    }
    
    res.status(500).json({
      message: 'Server error creating review',
      error: 'REVIEW_CREATION_ERROR'
    });
  }
});

// @route   GET /api/reviews
// @desc    Get reviews with filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      revieweeId,
      reviewerId,
      type,
      rating,
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Build query
    let query = { status: 'active' };
    
    if (revieweeId) {
      query.reviewee = revieweeId;
    }
    
    if (reviewerId) {
      query.reviewer = reviewerId;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (rating) {
      query.rating = { $gte: parseInt(rating) };
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Execute query
    const reviews = await Review.find(query)
      .populate('reviewer', 'name role businessInfo')
      .populate('reviewee', 'name role businessInfo')
      .populate('order', 'orderNumber title')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);
    
    // Get total count for pagination
    const total = await Review.countDocuments(query);
    
    res.json({
      message: 'Reviews retrieved successfully',
      reviews,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });
    
  } catch (error) {
    console.error('Reviews retrieval error:', error);
    
    res.status(500).json({
      message: 'Server error retrieving reviews',
      error: 'REVIEWS_RETRIEVAL_ERROR'
    });
  }
});

// @route   GET /api/reviews/stats/:userId
// @desc    Get review statistics for a user
// @access  Public
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { type } = req.query;
    
    // Get average rating and distribution
    const stats = await Review.getAverageRating(userId, type);
    
    // Get detailed breakdown for suppliers
    let detailedStats = null;
    if (!type || type === 'vendor_to_supplier') {
      const user = await User.findById(userId);
      if (user && user.role === 'supplier') {
        detailedStats = await Review.getDetailedRatingBreakdown(userId);
      }
    }
    
    res.json({
      message: 'Review statistics retrieved successfully',
      stats: {
        ...stats,
        detailed: detailedStats
      }
    });
    
  } catch (error) {
    console.error('Review stats retrieval error:', error);
    
    res.status(500).json({
      message: 'Server error retrieving review statistics',
      error: 'REVIEW_STATS_ERROR'
    });
  }
});

// @route   POST /api/reviews/:id/helpful
// @desc    Mark review as helpful/unhelpful
// @access  Private
router.post('/:id/helpful', authenticateToken, requireVendorOrSupplier, async (req, res) => {
  try {
    const { isHelpful } = req.body;
    
    if (typeof isHelpful !== 'boolean') {
      return res.status(400).json({
        message: 'isHelpful must be a boolean',
        error: 'VALIDATION_ERROR'
      });
    }
    
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        message: 'Review not found',
        error: 'REVIEW_NOT_FOUND'
      });
    }
    
    // Can't vote on own review
    if (review.reviewer.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: 'Cannot vote on your own review',
        error: 'SELF_VOTE'
      });
    }
    
    await review.addHelpfulVote(req.user._id, isHelpful);
    
    res.json({
      message: 'Vote recorded successfully',
      helpfulCount: review.helpfulCount,
      unhelpfulCount: review.unhelpfulCount
    });
    
  } catch (error) {
    console.error('Helpful vote error:', error);
    
    res.status(500).json({
      message: 'Server error recording vote',
      error: 'HELPFUL_VOTE_ERROR'
    });
  }
});

// @route   POST /api/reviews/:id/response
// @desc    Add response to a review
// @access  Private (Review subject only)
router.post('/:id/response', authenticateToken, requireVendorOrSupplier, async (req, res) => {
  try {
    const { message, isPublic = true } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        message: 'Response message is required',
        error: 'MISSING_MESSAGE'
      });
    }
    
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        message: 'Review not found',
        error: 'REVIEW_NOT_FOUND'
      });
    }
    
    // Only the review subject can respond
    if (review.reviewee.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Only the review subject can respond',
        error: 'ACCESS_DENIED'
      });
    }
    
    await review.addResponse(message.trim(), isPublic);
    
    res.json({
      message: 'Response added successfully',
      response: review.response
    });
    
  } catch (error) {
    console.error('Review response error:', error);
    
    res.status(500).json({
      message: 'Server error adding response',
      error: 'REVIEW_RESPONSE_ERROR'
    });
  }
});

module.exports = router;
