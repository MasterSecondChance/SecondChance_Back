const axios = require('axios').default;
const MongoLib = require('../lib/mongo');

/**
 * 🔐 Test Auth Endpoint Script
 * Diagnoses authentication issues with /api/auth/token
 */

async function testAuthEndpoint() {
  console.log('🔐 Testing Auth Endpoint Diagnostics');
  console.log('=====================================');
  
  try {
    // 1. Check if users exist in database
    console.log('\n1️⃣  Checking database users...');
    const mongoDB = new MongoLib();
    const users = await mongoDB.getAll('users', {});
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
      console.log('💡 Run: npm run seed');
      return;
    }
    
    console.log(`✅ Found ${users.length} users in database:`);
    users.forEach(user => {
      console.log(`   📱 ${user.phone} - ${user.userName} (${user.email})`);
    });
    
    // 2. Test endpoint without credentials
    console.log('\n2️⃣  Testing endpoint without credentials...');
    try {
      await axios.post('http://localhost:3000/api/auth/token');
      console.log('⚠️  Unexpected success without credentials');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Correctly returns 401 without credentials');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    
    // 3. Test with Basic Auth (correct format)
    console.log('\n3️⃣  Testing with Basic Authentication...');
    const testUser = users[0]; // Use first user
    const credentials = Buffer.from(`${testUser.phone}:Password123!`).toString('base64');
    
    try {
      const response = await axios.post('http://localhost:3000/api/auth/token', {}, {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Authentication successful!');
      console.log('📄 Response:', {
        status: response.status,
        data: {
          access_token: response.data.access_token ? 'TOKEN_PRESENT' : 'NO_TOKEN',
          user: response.data.user ? response.data.user.userName : 'NO_USER',
          articles: response.data.articles
        }
      });
      
    } catch (error) {
      if (error.response) {
        console.log(`❌ Authentication failed with status: ${error.response.status}`);
        console.log('📄 Response data:', error.response.data);
        
        if (error.response.status === 401) {
          console.log('\n🔍 Possible issues:');
          console.log('   1. Wrong password (expected: Password123!)');
          console.log('   2. User not found in database');
          console.log('   3. Password hash mismatch');
          console.log('   4. Basic Auth header malformed');
        }
      } else {
        console.log('❌ Request failed:', error.message);
      }
    }
    
    // 4. Test with JSON body (wrong approach)
    console.log('\n4️⃣  Testing with JSON body (common mistake)...');
    try {
      await axios.post('http://localhost:3000/api/auth/token', {
        phone: testUser.phone,
        password: 'Password123!'
      });
      console.log('⚠️  Unexpected success with JSON body');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Correctly rejects JSON body approach (requires Basic Auth)');
      }
    }
    
    // 5. Show correct usage examples
    console.log('\n📋 CORRECT USAGE EXAMPLES:');
    console.log('==========================');
    
    console.log('\n🌐 Frontend JavaScript:');
    console.log(`
const response = await fetch('http://localhost:3000/api/auth/token', {
  method: 'POST',
  headers: {
    'Authorization': 'Basic ' + btoa('${testUser.phone}:Password123!'),
    'Content-Type': 'application/json'
  }
});`);
    
    console.log('\n📱 cURL Command:');
    console.log(`curl -X POST http://localhost:3000/api/auth/token \\
  -H "Authorization: Basic $(echo -n '${testUser.phone}:Password123!' | base64)"`);
    
    console.log('\n🔧 Axios Example:');
    console.log(`
const axios = require('axios');
const response = await axios.post('http://localhost:3000/api/auth/token', {}, {
  auth: {
    username: '${testUser.phone}',
    password: 'Password123!'
  }
});`);
    
  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

// Execute if called directly
if (require.main === module) {
  testAuthEndpoint();
}

module.exports = testAuthEndpoint; 