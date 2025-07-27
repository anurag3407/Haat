const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testDirectRegistration() {
  try {
    console.log('🔍 Testing direct user registration...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test user data that matches frontend structure
    const testUserData = {
      name: 'Test User Direct',
      email: 'testdirect@example.com',
      phone: '+1234567890',
      password: 'password123',
      role: 'vendor',
      businessInfo: {
        name: 'Test Business',
        category: 'food',
        description: 'Test description',
        address: 'Test address'
      }
    };

    console.log('Creating user with data:', JSON.stringify(testUserData, null, 2));

    const user = new User(testUserData);
    const savedUser = await user.save();
    
    console.log('✅ User created successfully!');
    console.log('User ID:', savedUser._id);
    console.log('User details:', {
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      businessInfo: savedUser.businessInfo
    });

    // Cleanup
    await User.findByIdAndDelete(savedUser._id);
    console.log('✅ Test user cleaned up');

  } catch (error) {
    console.error('❌ Registration test failed:');
    console.error('Error message:', error.message);
    console.error('Error name:', error.name);
    
    if (error.errors) {
      console.error('Validation errors:');
      Object.keys(error.errors).forEach(key => {
        console.error(`- ${key}: ${error.errors[key].message}`);
      });
    }
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testDirectRegistration();
