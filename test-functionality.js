// Quick functionality test for VendorHub
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🔍 Testing VendorHub API functionality...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.status);

    // Test 2: Test registration
    console.log('\n2. Testing user registration...');
    const registrationData = {
      name: 'Test Vendor',
      email: `test${Date.now()}@test.com`,
      password: 'password123',
      phone: '+1234567890',
      role: 'vendor'
    };

    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    });

    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ User registration successful');
      
      // Test 3: Test login
      console.log('\n3. Testing user login...');
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registrationData.email,
          password: registrationData.password,
        }),
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ User login successful');
        
        const token = loginData.tokens?.accessToken;
        
        if (token) {
          // Test 4: Test protected route
          console.log('\n4. Testing protected route access...');
          const dashboardResponse = await fetch(`${API_BASE}/vendors`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (dashboardResponse.ok) {
            console.log('✅ Protected route access successful');
          } else {
            console.log('⚠️ Protected route access failed');
          }
        }
      } else {
        console.log('❌ User login failed');
      }
    } else {
      const errorData = await registerResponse.json();
      console.log('❌ User registration failed:', errorData.message);
    }

    console.log('\n🎉 API functionality test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI();
