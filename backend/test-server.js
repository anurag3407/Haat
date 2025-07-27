require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection with proper error handling
const connectDB = async () => {
  try {
    // Use the MongoDB URI from environment or default to local
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vendorhub';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.log('⚠️  MongoDB connection failed, using in-memory storage');
    console.log('💡 To use MongoDB, ensure it\'s running or update MONGODB_URI');
  }
};

connectDB();

// User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['vendor', 'supplier'], required: true },
  businessName: { type: String },
  category: { type: String },
  address: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Order Schema
const OrderSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productName: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  urgency: { type: String, enum: ['normal', 'urgent', 'asap'], default: 'normal' },
  deliveryLocation: { type: String, required: true },
  maxBudget: { type: Number },
  preferredSuppliers: [{ type: String }],
  additionalRequirements: { type: String },
  status: { type: String, enum: ['open', 'bidding', 'assigned', 'completed', 'cancelled'], default: 'open' },
  bids: [{
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    price: { type: Number },
    deliveryTime: { type: String },
    message: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

// Group Buy Schema
const GroupBuySchema = new mongoose.Schema({
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  currentParticipants: { type: Number, default: 1 },
  targetParticipants: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  deadline: { type: Date, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

const GroupBuy = mongoose.model('GroupBuy', GroupBuySchema);

// Review Schema
const ReviewSchema = new mongoose.Schema({
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  revieweeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  title: { type: String, required: true },
  comment: { type: String, required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', ReviewSchema);

// In-memory storage as fallback
const inMemoryStorage = {
  users: [],
  orders: [],
  groupBuys: [],
  reviews: []
};

// Helper function to use DB or fallback to memory
const useDB = mongoose.connection.readyState === 1;

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Register request:', req.body);
    
    const { name, email, password, phone, role, businessName, category, address } = req.body;

    if (useDB) {
      // Check if user exists in DB
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Create user in DB
      const user = new User({
        name, email, password, phone, role, businessName, category, address
      });
      await user.save();

      const userResponse = user.toObject();
      delete userResponse.password;

      console.log('User registered in DB:', user.email);
      
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
      const existingUser = inMemoryStorage.users.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const user = {
        _id: Date.now().toString(),
        name, email, phone, role, businessName, category, address,
        createdAt: new Date()
      };

      inMemoryStorage.users.push(user);
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

app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login request:', req.body.email);
    
    const { email, password } = req.body;

    let user;
    if (useDB) {
      user = await User.findOne({ email });
    } else {
      user = inMemoryStorage.users.find(u => u.email === email);
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const userResponse = useDB ? user.toObject() : user;
    if (userResponse.password) delete userResponse.password;

    res.json({
      message: 'Login successful',
      user: userResponse,
      tokens: {
        accessToken: 'demo-access-token-' + Date.now(),
        refreshToken: 'demo-refresh-token-' + Date.now()
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Orders API
app.post('/api/orders', async (req, res) => {
  try {
    console.log('Create order request:', req.body);
    
    const orderData = {
      ...req.body,
      vendorId: req.body.vendorId || '507f1f77bcf86cd799439011', // Demo vendor ID
      status: 'open'
    };

    if (useDB) {
      const order = new Order(orderData);
      await order.save();
      console.log('Order created in DB:', order._id);
      res.status(201).json({ message: 'Order created successfully', order });
    } else {
      const order = {
        _id: Date.now().toString(),
        ...orderData,
        createdAt: new Date(),
        bids: []
      };
      inMemoryStorage.orders.push(order);
      console.log('Order created in memory:', order._id);
      res.status(201).json({ message: 'Order created successfully', order });
    }

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    let orders;
    if (useDB) {
      orders = await Order.find().populate('vendorId', 'name businessName').sort({ createdAt: -1 });
    } else {
      orders = inMemoryStorage.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Group Buy API
app.get('/api/groupbuys', async (req, res) => {
  try {
    let groupBuys;
    if (useDB) {
      groupBuys = await GroupBuy.find().populate('organizerId', 'name businessName').sort({ createdAt: -1 });
    } else {
      groupBuys = inMemoryStorage.groupBuys.length > 0 ? inMemoryStorage.groupBuys : [
        {
          _id: '1',
          title: 'Bulk Rice Order - Basmati Premium',
          category: 'Grains',
          description: 'High-quality basmati rice in bulk quantities. Perfect for restaurants and food vendors.',
          currentParticipants: 8,
          targetParticipants: 15,
          currentPrice: 2200,
          originalPrice: 2800,
          deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          organizerId: { name: 'Raj Food Stall', businessName: 'Raj Food Stall' },
          status: 'active',
          createdAt: new Date()
        },
        {
          _id: '2',
          title: 'Fresh Vegetables Bundle',
          category: 'Produce',
          description: 'Daily fresh vegetables including onions, potatoes, tomatoes, and seasonal greens.',
          currentParticipants: 12,
          targetParticipants: 20,
          currentPrice: 1200,
          originalPrice: 1500,
          deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          organizerId: { name: 'Green Veggie Cart', businessName: 'Green Veggie Cart' },
          status: 'active',
          createdAt: new Date()
        }
      ];
    }

    res.json({ groupBuys });
  } catch (error) {
    console.error('Get group buys error:', error);
    res.status(500).json({ message: 'Failed to fetch group buys' });
  }
});

app.post('/api/groupbuys/:id/join', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (useDB) {
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
      const groupBuy = inMemoryStorage.groupBuys.find(gb => gb._id === id);
      if (!groupBuy) {
        return res.status(404).json({ message: 'Group buy not found' });
      }

      if (!groupBuy.participants) groupBuy.participants = [];
      if (!groupBuy.participants.includes(userId)) {
        groupBuy.participants.push(userId);
        groupBuy.currentParticipants += 1;
      }

      res.json({ message: 'Successfully joined group buy', groupBuy });
    }

  } catch (error) {
    console.error('Join group buy error:', error);
    res.status(500).json({ message: 'Failed to join group buy' });
  }
});

// Suppliers/Reviews API
app.get('/api/suppliers', async (req, res) => {
  try {
    let suppliers;
    if (useDB) {
      suppliers = await User.find({ role: 'supplier' }).select('-password');
    } else {
      suppliers = inMemoryStorage.users.filter(u => u.role === 'supplier');
      
      // Add mock suppliers if none exist
      if (suppliers.length === 0) {
        suppliers = [
          {
            _id: 'supplier1',
            name: 'Fresh Farms Supply Co.',
            businessName: 'Fresh Farms Supply Co.',
            category: 'Fruits & Vegetables',
            rating: 4.8,
            reviewCount: 156,
            phone: '+91-9876543210',
            email: 'contact@freshfarms.com'
          },
          {
            _id: 'supplier2',
            name: 'Spice World Distributors',
            businessName: 'Spice World Distributors',
            category: 'Spices & Seasonings',
            rating: 4.6,
            reviewCount: 203,
            phone: '+91-9876543211',
            email: 'info@spiceworld.com'
          }
        ];
      }
    }

    res.json({ suppliers });
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({ message: 'Failed to fetch suppliers' });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    console.log('Create review request:', req.body);
    
    const reviewData = {
      ...req.body,
      reviewerId: req.body.reviewerId || '507f1f77bcf86cd799439011' // Demo reviewer ID
    };

    if (useDB) {
      const review = new Review(reviewData);
      await review.save();
      console.log('Review created in DB:', review._id);
      res.status(201).json({ message: 'Review created successfully', review });
    } else {
      const review = {
        _id: Date.now().toString(),
        ...reviewData,
        createdAt: new Date()
      };
      inMemoryStorage.reviews.push(review);
      console.log('Review created in memory:', review._id);
      res.status(201).json({ message: 'Review created successfully', review });
    }

  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Failed to create review' });
  }
});

app.get('/api/reviews/:supplierId', async (req, res) => {
  try {
    const { supplierId } = req.params;
    
    let reviews;
    if (useDB) {
      reviews = await Review.find({ revieweeId: supplierId }).populate('reviewerId', 'name businessName');
    } else {
      reviews = inMemoryStorage.reviews.filter(r => r.revieweeId === supplierId);
    }

    res.json({ reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    users: users.length
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('✅ Registration and Login endpoints available');
});

module.exports = app;
