const express = require('express');
const User = require('../models/User');
const { 
  authenticateToken, 
  requireSupplier,
  optionalAuth 
} = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/suppliers
// @desc    Get all suppliers with filtering
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      category, 
      rating, 
      location, 
      page = 1, 
      limit = 10,
      sortBy = 'supplierRating.average',
      sortOrder = 'desc'
    } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Build query
    let query = { 
      role: 'supplier',
      isActive: true 
    };
    
    if (category) {
      query.categories = { $in: [category.toLowerCase()] };
    }
    
    if (rating) {
      query['supplierRating.average'] = { $gte: parseFloat(rating) };
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Execute query
    const suppliers = await User.find(query)
      .select('-password -refreshToken -civilScoreHistory')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);
    
    // Get total count for pagination
    const total = await User.countDocuments(query);
    
    res.json({
      message: 'Suppliers retrieved successfully',
      suppliers,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });
    
  } catch (error) {
    console.error('Suppliers retrieval error:', error);
    
    res.status(500).json({
      message: 'Server error retrieving suppliers',
      error: 'SUPPLIERS_RETRIEVAL_ERROR'
    });
  }
});

// @route   GET /api/suppliers/:id
// @desc    Get single supplier by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const supplier = await User.findOne({
      _id: req.params.id,
      role: 'supplier',
      isActive: true
    }).select('-password -refreshToken');
    
    if (!supplier) {
      return res.status(404).json({
        message: 'Supplier not found',
        error: 'SUPPLIER_NOT_FOUND'
      });
    }
    
    res.json({
      message: 'Supplier retrieved successfully',
      supplier
    });
    
  } catch (error) {
    console.error('Supplier retrieval error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid supplier ID',
        error: 'INVALID_SUPPLIER_ID'
      });
    }
    
    res.status(500).json({
      message: 'Server error retrieving supplier',
      error: 'SUPPLIER_RETRIEVAL_ERROR'
    });
  }
});

// @route   PUT /api/suppliers/profile
// @desc    Update supplier profile
// @access  Private (Suppliers only)
router.put('/profile', authenticateToken, requireSupplier, async (req, res) => {
  try {
    const {
      businessInfo,
      categories,
      location
    } = req.body;
    
    const updateData = {};
    
    if (businessInfo) {
      updateData.businessInfo = {
        ...req.user.businessInfo,
        ...businessInfo
      };
    }
    
    if (categories && Array.isArray(categories)) {
      updateData.categories = categories.map(cat => cat.trim().toLowerCase());
    }
    
    if (location && location.coordinates && location.coordinates.length === 2) {
      updateData.location = {
        type: 'Point',
        coordinates: location.coordinates,
        address: location.address || req.user.location?.address,
        city: location.city || req.user.location?.city,
        state: location.state || req.user.location?.state,
        zipCode: location.zipCode || req.user.location?.zipCode
      };
    }
    
    // Update supplier
    const updatedSupplier = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -refreshToken');
    
    res.json({
      message: 'Supplier profile updated successfully',
      supplier: updatedSupplier
    });
    
  } catch (error) {
    console.error('Supplier profile update error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        error: error.message
      });
    }
    
    res.status(500).json({
      message: 'Server error updating supplier profile',
      error: 'SUPPLIER_PROFILE_UPDATE_ERROR'
    });
  }
});

module.exports = router;
