const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { 
  generateTokens, 
  verifyToken, 
  authenticateToken, 
  authRateLimit 
} = require('../middleware/auth');

const router = express.Router();

// Input validation middleware
const validateRegisterInput = (req, res, next) => {
  const { email, password, name, phone, role } = req.body;
  const errors = {};
  
  // Email validation
  if (!email) {
    errors.email = 'Email is required';
  } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    errors.email = 'Please enter a valid email';
  }
  
  // Password validation
  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  // Name validation
  if (!name) {
    errors.name = 'Name is required';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  
  // Phone validation
  if (!phone) {
    errors.phone = 'Phone number is required';
  } else if (!/^\+?[\d\s\-\(\)]+$/.test(phone)) {
    errors.phone = 'Please enter a valid phone number';
  }
  
  // Role validation
  if (!role) {
    errors.role = 'Role is required';
  } else if (!['vendor', 'supplier'].includes(role)) {
    errors.role = 'Role must be either vendor or supplier';
  }
  
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Validation errors',
      errors
    });
  }
  
  next();
};

const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};
  
  if (!email) {
    errors.email = 'Email is required';
  }
  
  if (!password) {
    errors.password = 'Password is required';
  }
  
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Validation errors',
      errors
    });
  }
  
  next();
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authRateLimit, validateRegisterInput, async (req, res) => {
  try {
    const { 
      email, 
      password, 
      name, 
      phone, 
      role,
      businessInfo,
      location,
      categories 
    } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { phone: phone }
      ]
    });
    
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
        error: 'USER_EXISTS',
        field: existingUser.email === email.toLowerCase() ? 'email' : 'phone'
      });
    }
    
    // Create new user
    const userData = {
      email: email.toLowerCase(),
      password,
      name: name.trim(),
      phone: phone.trim(),
      role
    };
    
    // Add optional fields
    if (businessInfo) {
      userData.businessInfo = businessInfo;
    }
    
    if (location && location.coordinates && location.coordinates.length === 2) {
      userData.location = {
        type: 'Point',
        coordinates: location.coordinates,
        address: location.address,
        city: location.city,
        state: location.state,
        zipCode: location.zipCode
      };
    }
    
    if (role === 'supplier' && categories && Array.isArray(categories)) {
      userData.categories = categories.map(cat => cat.trim().toLowerCase());
    }
    
    const user = new User(userData);
    await user.save();
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    
    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();
    
    // Remove sensitive data from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;
    
    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      tokens: {
        accessToken,
        refreshToken
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'ValidatorError' || error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        error: error.message
      });
    }
    
    res.status(500).json({
      message: 'Server error during registration',
      error: 'REGISTRATION_ERROR'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authRateLimit, validateLoginInput, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user with password field
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials',
        error: 'INVALID_CREDENTIALS'
      });
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid credentials',
        error: 'INVALID_CREDENTIALS'
      });
    }
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    
    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();
    
    // Remove sensitive data from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;
    
    res.json({
      message: 'Login successful',
      user: userResponse,
      tokens: {
        accessToken,
        refreshToken
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    
    res.status(500).json({
      message: 'Server error during login',
      error: 'LOGIN_ERROR'
    });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({
        message: 'Refresh token required',
        error: 'MISSING_REFRESH_TOKEN'
      });
    }
    
    // Verify refresh token
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Find user with the refresh token
    const user = await User.findOne({
      _id: decoded.userId,
      refreshToken: refreshToken,
      isActive: true
    }).select('+refreshToken');
    
    if (!user) {
      return res.status(401).json({
        message: 'Invalid refresh token',
        error: 'INVALID_REFRESH_TOKEN'
      });
    }
    
    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
    
    // Update refresh token
    user.refreshToken = newRefreshToken;
    await user.save();
    
    res.json({
      message: 'Token refreshed successfully',
      tokens: {
        accessToken,
        refreshToken: newRefreshToken
      }
    });
    
  } catch (error) {
    console.error('Token refresh error:', error);
    
    if (error.message === 'Token expired') {
      return res.status(401).json({
        message: 'Refresh token expired',
        error: 'REFRESH_TOKEN_EXPIRED'
      });
    }
    
    res.status(401).json({
      message: 'Invalid refresh token',
      error: 'INVALID_REFRESH_TOKEN'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (invalidate refresh token)
// @access  Private
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Clear refresh token
    req.user.refreshToken = null;
    await req.user.save();
    
    res.json({
      message: 'Logout successful'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    
    res.status(500).json({
      message: 'Server error during logout',
      error: 'LOGOUT_ERROR'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authenticateToken, async (req, res) => {
  try {
    // User is already available from authenticateToken middleware
    const user = req.user.toObject();
    
    // Add computed fields
    const additionalData = {};
    
    if (user.role === 'vendor') {
      additionalData.successRate = user.successRate;
    }
    
    if (user.role === 'supplier') {
      additionalData.averageRating = user.supplierRating.average;
      additionalData.totalRatings = user.supplierRating.count;
    }
    
    res.json({
      message: 'Profile retrieved successfully',
      user: { ...user, ...additionalData }
    });
    
  } catch (error) {
    console.error('Profile retrieval error:', error);
    
    res.status(500).json({
      message: 'Server error retrieving profile',
      error: 'PROFILE_ERROR'
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      phone,
      businessInfo,
      location,
      categories
    } = req.body;
    
    const updateData = {};
    
    // Validate and update allowed fields
    if (name && name.trim().length >= 2) {
      updateData.name = name.trim();
    }
    
    if (phone && /^\+?[\d\s\-\(\)]+$/.test(phone)) {
      // Check if phone is already taken by another user
      const existingUser = await User.findOne({
        phone: phone,
        _id: { $ne: req.user._id }
      });
      
      if (existingUser) {
        return res.status(400).json({
          message: 'Phone number already in use',
          error: 'PHONE_IN_USE'
        });
      }
      
      updateData.phone = phone.trim();
    }
    
    if (businessInfo) {
      updateData.businessInfo = {
        ...req.user.businessInfo,
        ...businessInfo
      };
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
    
    if (req.user.role === 'supplier' && categories && Array.isArray(categories)) {
      updateData.categories = categories.map(cat => cat.trim().toLowerCase());
    }
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -refreshToken');
    
    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
    
  } catch (error) {
    console.error('Profile update error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        error: error.message
      });
    }
    
    res.status(500).json({
      message: 'Server error updating profile',
      error: 'PROFILE_UPDATE_ERROR'
    });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Current password and new password are required',
        error: 'MISSING_PASSWORDS'
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'New password must be at least 6 characters',
        error: 'WEAK_PASSWORD'
      });
    }
    
    // Get user with password
    const user = await User.findById(req.user._id).select('+password');
    
    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        message: 'Current password is incorrect',
        error: 'INCORRECT_PASSWORD'
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({
      message: 'Password changed successfully'
    });
    
  } catch (error) {
    console.error('Password change error:', error);
    
    res.status(500).json({
      message: 'Server error changing password',
      error: 'PASSWORD_CHANGE_ERROR'
    });
  }
});

module.exports = router;
