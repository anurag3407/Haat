const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Supplier = require('../models/Supplier');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { phone, email, password, name, role, address, businessName, businessType, categories } = req.body;
    
    // Validate required fields
    if (!phone || !email || !password || !name || !role) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    
    if (!['vendor', 'supplier'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email ? 'Email already registered' : 'Phone number already registered' 
      });
    }
    
    // Create new user
    const userData = {
      phone,
      email,
      password,
      name,
      role,
      isVerified: true
    };
    
    // Add address if provided
    if (address) {
      userData.address = address;
    }
    
    const user = new User(userData);
    
    await user.save();
    
    // Create role-specific profile
    if (role === 'vendor') {
      const vendor = new Vendor({
        user: user._id,
        stallName: businessName || `${name}'s Stall`,
        businessType: businessType || 'general'
      });
      await vendor.save();
    } else if (role === 'supplier') {
      const supplier = new Supplier({
        user: user._id,
        businessName: businessName || `${name} Supplies`,
        businessType: businessType || 'wholesaler',
        categories: categories || ['general']
      });
      await supplier.save();
    }
    
    const token = generateToken(user._id);
    
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
        address: user.address
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email or phone number already registered' });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const token = generateToken(user._id);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
        address: user.address
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get role-specific data
    let roleData = null;
    if (user.role === 'vendor') {
      roleData = await Vendor.findOne({ user: user._id });
    } else if (user.role === 'supplier') {
      roleData = await Supplier.findOne({ user: user._id });
    }
    
    res.json({
      user,
      profile: roleData
    });
    
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
