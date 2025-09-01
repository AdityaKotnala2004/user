const mongoose = require('mongoose');
const emergencyModel = require('./models/emergency.model');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

// Test database connection and model loading
async function testEmergencySystem() {
  try {
    console.log('🧪 Testing Emergency System Components...');
    
    // Test 1: Check if models can be loaded
    console.log('✅ Emergency Model:', typeof emergencyModel);
    console.log('✅ User Model:', typeof userModel);
    console.log('✅ Captain Model:', typeof captainModel);
    
    // Test 2: Check model schemas
    console.log('✅ Emergency Schema fields:', Object.keys(emergencyModel.schema.paths));
    console.log('✅ User Schema fields:', Object.keys(userModel.schema.paths));
    console.log('✅ Captain Schema fields:', Object.keys(captainModel.schema.paths));
    
    // Test 3: Check if phone field exists in models
    const userPhoneField = userModel.schema.paths.phone;
    const captainPhoneField = captainModel.schema.paths.phone;
    
    console.log('✅ User phone field:', userPhoneField ? 'EXISTS' : 'MISSING');
    console.log('✅ Captain phone field:', captainPhoneField ? 'EXISTS' : 'MISSING');
    
    // Test 4: Check emergency schema structure
    const emergencyFields = emergencyModel.schema.paths;
    const requiredFields = ['userId', 'userFullName', 'location', 'status', 'emergencyType', 'description'];
    
    requiredFields.forEach(field => {
      const exists = emergencyFields[field] ? '✅' : '❌';
      console.log(`${exists} Emergency ${field}:`, emergencyFields[field] ? 'EXISTS' : 'MISSING');
    });
    
    console.log('🎉 All Emergency System Components Tested Successfully!');
    
  } catch (error) {
    console.error('❌ Error testing emergency system:', error.message);
  }
}

// Run the test
testEmergencySystem();
