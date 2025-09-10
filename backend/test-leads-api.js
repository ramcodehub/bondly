import fetch from 'node-fetch';

async function testLeadsAPI() {
  try {
    console.log('Testing leads API...');
    
    // Test the main leads endpoint
    const response = await fetch('http://localhost:5001/api/leads');
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Leads data:', JSON.stringify(data, null, 2));
    } else {
      console.log('Error response:', await response.text());
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testLeadsAPI();