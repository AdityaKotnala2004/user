const emergencyModel = require('../models/emergency.model');
const userModel = require('../models/user.model');
const userDetailsModel = require('../models/userDetails.model');
const captainModel = require('../models/captain.model');
const { sendMessageToSocketId } = require('../socket');
const axios = require('axios');

// Function to get address from coordinates using Google Maps Geocoding API
const getAddressFromCoordinates = async (lat, lng) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    console.log('🔑 Google Maps API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');
    
    if (!apiKey) {
      console.log('❌ Google Maps API key not found in environment variables');
      return null;
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    console.log('🌐 Calling Google Maps API:', url.substring(0, 50) + '...');

    const response = await axios.get(url);
    console.log('📡 Google Maps API Response Status:', response.data.status);
    console.log('📡 Google Maps API Response:', JSON.stringify(response.data, null, 2));

    if (response.data.status === 'OK' && response.data.results && response.data.results.length > 0) {
      // Get the most relevant result (usually the first one)
      const result = response.data.results[0];
      console.log(`✅ Address found for coordinates ${lat}, ${lng}: ${result.formatted_address}`);
      return result.formatted_address;
    } else {
      console.log(`❌ No address found for coordinates ${lat}, ${lng}. Status: ${response.data.status}`);
      if (response.data.error_message) {
        console.log(`❌ Error message: ${response.data.error_message}`);
      }
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting address from coordinates:', error.message);
    if (error.response) {
      console.error('❌ Response error:', error.response.data);
    }
    return null;
  }
};

// Create emergency SOS request
const createEmergency = async (req, res) => {
  try {
    const { location, emergencyType, description } = req.body;
    const userId = req.user._id; // Get user ID from authenticated user

    // Get user details
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user phone from userDetails
    let userPhone = 'Not provided';
    try {
      const userDetails = await userDetailsModel.findOne({ user: userId });
      if (userDetails && userDetails.phone) {
        userPhone = userDetails.phone;
      }
    } catch (error) {
      console.log('Could not fetch user phone details');
    }

    // Get address from coordinates
    let address = null;
    if (location && location.lat && location.lng) {
      console.log(`📍 Getting address for coordinates: ${location.lat}, ${location.lng}`);
      address = await getAddressFromCoordinates(location.lat, location.lng);
      console.log(`📍 Address result:`, address);
      
      // Fallback: if Google Maps API fails, create a basic address
      if (!address) {
        console.log('📍 Creating fallback address from coordinates');
        address = `Location at ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
      }
    } else {
      console.log('❌ No valid coordinates provided:', location);
    }

    // Create emergency request with enhanced location data
    const emergency = new emergencyModel({
      userId,
      userFullName: `${user.fullname.firstname} ${user.fullname.lastname}`,
      userPhone,
      location: {
        ...location,
        address: address
      },
      emergencyType,
      description
    });

    await emergency.save();

    // Find all active captains and send emergency notification
    const activeCaptains = await captainModel.find({ 
      status: 'active',
      socketId: { $exists: true, $ne: null }
    });

    console.log(`Found ${activeCaptains.length} active captains for emergency notification`);

    // Send emergency notification to all active captains
    activeCaptains.forEach(captain => {
      console.log(`📤 Sending emergency alert to captain ${captain._id} at socket ${captain.socketId}`);
      const emergencyData = {
        emergencyId: emergency._id,
        userFullName: emergency.userFullName,
        userPhone: emergency.userPhone,
        location: emergency.location,
        emergencyType: emergency.emergencyType,
        description: emergency.description,
        createdAt: emergency.createdAt
      };
      console.log('📤 Emergency data being sent:', JSON.stringify(emergencyData, null, 2));
      sendMessageToSocketId(captain.socketId, {
        event: 'emergency-alert',
        data: emergencyData
      });
    });

    res.status(201).json({
      message: 'Emergency request created successfully',
      emergency
    });

  } catch (error) {
    console.error('Error creating emergency:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Captain accepts emergency request
const acceptEmergency = async (req, res) => {
  try {
    const { emergencyId } = req.body;
    const captainId = req.captain._id; // Get captain ID from authenticated captain

    const emergency = await emergencyModel.findById(emergencyId);
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency request not found' });
    }

    if (emergency.status !== 'pending') {
      return res.status(400).json({ message: 'Emergency request already processed' });
    }

    // Update emergency status
    emergency.status = 'accepted';
    emergency.assignedCaptain = captainId;
    emergency.captainResponse.accepted = true;
    emergency.captainResponse.responseTime = new Date();
    await emergency.save();

    // Get captain details
    const captain = await captainModel.findById(captainId);
    if (!captain) {
      return res.status(404).json({ message: 'Captain not found' });
    }

    // Notify user that emergency has been accepted
    const user = await userModel.findById(emergency.userId);
    if (user && user.socketId) {
      sendMessageToSocketId(user.socketId, {
        event: 'emergency-accepted',
        data: {
          emergencyId: emergency._id,
          captainName: `${captain.fullname.firstname} ${captain.fullname.lastname}`,
          captainPhone: captain.phone || 'Not provided',
          vehicleDetails: captain.vehicle,
          estimatedArrival: 'Calculating...'
        }
      });
    }

    res.json({
      message: 'Emergency accepted successfully',
      emergency
    });

  } catch (error) {
    console.error('Error accepting emergency:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update emergency status
const updateEmergencyStatus = async (req, res) => {
  try {
    const { emergencyId, status } = req.body;

    const emergency = await emergencyModel.findById(emergencyId);
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency request not found' });
    }

    emergency.status = status;
    emergency.updatedAt = new Date();
    await emergency.save();

    // Notify user about status change
    const user = await userModel.findById(emergency.userId);
    if (user && user.socketId) {
      sendMessageToSocketId(user.socketId, {
        event: 'emergency-status-updated',
        data: {
          emergencyId: emergency._id,
          status: emergency.status,
          updatedAt: emergency.updatedAt
        }
      });
    }

    res.json({
      message: 'Emergency status updated successfully',
      emergency
    });

  } catch (error) {
    console.error('Error updating emergency status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get emergency by ID
const getEmergencyById = async (req, res) => {
  try {
    const { emergencyId } = req.params;

    const emergency = await emergencyModel.findById(emergencyId)
      .populate('userId', 'fullname phone')
      .populate('assignedCaptain', 'fullname phone vehicle');

    if (!emergency) {
      return res.status(404).json({ message: 'Emergency request not found' });
    }

    res.json({ emergency });

  } catch (error) {
    console.error('Error getting emergency:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get emergencies by user ID
const getEmergenciesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const emergencies = await emergencyModel.find({ userId })
      .populate('assignedCaptain', 'fullname phone vehicle')
      .sort({ createdAt: -1 });

    res.json({ emergencies });

  } catch (error) {
    console.error('Error getting user emergencies:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get emergencies by captain ID
const getEmergenciesByCaptainId = async (req, res) => {
  try {
    const { captainId } = req.params;

    const emergencies = await emergencyModel.find({ assignedCaptain: captainId })
      .populate('userId', 'fullname phone')
      .sort({ createdAt: -1 });

    res.json({ emergencies });

  } catch (error) {
    console.error('Error getting captain emergencies:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createEmergency,
  acceptEmergency,
  updateEmergencyStatus,
  getEmergencyById,
  getEmergenciesByUserId,
  getEmergenciesByCaptainId
};
