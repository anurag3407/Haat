const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Order = require('./models/Order');
const Review = require('./models/Review');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vendor-supply-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Business categories for realistic data
const businessCategories = [
  'Fresh Fruits & Vegetables',
  'Street Food & Snacks',
  'Beverages & Drinks',
  'Clothing & Accessories',
  'Electronics & Mobile',
  'Books & Stationery',
  'Flowers & Plants',
  'Spices & Condiments',
  'Bakery & Sweets',
  'Household Items',
  'Toys & Games',
  'Jewelry & Crafts'
];

// Order categories
const orderCategories = [
  'Fresh Produce',
  'Prepared Foods',
  'Beverages',
  'Textiles',
  'Electronics',
  'Stationery',
  'Decorative Items',
  'Spices',
  'Baked Goods',
  'Household Supplies',
  'Entertainment',
  'Jewelry'
];

// Mumbai locations for realistic coordinates
const mumbaiBounds = {
  north: 19.2740,
  south: 18.8932,
  east: 72.9781,
  west: 72.7745
};

// Generate random coordinates within Mumbai
function generateMumbaiCoordinates() {
  const lat = Math.random() * (mumbaiBounds.north - mumbaiBounds.south) + mumbaiBounds.south;
  const lng = Math.random() * (mumbaiBounds.east - mumbaiBounds.west) + mumbaiBounds.west;
  return [lng, lat]; // [longitude, latitude] for GeoJSON
}

// Generate random phone number
function generatePhoneNumber() {
  const prefixes = ['+91-98', '+91-97', '+91-96', '+91-95', '+91-94'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  return `${prefix}${number}`;
}

// Generate realistic business names
const vendorBusinessNames = [
  'Raj Fresh Fruits Corner',
  'Maharaja Snack Center',
  'Mumbai Chai Wala',
  'Golden Spice Market',
  'Modern Electronics Hub',
  'Flower Queen Stall',
  'Sweet Dreams Bakery',
  'Fashion Forward Store',
  'Book Paradise Corner',
  'Craft & Creation Store',
  'Daily Needs Mart',
  'Tasty Treats Counter',
  'Green Vegetable Mart',
  'Royal Juice Center',
  'Smart Phone Gallery',
  'Beauty & Style Shop',
  'Kids Wonder World',
  'Home Essential Store',
  'Spice Master Shop',
  'Fresh & Natural Market'
];

const supplierBusinessNames = [
  'Mumbai Wholesale Fruits',
  'City Snack Suppliers',
  'Premium Beverage Distributors',
  'Fashion Forward Wholesale',
  'Tech Solutions Supply',
  'Garden Fresh Wholesale',
  'Bakery Ingredients Supply',
  'Textile Wholesale Hub',
  'Stationery Suppliers Ltd',
  'Craft Materials Wholesale',
  'Daily Essentials Supply',
  'Food Grade Supply Co',
  'Organic Produce Suppliers',
  'Beverage Distribution Co',
  'Electronics Wholesale',
  'Fashion Accessories Supply',
  'Educational Supplies Co',
  'Household Goods Supply',
  'Spice Trading Company',
  'Natural Products Wholesale'
];

// Create dummy users (vendors and suppliers)
async function createUsers() {
  console.log('🔄 Creating users...');
  
  const users = [];
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash('password123', salt);
  
  // Create 30 vendors
  for (let i = 0; i < 30; i++) {
    const coordinates = generateMumbaiCoordinates();
    const businessName = vendorBusinessNames[i % vendorBusinessNames.length];
    const category = businessCategories[Math.floor(Math.random() * businessCategories.length)];
    const totalOrders = Math.floor(Math.random() * 50) + 10;
    const successfulOrders = Math.floor(totalOrders * (0.8 + Math.random() * 0.2));
    
    users.push({
      email: `vendor${i + 1}@example.com`,
      password: hashedPassword,
      name: `Vendor ${i + 1}`,
      phone: generatePhoneNumber(),
      role: 'vendor',
      isVerified: true,
      isActive: true,
      location: {
        type: 'Point',
        coordinates: coordinates,
        address: `Shop ${i + 1}, Street ${Math.floor(i / 5) + 1}`,
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: `40000${Math.floor(Math.random() * 10)}`
      },
      businessInfo: {
        businessName: businessName,
        businessType: category,
        description: `Quality ${category.toLowerCase()} supplier serving Mumbai for over ${Math.floor(Math.random() * 10) + 1} years. Committed to fresh products and excellent service.`,
        operatingHours: {
          start: '08:00',
          end: '20:00'
        }
      },
      civilScore: Math.floor(Math.random() * 400) + 400, // 400-800
      totalOrders: totalOrders,
      successfulOrders: successfulOrders,
      civilScoreHistory: [
        {
          score: Math.floor(Math.random() * 100) + 450,
          change: Math.floor(Math.random() * 20) - 10,
          reason: 'Order completion',
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        }
      ]
    });
  }
  
  // Create 20 suppliers
  for (let i = 0; i < 20; i++) {
    const coordinates = generateMumbaiCoordinates();
    const businessName = supplierBusinessNames[i % supplierBusinessNames.length];
    const category = businessCategories[Math.floor(Math.random() * businessCategories.length)];
    
    users.push({
      email: `supplier${i + 1}@example.com`,
      password: hashedPassword,
      name: `Supplier ${i + 1}`,
      phone: generatePhoneNumber(),
      role: 'supplier',
      isVerified: true,
      isActive: true,
      location: {
        type: 'Point',
        coordinates: coordinates,
        address: `Warehouse ${i + 1}, Industrial Area ${Math.floor(i / 4) + 1}`,
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: `40001${Math.floor(Math.random() * 10)}`
      },
      businessInfo: {
        businessName: businessName,
        businessType: category,
        description: `Wholesale ${category.toLowerCase()} supplier with state-of-the-art storage facilities. Bulk orders welcome with competitive pricing.`,
        operatingHours: {
          start: '06:00',
          end: '22:00'
        }
      },
      supplierRating: {
        average: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0-5.0
        count: Math.floor(Math.random() * 30) + 5
      },
      categories: [category, businessCategories[Math.floor(Math.random() * businessCategories.length)]]
    });
  }
  
  await User.deleteMany({}); // Clear existing users
  const createdUsers = await User.insertMany(users);
  console.log(`✅ Created ${createdUsers.length} users (30 vendors, 20 suppliers)`);
  
  return createdUsers;
}

// Create dummy orders
async function createOrders(users) {
  console.log('🔄 Creating orders...');
  
  const vendors = users.filter(user => user.role === 'vendor');
  const suppliers = users.filter(user => user.role === 'supplier');
  
  const orders = [];
  const orderTitles = [
    'Fresh Organic Apples - 50kg',
    'Premium Samosas for Weekend Sale',
    'Fresh Orange Juice - 100 bottles',
    'Cotton T-Shirts - Assorted Sizes',
    'Mobile Phone Accessories',
    'Fresh Marigold Flowers - 20kg',
    'Whole Wheat Bread - 200 pieces',
    'Fashion Jewelry Collection',
    'School Notebooks - 500 pieces',
    'Handmade Crafts - Assorted',
    'Kitchen Utensils Set',
    'Masala Chai Mix - 10kg',
    'Fresh Vegetables Daily Supply',
    'Cold Drinks - Summer Special',
    'Bluetooth Earphones - 25 pieces',
    'Designer Scarves Collection',
    'Children\'s Story Books',
    'Cleaning Supplies Bulk Order',
    'Garam Masala Powder - 5kg',
    'Birthday Cake - Custom Order'
  ];
  
  const orderDescriptions = [
    'Looking for fresh, high-quality organic apples for my fruit stall. Need consistent supply for the next month.',
    'Need crispy samosas for weekend sales. Must be prepared fresh and delivered hot.',
    'Require fresh orange juice bottles for my beverage stall. Looking for bulk pricing.',
    'Need cotton t-shirts in various sizes and colors for my clothing store.',
    'Looking for phone accessories like cases, chargers, and screen protectors.',
    'Need fresh marigold flowers for festival season. Quality and freshness is priority.',
    'Daily supply of whole wheat bread needed for my bakery counter.',
    'Seeking trendy fashion jewelry pieces for my accessories store.',
    'Need school notebooks for back-to-school season. Bulk order preferred.',
    'Looking for handmade crafts and decorative items for gift store.',
    'Need quality kitchen utensils for household goods section.',
    'Premium masala chai mix needed for my tea stall.',
    'Daily fresh vegetable supply needed for morning sales.',
    'Cold drinks needed for summer season. Various flavors preferred.',
    'Bluetooth earphones needed for electronics section.',
    'Designer scarves collection needed for fashion store.',
    'Children\'s story books needed for bookstore section.',
    'Cleaning supplies bulk order for household section.',
    'High-quality garam masala powder needed for spice store.',
    'Custom birthday cake order needed for special occasion.'
  ];
  
  // Create 100 orders with various statuses
  for (let i = 0; i < 100; i++) {
    const vendor = vendors[Math.floor(Math.random() * vendors.length)];
    const supplier = Math.random() > 0.3 ? suppliers[Math.floor(Math.random() * suppliers.length)] : null;
    const category = orderCategories[Math.floor(Math.random() * orderCategories.length)];
    const title = orderTitles[i % orderTitles.length];
    const description = orderDescriptions[i % orderDescriptions.length];
    
    const isGroupBuy = Math.random() > 0.7;
    const quantity = Math.floor(Math.random() * 50) + 5;
    const estimatedPrice = Math.floor(Math.random() * 5000) + 500;
    
    // Determine order status based on creation time
    const createdDaysAgo = Math.floor(Math.random() * 30);
    const createdAt = new Date(Date.now() - createdDaysAgo * 24 * 60 * 60 * 1000);
    
    let status = 'pending';
    let finalPrice = null;
    
    if (createdDaysAgo > 20) {
      status = Math.random() > 0.1 ? 'completed' : 'cancelled';
      if (status === 'completed') finalPrice = estimatedPrice * (0.9 + Math.random() * 0.2);
    } else if (createdDaysAgo > 15) {
      status = ['delivered', 'completed', 'cancelled'][Math.floor(Math.random() * 3)];
      if (status !== 'cancelled') finalPrice = estimatedPrice * (0.9 + Math.random() * 0.2);
    } else if (createdDaysAgo > 10) {
      status = ['preparing', 'ready', 'in_transit', 'delivered'][Math.floor(Math.random() * 4)];
      if (supplier) finalPrice = estimatedPrice * (0.9 + Math.random() * 0.2);
    } else if (createdDaysAgo > 5) {
      status = ['accepted', 'confirmed', 'preparing'][Math.floor(Math.random() * 3)];
      if (supplier) finalPrice = estimatedPrice * (0.9 + Math.random() * 0.2);
    } else if (createdDaysAgo > 2) {
      status = ['bidding', 'accepted'][Math.floor(Math.random() * 2)];
    }
    
    const order = {
      orderNumber: `ORD-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase(),
      vendor: vendor._id,
      supplier: supplier ? supplier._id : null,
      type: isGroupBuy ? 'group' : 'individual',
      title,
      description,
      category,
      quantity,
      estimatedPrice,
      finalPrice,
      groupBuy: isGroupBuy ? {
        isGroupBuy: true,
        minParticipants: Math.floor(Math.random() * 3) + 2,
        maxParticipants: Math.floor(Math.random() * 10) + 5,
        currentParticipants: Math.floor(Math.random() * 3) + 1,
        participants: [],
        deadline: new Date(Date.now() + (Math.random() * 7 + 1) * 24 * 60 * 60 * 1000)
      } : { isGroupBuy: false },
      delivery: {
        address: {
          street: vendor.location.address,
          city: vendor.location.city,
          state: vendor.location.state,
          zipCode: vendor.location.zipCode,
          coordinates: vendor.location.coordinates
        },
        preferredTime: ['morning', 'afternoon', 'evening', 'flexible'][Math.floor(Math.random() * 4)],
        urgency: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
      },
      status,
      statusHistory: [
        {
          status: 'pending',
          timestamp: createdAt,
          note: 'Order created',
          updatedBy: vendor._id
        }
      ],
      bids: supplier ? [{
        supplier: supplier._id,
        price: finalPrice || estimatedPrice * (0.9 + Math.random() * 0.2),
        message: 'I can provide high-quality products as per your requirements.',
        estimatedTime: Math.floor(Math.random() * 120) + 30,
        isAccepted: status !== 'pending' && status !== 'bidding',
        createdAt: new Date(createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000)
      }] : [],
      payment: {
        method: ['cash', 'card', 'mobile'][Math.floor(Math.random() * 3)],
        status: status === 'completed' ? 'paid' : 'pending'
      },
      createdAt,
      updatedAt: new Date(createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000)
    };
    
    // Add more status history for progressed orders
    if (status !== 'pending') {
      const statuses = ['bidding', 'accepted', 'confirmed', 'preparing', 'ready', 'in_transit', 'delivered', 'completed'];
      const currentIndex = statuses.indexOf(status);
      
      for (let j = 1; j <= currentIndex; j++) {
        order.statusHistory.push({
          status: statuses[j],
          timestamp: new Date(createdAt.getTime() + j * 24 * 60 * 60 * 1000),
          note: `Order ${statuses[j]}`,
          updatedBy: statuses[j] === 'accepted' || statuses[j] === 'preparing' ? (supplier ? supplier._id : vendor._id) : vendor._id
        });
      }
    }
    
    orders.push(order);
  }
  
  await Order.deleteMany({}); // Clear existing orders
  const createdOrders = await Order.insertMany(orders);
  console.log(`✅ Created ${createdOrders.length} orders`);
  
  return createdOrders;
}

// Create dummy reviews
async function createReviews(users, orders) {
  console.log('🔄 Creating reviews...');
  
  const reviews = [];
  const completedOrders = orders.filter(order => order.status === 'completed');
  
  // Create reviews for 80% of completed orders
  const ordersToReview = completedOrders.slice(0, Math.floor(completedOrders.length * 0.8));
  
  const reviewComments = {
    positive: [
      'Excellent service! Products were fresh and delivered on time.',
      'Very professional supplier. Will definitely order again.',
      'Great quality products at competitive prices. Highly recommended!',
      'Outstanding service and communication throughout the process.',
      'Fresh products, timely delivery, and excellent packaging.',
      'Reliable supplier with consistent quality. Very satisfied!',
      'Professional approach and high-quality products. Recommended!',
      'Great experience working with this supplier. Will continue ordering.',
      'Excellent quality control and customer service.',
      'Very responsive and delivers exactly what was promised.'
    ],
    neutral: [
      'Good service overall. Products met expectations.',
      'Decent quality and reasonable prices. Would consider again.',
      'Service was okay. Products were as described.',
      'Average experience. Nothing exceptional but satisfactory.',
      'Products were good quality but delivery was slightly delayed.',
      'Fair pricing and decent quality. Room for improvement in communication.',
      'Satisfied with the order. Products were as expected.',
      'Good supplier but packaging could be better.',
      'Reasonable service with standard quality products.',
      'Acceptable quality and service. Would order again if needed.'
    ],
    negative: [
      'Products were not as fresh as expected. Disappointed.',
      'Delivery was delayed and communication was poor.',
      'Quality was below expectations for the price paid.',
      'Had issues with packaging. Some items were damaged.',
      'Service was slow and unresponsive to queries.',
      'Products did not match the description provided.',
      'Expensive for the quality received. Not satisfied.',
      'Poor communication and delayed responses.',
      'Quality control needs improvement. Found defective items.',
      'Not reliable for urgent orders. Delayed delivery.'
    ]
  };
  
  for (const order of ordersToReview) {
    if (!order.supplier) continue;
    
    // Vendor to Supplier review (most common)
    if (Math.random() > 0.1) {
      const rating = Math.random() > 0.8 ? 
        (Math.random() > 0.5 ? 5 : 4) : // 80% positive (4-5 stars)
        (Math.random() > 0.7 ? 3 : (Math.random() > 0.5 ? 2 : 1)); // 20% negative (1-3 stars)
      
      let commentCategory = 'neutral';
      if (rating >= 4) commentCategory = 'positive';
      else if (rating <= 2) commentCategory = 'negative';
      
      const comments = reviewComments[commentCategory];
      const comment = comments[Math.floor(Math.random() * comments.length)];
      
      reviews.push({
        order: order._id,
        reviewer: order.vendor,
        reviewee: order.supplier,
        type: 'vendor_to_supplier',
        rating,
        detailedRatings: {
          quality: Math.max(1, Math.min(5, rating + (Math.random() - 0.5))),
          timeliness: Math.max(1, Math.min(5, rating + (Math.random() - 0.5))),
          communication: Math.max(1, Math.min(5, rating + (Math.random() - 0.5))),
          pricing: Math.max(1, Math.min(5, rating + (Math.random() - 0.5))),
          packaging: Math.max(1, Math.min(5, rating + (Math.random() - 0.5)))
        },
        comment,
        tags: rating >= 4 ? ['reliable', 'professional', 'quality'] : 
              rating >= 3 ? ['average', 'decent'] : 
              ['disappointing', 'issues'],
        helpfulVotes: Array.from({ length: Math.floor(Math.random() * 10) }, () => ({
          user: users[Math.floor(Math.random() * users.length)]._id,
          isHelpful: Math.random() > 0.3,
          votedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        })),
        status: 'active',
        createdAt: new Date(order.updatedAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000)
      });
    }
    
    // Supplier to Vendor review (less common)
    if (Math.random() > 0.4) {
      const rating = Math.random() > 0.9 ? 
        (Math.random() > 0.5 ? 5 : 4) : // 90% positive
        3; // 10% neutral
      
      const supplierComments = [
        'Great vendor to work with. Clear requirements and prompt payment.',
        'Professional vendor with good communication. Recommended!',
        'Easy to work with and pays on time. Good business relationship.',
        'Clear about requirements and flexible with delivery times.',
        'Reliable vendor who maintains good business relationships.',
        'Professional approach and clear communication throughout.',
        'Good vendor who understands quality requirements.',
        'Prompt payment and clear instructions. Pleasure to work with.',
        'Maintains good business ethics and pays as agreed.',
        'Easy to communicate with and reasonable in expectations.'
      ];
      
      reviews.push({
        order: order._id,
        reviewer: order.supplier,
        reviewee: order.vendor,
        type: 'supplier_to_vendor',
        rating,
        comment: supplierComments[Math.floor(Math.random() * supplierComments.length)],
        tags: ['professional', 'reliable', 'payment'],
        helpfulVotes: Array.from({ length: Math.floor(Math.random() * 5) }, () => ({
          user: users[Math.floor(Math.random() * users.length)]._id,
          isHelpful: Math.random() > 0.2,
          votedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        })),
        status: 'active',
        createdAt: new Date(order.updatedAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000)
      });
    }
  }
  
  await Review.deleteMany({}); // Clear existing reviews
  const createdReviews = await Review.insertMany(reviews);
  console.log(`✅ Created ${createdReviews.length} reviews`);
  
  // Update supplier ratings based on reviews
  for (const supplier of users.filter(u => u.role === 'supplier')) {
    const supplierReviews = createdReviews.filter(r => 
      r.reviewee.toString() === supplier._id.toString() && r.type === 'vendor_to_supplier'
    );
    
    if (supplierReviews.length > 0) {
      const avgRating = supplierReviews.reduce((sum, review) => sum + review.rating, 0) / supplierReviews.length;
      
      await User.findByIdAndUpdate(supplier._id, {
        'supplierRating.average': Math.round(avgRating * 10) / 10,
        'supplierRating.count': supplierReviews.length
      });
    }
  }
  
  console.log('✅ Updated supplier ratings based on reviews');
  
  return createdReviews;
}

// Main population function
async function populateDatabase() {
  try {
    console.log('🚀 Starting database population...');
    
    const users = await createUsers();
    const orders = await createOrders(users);
    const reviews = await createReviews(users, orders);
    
    console.log('\n📊 Population Summary:');
    console.log(`👥 Users: ${users.length} (30 vendors, 20 suppliers)`);
    console.log(`📦 Orders: ${orders.length}`);
    console.log(`⭐ Reviews: ${reviews.length}`);
    
    console.log('\n✅ Database population completed successfully!');
    
    // Display some sample data
    console.log('\n📋 Sample Data Created:');
    
    const sampleVendor = users.find(u => u.role === 'vendor');
    console.log(`\n🏪 Sample Vendor: ${sampleVendor.name}`);
    console.log(`   Business: ${sampleVendor.businessInfo.businessName}`);
    console.log(`   Civil Score: ${sampleVendor.civilScore}`);
    console.log(`   Location: ${sampleVendor.location.city}`);
    
    const sampleSupplier = users.find(u => u.role === 'supplier');
    console.log(`\n🏭 Sample Supplier: ${sampleSupplier.name}`);
    console.log(`   Business: ${sampleSupplier.businessInfo.businessName}`);
    console.log(`   Rating: ${sampleSupplier.supplierRating.average}/5 (${sampleSupplier.supplierRating.count} reviews)`);
    
    const sampleOrder = orders[0];
    console.log(`\n📦 Sample Order: ${sampleOrder.title}`);
    console.log(`   Category: ${sampleOrder.category}`);
    console.log(`   Status: ${sampleOrder.status}`);
    console.log(`   Price: ₹${sampleOrder.estimatedPrice}`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error populating database:', error);
    process.exit(1);
  }
}

// Run the population
populateDatabase();
