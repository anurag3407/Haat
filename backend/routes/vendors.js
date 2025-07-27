const express = require('express');
const User = require('../models/User');
const { 
  authenticateToken, 
  requireVendor,
  optionalAuth 
} = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/vendors
// @desc    Get all vendors with filtering
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      civilScore, 
      location, 
      page = 1, 
      limit = 10,
      sortBy = 'civilScore',
      sortOrder = 'desc'
    } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Build query
    let query = { 
      role: 'vendor',
      isActive: true 
    };
    
    if (civilScore) {
      query.civilScore = { $gte: parseInt(civilScore) };
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Execute query
    const vendors = await User.find(query)
      .select('-password -refreshToken -civilScoreHistory')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);
    
    // Get total count for pagination
    const total = await User.countDocuments(query);
    
    res.json({
      message: 'Vendors retrieved successfully',
      vendors,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });
    
  } catch (error) {
    console.error('Vendors retrieval error:', error);
    
    res.status(500).json({
      message: 'Server error retrieving vendors',
      error: 'VENDORS_RETRIEVAL_ERROR'
    });
  }
});

// @route   GET /api/vendors/:id
// @desc    Get single vendor by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const vendor = await User.findOne({
      _id: req.params.id,
      role: 'vendor',
      isActive: true
    }).select('-password -refreshToken');
    
    if (!vendor) {
      return res.status(404).json({
        message: 'Vendor not found',
        error: 'VENDOR_NOT_FOUND'
      });
    }
    
    res.json({
      message: 'Vendor retrieved successfully',
      vendor
    });
    
  } catch (error) {
    console.error('Vendor retrieval error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid vendor ID',
        error: 'INVALID_VENDOR_ID'
      });
    }
    
    res.status(500).json({
      message: 'Server error retrieving vendor',
      error: 'VENDOR_RETRIEVAL_ERROR'
    });
  }
});

// @route   GET /api/vendors/:id/civil-score
// @desc    Get vendor's civil score details
// @access  Private (Vendor themselves or suppliers)
router.get('/:id/civil-score', authenticateToken, async (req, res) => {
  try {
    const vendor = await User.findOne({
      _id: req.params.id,
      role: 'vendor',
      isActive: true
    }).select('civilScore civilScoreHistory totalOrders successfulOrders');
    
    if (!vendor) {
      return res.status(404).json({
        message: 'Vendor not found',
        error: 'VENDOR_NOT_FOUND'
      });
    }
    
    // Check permissions - vendor can see own score, suppliers can see limited info
    const isOwner = req.user._id.toString() === vendor._id.toString();
    
    if (!isOwner && req.user.role !== 'supplier') {
      return res.status(403).json({
        message: 'Access denied',
        error: 'ACCESS_DENIED'
      });
    }
    
    const response = {
      civilScore: vendor.civilScore,
      successRate: vendor.successRate,
      totalOrders: vendor.totalOrders,
      successfulOrders: vendor.successfulOrders
    };
    
    // Only show history to the vendor themselves
    if (isOwner) {
      response.scoreHistory = vendor.civilScoreHistory.slice(-10); // Last 10 changes
    }
    
    res.json({
      message: 'Civil score retrieved successfully',
      data: response
    });
    
  } catch (error) {
    console.error('Civil score retrieval error:', error);
    
    res.status(500).json({
      message: 'Server error retrieving civil score',
      error: 'CIVIL_SCORE_RETRIEVAL_ERROR'
    });
  }
});

module.exports = router;
