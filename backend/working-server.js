require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://vendorhub:vendorhub123@cluster0.cllmh.mongodb.net/vendorhub?retryWrites=true&w=majority';
mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('📝 Using in-memory storage as fallback');
  });

// Mongoose Schemas
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: String,
  phone: String,
  role: { type: String, enum: ['vendor', 'supplier'], required: true },
  businessName: String,
  category: String,
  address: String,
  civilScore: { type: Number, default: 650 },
  createdAt: { type: Date, default: Date.now }
});

const OrderSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  category: String,
  description: String,
  quantity: Number,
  unit: String,
  urgency: { type: String, default: 'normal' },
  deliveryLocation: String,
  maxBudget: Number,
  preferredSuppliers: [String],
  additionalRequirements: String,
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorName: String,
  status: { type: String, default: 'pending' },
  bids: [{
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    supplierName: String,
    price: Number,
    message: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const GroupBuySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: String,
  description: String,
  currentParticipants: { type: Number, default: 1 },
  targetParticipants: { type: Number, required: true },
  currentPrice: Number,
  originalPrice: Number,
  deadline: String,
  organizer: String,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

const ReviewSchema = new mongoose.Schema({
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewerName: String,
  targetId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetName: String,
  targetType: { type: String, enum: ['supplier', 'vendor'], required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  createdAt: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', UserSchema);
const Order = mongoose.model('Order', OrderSchema);
const GroupBuy = mongoose.model('GroupBuy', GroupBuySchema);
const Review = mongoose.model('Review', ReviewSchema);

// In-memory fallback storage
const fallbackData = {
  users: [],
  orders: [],
  groupBuys: [
    {
      id: '1',
      title: 'Bulk Rice Order - Basmati Premium',
      category: 'Grains',
      description: 'High-quality basmati rice in bulk quantities. Perfect for restaurants and food vendors.',
      currentParticipants: 8,
      targetParticipants: 15,
      currentPrice: 2200,
      originalPrice: 2800,
      deadline: '2 days left',
      organizer: 'Raj Food Stall'
    },
    {
      id: '2',
      title: 'Fresh Vegetables Bundle',
      category: 'Produce',
      description: 'Daily fresh vegetables including onions, potatoes, tomatoes, and seasonal greens.',
      currentParticipants: 12,
      targetParticipants: 20,
      currentPrice: 1200,
      originalPrice: 1500,
      deadline: '5 days left',
      organizer: 'Green Veggie Cart'
    }
  ],
  reviews: [],
  suppliers: [
    {
      id: 1,
      name: 'Fresh Farms Supply Co.',
      category: 'Fruits & Vegetables',
      rating: 4.8,
      reviewCount: 156,
      deliveryTime: '2-4 hrs',
      reliability: '98%',
      priceRange: '$$',
      recentReview: {
        text: 'Excellent quality vegetables, always fresh and delivered on time. Highly recommended!',
        author: 'Raj Food Stall'
      }
    },
    {
      id: 2,
      name: 'Spice World Distributors',
      category: 'Spices & Seasonings',
      rating: 4.6,
      reviewCount: 203,
      deliveryTime: '1-2 days',
      reliability: '95%',
      priceRange: '$$$',
      recentReview: {
        text: 'Great variety of spices at competitive prices. Packaging could be better.',
        author: 'Street Kitchen'
      }
    }
  ]
};

// Helper function to check DB connection
const isDBConnected = () => mongoose.connection.readyState === 1;

// ==================== AUTH ENDPOINTS ====================

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Register request:', req.body);
    
    const { name, email, password, phone, role, businessName, category, address } = req.body;

    if (isDBConnected()) {
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = new User({
        name,
        email,
        password: hashedPassword,
        phone,
        role,
        businessName,
        category,
        address
      });

      await user.save();
      console.log('User registered in DB:', user.email);

      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        businessName: user.businessName,
        category: user.category,
        address: user.address
      };

      res.status(201).json({
        message: 'User registered successfully',
        user: userResponse,
        tokens: {
          accessToken: 'demo-access-token-' + Date.now(),
          refreshToken: 'demo-refresh-token-' + Date.now()
        }
      });
    } else {
      // Fallback to in-memory storage
      const existingUser = fallbackData.users.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const user = {
        id: Date.now().toString(),
        name,
        email,
        phone,
        role,
        businessName,
        category,
        address,
        createdAt: new Date()
      };

      fallbackData.users.push(user);
      console.log('User registered in memory:', user.email);

      res.status(201).json({
        message: 'User registered successfully',
        user,
        tokens: {
          accessToken: 'demo-access-token-' + Date.now(),
          refreshToken: 'demo-refresh-token-' + Date.now()
        }
      });
    }

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed: ' + error.message });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login request:', req.body.email);
    
    const { email, password } = req.body;

    if (isDBConnected()) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        businessName: user.businessName,
        category: user.category,
        address: user.address
      };

      res.json({
        message: 'Login successful',
        user: userResponse,
        tokens: {
          accessToken: 'demo-access-token-' + Date.now(),
          refreshToken: 'demo-refresh-token-' + Date.now()
        }
      });
    } else {
      const user = fallbackData.users.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      res.json({
        message: 'Login successful',
        user,
        tokens: {
          accessToken: 'demo-access-token-' + Date.now(),
          refreshToken: 'demo-refresh-token-' + Date.now()
        }
      });
    }

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed: ' + error.message });
  }
});

// ==================== ORDERS ENDPOINTS ====================

// Create order
app.post('/api/orders', async (req, res) => {
  try {
    console.log('Creating order:', req.body);
    
    const orderData = req.body;
    
    if (isDBConnected()) {
      const order = new Order({
        ...orderData,
        vendorId: new mongoose.Types.ObjectId(),
        vendorName: 'Demo User'
      });
      
      await order.save();
      console.log('Order created in DB:', order._id);
      
      res.status(201).json({
        message: 'Order created successfully',
        order: order
      });
    } else {
      const order = {
        id: Date.now().toString(),
        ...orderData,
        vendorId: 'demo-user-id',
        vendorName: 'Demo User',
        status: 'pending',
        bids: [],
        createdAt: new Date()
      };
      
      fallbackData.orders.push(order);
      console.log('Order created in memory:', order.id);
      
      res.status(201).json({
        message: 'Order created successfully',
        order: order
      });
    }
    
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order: ' + error.message });
  }
});

// Get orders
app.get('/api/orders', async (req, res) => {
  try {
    if (isDBConnected()) {
      const orders = await Order.find().sort({ createdAt: -1 });
      res.json({ orders });
    } else {
      res.json({ orders: fallbackData.orders });
    }
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// ==================== GROUP BUY ENDPOINTS ====================

// Get group buys
app.get('/api/groupbuys', async (req, res) => {
  try {
    if (isDBConnected()) {
      const groupBuys = await GroupBuy.find().sort({ createdAt: -1 });
      res.json({ groupBuys });
    } else {
      res.json({ groupBuys: fallbackData.groupBuys });
    }
  } catch (error) {
    console.error('Get group buys error:', error);
    res.status(500).json({ message: 'Failed to fetch group buys' });
  }
});

// Join group buy
app.post('/api/groupbuys/:id/join', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    if (isDBConnected()) {
      const groupBuy = await GroupBuy.findById(id);
      if (!groupBuy) {
        return res.status(404).json({ message: 'Group buy not found' });
      }
      
      if (!groupBuy.participants.includes(userId)) {
        groupBuy.participants.push(userId);
        groupBuy.currentParticipants += 1;
        await groupBuy.save();
      }
      
      res.json({ message: 'Successfully joined group buy', groupBuy });
    } else {
      const groupBuy = fallbackData.groupBuys.find(gb => gb.id === id);
      if (groupBuy && groupBuy.currentParticipants < groupBuy.targetParticipants) {
        groupBuy.currentParticipants += 1;
      }
      res.json({ message: 'Successfully joined group buy', groupBuy });
    }
  } catch (error) {
    console.error('Join group buy error:', error);
    res.status(500).json({ message: 'Failed to join group buy' });
  }
});

// ==================== SUPPLIERS ENDPOINTS ====================

// Get suppliers/ratings
app.get('/api/suppliers', async (req, res) => {
  try {
    if (isDBConnected()) {
      const suppliers = await User.find({ role: 'supplier' }).select('-password');
      
      // Add mock rating data for demo
      const suppliersWithRatings = suppliers.map(supplier => ({
        id: supplier._id,
        name: supplier.businessName || supplier.name,
        category: supplier.category || 'General',
        rating: Math.random() * 2 + 3, // Random rating between 3-5
        reviewCount: Math.floor(Math.random() * 200) + 50,
        deliveryTime: '2-4 hrs',
        reliability: Math.floor(Math.random() * 20) + 80 + '%',
        priceRange: '$$',
        recentReview: {
          text: 'Great service and quality products!',
          author: 'Anonymous User'
        }
      }));
      
      res.json({ suppliers: suppliersWithRatings });
    } else {
      res.json({ suppliers: fallbackData.suppliers });
    }
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({ message: 'Failed to fetch suppliers' });
  }
});

// ==================== REVIEWS ENDPOINTS ====================

// Create review
app.post('/api/reviews', async (req, res) => {
  try {
    const reviewData = req.body;
    
    if (isDBConnected()) {
      const review = new Review({
        ...reviewData,
        reviewerId: new mongoose.Types.ObjectId(),
        reviewerName: 'Demo User',
        targetId: new mongoose.Types.ObjectId()
      });
      
      await review.save();
      res.status(201).json({ message: 'Review created successfully', review });
    } else {
      const review = {
        id: Date.now().toString(),
        ...reviewData,
        reviewerId: 'demo-user-id',
        reviewerName: 'Demo User',
        createdAt: new Date()
      };
      
      fallbackData.reviews.push(review);
      res.status(201).json({ message: 'Review created successfully', review });
    }
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Failed to create review' });
  }
});

// Get reviews
app.get('/api/reviews', async (req, res) => {
  try {
    if (isDBConnected()) {
      const reviews = await Review.find().sort({ createdAt: -1 });
      res.json({ reviews });
    } else {
      res.json({ reviews: fallbackData.reviews });
    }
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

// ==================== CIVIL SCORE ENDPOINTS ====================

// Get civil score
app.get('/api/users/:id/civil-score', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock civil score data
    const civilScoreData = {
      overallScore: Math.floor(Math.random() * 300) + 500, // Score between 500-800
      level: 'Good',
      factors: [
        {
          name: 'Payment History',
          score: Math.floor(Math.random() * 30) + 70,
          description: 'Track record of timely payments to suppliers',
          weight: '35%'
        },
        {
          name: 'Business Longevity',
          score: Math.floor(Math.random() * 30) + 60,
          description: 'How long your business has been operating',
          weight: '25%'
        },
        {
          name: 'Order Frequency',
          score: Math.floor(Math.random() * 30) + 70,
          description: 'Consistency in placing orders',
          weight: '20%'
        },
        {
          name: 'Community Engagement',
          score: Math.floor(Math.random() * 40) + 50,
          description: 'Participation in community activities and reviews',
          weight: '10%'
        },
        {
          name: 'Financial Stability',
          score: Math.floor(Math.random() * 30) + 60,
          description: 'Based on order sizes and payment patterns',
          weight: '10%'
        }
      ],
      improvementTips: [
        'Maintain consistent payment schedules to improve your payment history score',
        'Engage more with the community by leaving reviews and participating in group buys',
        'Consider increasing your order frequency for better supplier relationships'
      ]
    };
    
    res.json(civilScoreData);
  } catch (error) {
    console.error('Get civil score error:', error);
    res.status(500).json({ message: 'Failed to fetch civil score' });
  }
});

// ==================== GENERAL ENDPOINTS ====================

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!', dbConnected: isDBConnected() });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    dbConnected: isDBConnected(),
    users: isDBConnected() ? 'DB' : fallbackData.users.length,
    orders: isDBConnected() ? 'DB' : fallbackData.orders.length
  });
});

// List all users (for testing)
app.get('/api/users', async (req, res) => {
  try {
    if (isDBConnected()) {
      const users = await User.find().select('-password');
      res.json({ users });
    } else {
      res.json({ users: fallbackData.users });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Default route
app.get('/', (req, res) => {
  res.json({ 
    message: 'VendorHub API Server - Full Featured',
    dbConnected: isDBConnected(),
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/orders',
      'GET /api/orders',
      'GET /api/groupbuys',
      'POST /api/groupbuys/:id/join',
      'GET /api/suppliers',
      'POST /api/reviews',
      'GET /api/reviews',
      'GET /api/users/:id/civil-score',
      'GET /api/health',
      'GET /api/users'
    ]
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Full Featured Server running on port ${PORT}`);
  console.log('📋 Available endpoints:');
  console.log('   📝 Auth: /api/auth/register, /api/auth/login');
  console.log('   📦 Orders: /api/orders (GET, POST)');
  console.log('   🛒 Group Buys: /api/groupbuys (GET), /api/groupbuys/:id/join (POST)');
  console.log('   ⭐ Suppliers: /api/suppliers (GET)');
  console.log('   💬 Reviews: /api/reviews (GET, POST)');
  console.log('   📊 Civil Score: /api/users/:id/civil-score (GET)');
  console.log('   🔍 Health: /api/health, /api/users');
});
