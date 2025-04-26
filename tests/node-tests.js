/**
 * Simple test suite for Node.js Express application
 */

const http = require('http');
const assert = require('assert');

// Base URL for tests
const BASE_URL = 'http://localhost:8080'; // This will be overridden by process.env.PORT if set

// Helper function to make HTTP requests
function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

// Test cases
async function runTests() {
  console.log('Starting Node.js API tests...');
  let errors = 0;
  const testPort = process.env.PORT || 8080;
  const testUrl = `http://localhost:${testPort}`;
  
  try {
    // Test 1: Root endpoint
    console.log('\n🧪 Test 1: GET /');
    const rootResponse = await makeRequest({
      hostname: 'localhost',
      port: testPort,
      path: '/',
      method: 'GET'
    });
    
    assert.strictEqual(rootResponse.statusCode, 200, 'Root endpoint should return 200 status code');
    const rootData = JSON.parse(rootResponse.body);
    assert.strictEqual(rootData.service, 'Node.js Express API', 'Root endpoint should identify correct service');
    console.log('✅ Test 1 passed!');
    
    // Test 2: Health check endpoint
    console.log('\n🧪 Test 2: GET /health');
    const healthResponse = await makeRequest({
      hostname: 'localhost',
      port: testPort,
      path: '/health',
      method: 'GET'
    });
    
    assert.strictEqual(healthResponse.statusCode, 200, 'Health endpoint should return 200 status code');
    const healthData = JSON.parse(healthResponse.body);
    assert.strictEqual(healthData.status, 'healthy', 'Health endpoint should report as healthy');
    console.log('✅ Test 2 passed!');
    
    // Test 3: Echo endpoint (POST)
    console.log('\n🧪 Test 3: POST /echo');
    const testMessage = {
      message: 'Hello from automated test',
      timestamp: new Date().toISOString(),
      testRun: true
    };
    
    const echoResponse = await makeRequest({
      hostname: 'localhost',
      port: testPort,
      path: '/echo',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: testMessage
    });
    
    assert.strictEqual(echoResponse.statusCode, 200, 'Echo endpoint should return 200 status code');
    const echoData = JSON.parse(echoResponse.body);
    assert.strictEqual(echoData.service, 'Node.js Express API', 'Echo response should identify correct service');
    assert.deepStrictEqual(echoData.echo, testMessage, 'Echo endpoint should return the exact message sent');
    console.log('✅ Test 3 passed!');
    
  } catch (error) {
    console.error(`❌ Test failed: ${error.message}`);
    errors++;
  }
  
  // Summary
  console.log('\n---------------------------------');
  if (errors === 0) {
    console.log('🎉 All Node.js API tests passed!');
  } else {
    console.log(`❌ ${errors} test(s) failed.`);
    process.exit(1); // Exit with error code
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});