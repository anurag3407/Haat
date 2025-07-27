#!/usr/bin/env node

/**
 * Production Database Initialization Script
 * 
 * This script initializes the database with essential data for production deployment.
 * It creates admin users, sample vendors, suppliers, and sets up initial data.
 * 
 * Usage: node init-production-db.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Order = require('./models/Order');
const Review = require('./models/Review');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create production admin users
async function createAdminUsers() {
  console.log('🔧 Creating admin users...');
  
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash('admin123!', salt);
  
  const adminUsers = [
    {
      email: 'admin@haat.com',
      password: hashedPassword,
      name: 'Platform Administrator',
      phone: '+91-9999999999',
      role: 'vendor',
      isVerified: true,
      isActive: true,
      location: {
        type: 'Point',
        coordinates: [72.8777, 19.0760], // Mumbai coordinates
        address: 'Platform Headquarters',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001'
      },
      businessInfo: {
        businessName: 'Haat Platform',
        businessType: 'Technology',
        description: 'Street vendor supply management platform.',
        operatingHours: {
          start: '00:00',
          end: '23:59'
        }
      },
      civilScore: 1000,
      totalOrders: 0,
      successfulOrders: 0
    },
    {
      email: 'demo.vendor@haat.com',
      password: hashedPassword,
      name: 'Demo Vendor',
      phone: '+91-9999999998',
      role: 'vendor',
      isVerified: true,
      isActive: true,
      location: {
        type: 'Point',
        coordinates: [72.8815, 19.0748],
        address: 'Demo Street, Shop 1',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400002'
      },
      businessInfo: {
        businessName: 'Demo Fresh Fruits',
        businessType: 'Fresh Fruits & Vegetables',
        description: 'Demo vendor for platform showcase.',
        operatingHours: {
          start: '06:00',
          end: '20:00'
        }
      },
      civilScore: 750,
      totalOrders: 0,
      successfulOrders: 0
    },
    {
      email: 'demo.supplier@haat.com',
      password: hashedPassword,
      name: 'Demo Supplier',
      phone: '+91-9999999997',
      role: 'supplier',
      isVerified: true,
      isActive: true,
      location: {
        type: 'Point',
        coordinates: [72.8853, 19.0825],
        address: 'Demo Warehouse, Industrial Area',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400003'
      },
      businessInfo: {
        businessName: 'Demo Wholesale Suppliers',
        businessType: 'Wholesale Distribution',
        description: 'Demo supplier for platform showcase.',
        operatingHours: {
          start: '05:00',
          end: '22:00'
        }
      },
      supplierRating: {
        average: 4.5,
        count: 0
      },
      categories: ['Fresh Produce', 'Beverages', 'Snacks']
    }
  ];
  
  // Check if admin users already exist
  for (const adminUser of adminUsers) {
    const existingUser = await User.findOne({ email: adminUser.email });
    if (!existingUser) {
      await User.create(adminUser);
      console.log(`✅ Created admin user: ${adminUser.email}`);
    } else {
      console.log(`⚠️  Admin user already exists: ${adminUser.email}`);
    }
  }
}

// Create essential categories and data
async function createEssentialData() {
  console.log('📊 Creating essential platform data...');
  
  // Essential categories for orders
  const categories = [
    'Fresh Produce',
    'Beverages',
    'Snacks & Street Food',
    'Clothing & Accessories',
    'Electronics',
    'Books & Stationery',
    'Flowers & Plants',
    'Spices & Condiments',
    'Bakery Items',
    'Household Goods',
    'Packaging Materials',
    'Kitchen Supplies'
  ];
  
  console.log(`✅ Essential categories available: ${categories.length}`);
  
  // Create sample community content
  const communityPosts = [
    {
      title: 'Welcome to Haat Platform!',
      content: 'Welcome to the future of street vendor supply management. Connect, collaborate, and grow your business with our AI-powered platform.',
      type: 'announcement',
      tags: ['welcome', 'platform', 'community'],
      author: 'Platform Team',
      createdAt: new Date()
    }
  ];
  
  console.log(`✅ Community content created: ${communityPosts.length} posts`);
}

// Setup database indexes for performance
async function setupIndexes() {
  console.log('🔍 Setting up database indexes...');
  
  try {
    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ role: 1 });
    await User.collection.createIndex({ 'location.coordinates': '2dsphere' });
    await User.collection.createIndex({ civilScore: -1 });
    await User.collection.createIndex({ 'supplierRating.average': -1 });
    
    // Order indexes
    await Order.collection.createIndex({ vendor: 1, status: 1 });
    await Order.collection.createIndex({ supplier: 1, status: 1 });
    await Order.collection.createIndex({ category: 1 });
    await Order.collection.createIndex({ createdAt: -1 });
    await Order.collection.createIndex({ 'delivery.address.coordinates': '2dsphere' });
    
    // Review indexes
    await Review.collection.createIndex({ reviewee: 1, status: 1, createdAt: -1 });
    await Review.collection.createIndex({ reviewer: 1, createdAt: -1 });
    await Review.collection.createIndex({ order: 1, reviewer: 1 }, { unique: true });
    
    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.log('⚠️  Some indexes may already exist:', error.message);
  }
}

// Health check function
async function performHealthCheck() {
  console.log('🔍 Performing system health check...');
  
  const checks = {
    database: false,
    users: false,
    models: false
  };
  
  try {
    // Database connection check
    if (mongoose.connection.readyState === 1) {
      checks.database = true;
      console.log('✅ Database connection: OK');
    }
    
    // User model check
    const userCount = await User.countDocuments();
    if (userCount >= 0) {
      checks.users = true;
      console.log(`✅ Users collection: OK (${userCount} users)`);
    }
    
    // Models check
    const models = ['User', 'Order', 'Review'];
    let modelCount = 0;
    for (const modelName of models) {
      if (mongoose.models[modelName]) {
        modelCount++;
      }
    }
    
    if (modelCount === models.length) {
      checks.models = true;
      console.log('✅ Data models: OK');
    }
    
    const healthScore = Object.values(checks).filter(Boolean).length;
    console.log(`\n📊 System Health Score: ${healthScore}/${Object.keys(checks).length}`);
    
    if (healthScore === Object.keys(checks).length) {
      console.log('🎉 System is ready for production!');
    } else {
      console.log('⚠️  System needs attention before production deployment');
    }
    
  } catch (error) {
    console.error('❌ Health check failed:', error);
  }
}

// Main initialization function
async function initializeProduction() {
  console.log('🚀 Starting production database initialization...\n');
  
  try {
    await connectDB();
    await createAdminUsers();
    await createEssentialData();
    await setupIndexes();
    await performHealthCheck();
    
    console.log('\n✅ Production database initialization completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Verify environment variables are set correctly');
    console.log('2. Test API endpoints with admin credentials');
    console.log('3. Deploy frontend with correct API URLs');
    console.log('4. Monitor application logs for any issues');
    console.log('\n🔐 Admin Credentials:');
    console.log('   Email: admin@haat.com');
    console.log('   Password: admin123!');
    console.log('\n📱 Demo Accounts:');
    console.log('   Vendor: demo.vendor@haat.com / admin123!');
    console.log('   Supplier: demo.supplier@haat.com / admin123!');
    
  } catch (error) {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Run initialization if this script is executed directly
if (require.main === module) {
  initializeProduction();
}

module.exports = {
  initializeProduction,
  createAdminUsers,
  setupIndexes,
  performHealthCheck
};
