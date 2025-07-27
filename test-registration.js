// Test registration API directly
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, 'backend', '.env') });

// User Schema (inline for testing)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['vendor', 'supplier'], required: true },
  businessInfo: {
    name: String,
    category: String,
    description: String,
    address: String
  }
});

const User = mongoose.model('User', userSchema);

async function testRegistration() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const testUser = {
      name: 'Test Vendor',
      email: 'testvendor123@example.com',
      phone: '+1234567890',
      password: 'password123',
      role: 'vendor',
      businessInfo: {
        name: 'Test Business',
        category: 'food',
        description: 'Test business description',
        address: 'Test address'
      }
    };

    console.log('Creating test user...');
    const user = new User(testUser);
    await user.save();
    console.log('✅ User created successfully:', user._id);

    // Clean up
    await User.findByIdAndDelete(user._id);
    console.log('✅ Test user cleaned up');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Error details:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testRegistration();
