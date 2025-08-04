// Test script to check if backend APIs are working
const API_BASE = 'http://localhost:8000/api';

async function testAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    console.log(`✅ ${endpoint}:`, data);
    return { success: true, data };
  } catch (error) {
    console.error(`❌ ${endpoint}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 Testing Backend APIs...\n');
  
  // Test basic endpoints
  await testAPI('/health');
  await testAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123',
      phone: '1234567890',
      address: 'Test Address',
      answer: 'test'
    })
  });
  
  // Test admin login
  const adminLogin = await testAPI('/auth/admin-login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@tutor.com',
      password: 'Admin123'
    })
  });
  
  if (adminLogin.success && adminLogin.data.token) {
    const token = adminLogin.data.token;
    console.log('\n🔐 Testing Admin APIs with token...\n');
    
    // Test admin-only endpoints
    await testAPI('/quizzes/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    await testAPI('/notes/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    await testAPI('/courses', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    await testAPI('/students/getAll', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    await testAPI('/teachers/getAll', {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
  
  console.log('\n🏁 API Tests Complete!');
}

// Run tests if this file is executed directly
if (typeof window !== 'undefined') {
  runTests();
}

export { runTests }; 