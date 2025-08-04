// Test API integration
const testAPI = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/courses/getall?limit=6');
    const data = await response.json();
    console.log('API Test Result:', data);
    return data;
  } catch (error) {
    console.error('API Test Error:', error);
    return null;
  }
};

// Run test
testAPI(); 