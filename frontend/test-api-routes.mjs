// Test script for API routes
import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:3000' // Assuming local development

async function testLeadsAPI() {
  console.log('\n=== TESTING LEADS API ROUTES ===')
  
  try {
    // Test GET request
    console.log('\n1. Testing GET /api/leads...')
    const getResponse = await fetch(`${BASE_URL}/api/leads`)
    console.log('   Status:', getResponse.status)
    const getData = await getResponse.json()
    console.log('   Response:', Array.isArray(getData) ? `Array with ${getData.length} items` : getData)
    
    // Test POST request
    console.log('\n2. Testing POST /api/leads...')
    const newLead = {
      first_name: 'API Test',
      last_name: 'User',
      email: `api-test-${Date.now()}@example.com`,
      phone: '123-456-7890',
      company: 'API Test Company',
      status: 'New'
    }
    
    const postResponse = await fetch(`${BASE_URL}/api/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newLead)
    })
    
    console.log('   Status:', postResponse.status)
    const postData = await postResponse.json()
    console.log('   Response:', postData)
    
    return postResponse.status === 201
  } catch (error) {
    console.error('❌ Error testing leads API:', error.message)
    return false
  }
}

async function testCompaniesAPI() {
  console.log('\n=== TESTING COMPANIES API ROUTES ===')
  
  try {
    // Test GET request
    console.log('\n1. Testing GET /api/companies...')
    const getResponse = await fetch(`${BASE_URL}/api/companies`)
    console.log('   Status:', getResponse.status)
    const getData = await getResponse.json()
    console.log('   Response:', Array.isArray(getData) ? `Array with ${getData.length} items` : getData)
    
    return getResponse.status === 200
  } catch (error) {
    console.error('❌ Error testing companies API:', error.message)
    return false
  }
}

async function testDealsAPI() {
  console.log('\n=== TESTING DEALS API ROUTES ===')
  
  try {
    // Test GET request
    console.log('\n1. Testing GET /api/deals...')
    const getResponse = await fetch(`${BASE_URL}/api/deals`)
    console.log('   Status:', getResponse.status)
    const getData = await getResponse.json()
    console.log('   Response:', Array.isArray(getData?.data) ? `Array with ${getData.data.length} items` : getData)
    
    return getResponse.status === 200
  } catch (error) {
    console.error('❌ Error testing deals API:', error.message)
    return false
  }
}

async function runAPITests() {
  console.log('Testing API routes...\n')
  
  // Test each API route
  const leadsSuccess = await testLeadsAPI()
  const companiesSuccess = await testCompaniesAPI()
  const dealsSuccess = await testDealsAPI()
  
  console.log('\n=== API TEST RESULTS ===')
  console.log('Leads API:', leadsSuccess ? '✅ PASS' : '❌ FAIL')
  console.log('Companies API:', companiesSuccess ? '✅ PASS' : '❌ FAIL')
  console.log('Deals API:', dealsSuccess ? '✅ PASS' : '❌ FAIL')
  
  if (leadsSuccess && companiesSuccess && dealsSuccess) {
    console.log('\n🎉 All API routes are working correctly!')
  } else {
    console.log('\n❌ Some API routes are failing. Check the errors above.')
  }
}

// Run the tests
runAPITests()