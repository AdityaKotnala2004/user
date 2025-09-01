const emergencyModel = require('../models/emergency.model');
const userModel = require('../models/user.model');
const userDetailsModel = require('../models/userDetails.model');
const captainModel = require('../models/captain.model');
const { sendMessageToSocketId } = require('../socket');
const axios = require('axios');

// Get address from coordinates
const getAddressFromCoordinates = async (lat, lng) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) return null;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    const response = await axios.get(url);
    if (response.data.status === 'OK' && response.data.results.length > 0) {
      return response.data.results[0].formatted_address;
    }
    return null;
  } catch (error) {
    console.error('Error getting address:', error.message);
    return null;
  }
};

// Calculate distance between two points
const calculateDistance = async (origin, destination) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) return null;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&key=${apiKey}`;
    const response = await axios.get(url);
    if (response.data.status === 'OK' && response.data.rows[0].elements[0].status === 'OK') {
      return {
        distance: response.data.rows[0].elements[0].distance,
        duration: response.data.rows[0].elements[0].duration
      };
    }
    return null;
  } catch (error) {
    console.error('Error calculating distance:', error.message);
    return null;
  }
};

// Create emergency SOS
const createEmergency = async (req, res) => {
  try {
    const { location, emergencyType, description } = req.body;
    const userId = req.user._id;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const userFullName = `${user.fullname.firstname} ${user.fullname.lastname}`;

    let userPhone = 'Not provided';
    try {
      const userDetails = await userDetailsModel.findOne({ user: userId });
      if (userDetails?.phone) userPhone = userDetails.phone;
    } catch {}

    let address = null;
    if (location?.lat && location?.lng) {
      address = await getAddressFromCoordinates(location.lat, location.lng);
      if (!address) {
        address = `Location at ${location.lat}, ${location.lng}`;
      }
    }

    const emergency = new emergencyModel({
      userId,
      userFullName,
      userPhone,
      location: { ...location, address },
      emergencyType,
      description,
      createdAt: new Date()
    });

    await emergency.save();

    // Broadcast to active captains
    const activeCaptains = await captainModel.find({
      status: 'active',
      socketId: { $exists: true, $ne: null }
    });

    const emergencyData = {
      _id: emergency._id,
      userFullName,
      userPhone,
      location: emergency.location,
      emergencyType,
      description,
      requestedAt: emergency.createdAt
    };

    activeCaptains.forEach(c => {
      sendMessageToSocketId(c.socketId, { event: 'emergency-alert', data: emergencyData });
    });

    res.status(201).json({ message: 'Emergency created', emergency: emergencyData });
  } catch (error) {
    console.error('Error creating emergency:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Accept emergency
const acceptEmergency = async (req, res) => {
  try {
    const { emergencyId } = req.body;
    const captainId = req.captain._id;

    const emergency = await emergencyModel.findById(emergencyId);
    if (!emergency) return res.status(404).json({ message: 'Emergency request not found' });
    if (emergency.status !== 'pending') {
      return res.status(400).json({ message: 'Emergency already processed' });
    }

    emergency.status = 'accepted';
    emergency.assignedCaptain = captainId;
    emergency.captainResponse.accepted = true;
    emergency.captainResponse.responseTime = new Date();
    await emergency.save();

    const captain = await captainModel.findById(captainId);
    if (!captain) return res.status(404).json({ message: 'Captain not found' });

    let distanceInfo = null;
    if (captain.location?.lat && captain.location?.lng) {
      distanceInfo = await calculateDistance(
        { lat: captain.location.lat, lng: captain.location.lng },
        { lat: emergency.location.lat, lng: emergency.location.lng }
      );
    }

    const user = await userModel.findById(emergency.userId);
    if (user?.socketId) {
      sendMessageToSocketId(user.socketId, {
        event: 'emergency-accepted',
        data: {
          emergencyId: emergency._id,
          captainName: `${captain.fullname.firstname} ${captain.fullname.lastname}`,
          captainPhone: captain.phone || 'Not provided',
          vehicleDetails: captain.vehicle,
          estimatedArrival: distanceInfo?.duration?.text || 'Calculating...',
          distance: distanceInfo?.distance?.text || 'Calculating...'
        }
      });
    }

    const responseData = {
      ...emergency.toObject(),
      _id: emergency._id, // ✅ force karo ki frontend ko `_id` mile
      distanceInfo,
      captainLocation: captain.location
    };
    
    res.json({ message: 'Emergency accepted successfully', emergency: responseData });
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
    if (!emergency) return res.status(404).json({ message: 'Emergency request not found' });

    emergency.status = status;
    emergency.updatedAt = new Date();
    await emergency.save();

    const user = await userModel.findById(emergency.userId);
    if (user?.socketId) {
      sendMessageToSocketId(user.socketId, {
        event: 'emergency-status-updated',
        data: {
          emergencyId: emergency._id,
          status: emergency.status,
          updatedAt: emergency.updatedAt
        }
      });
    }

    res.json({ message: 'Emergency status updated successfully', emergency });
  } catch (error) {
    console.error('Error updating emergency status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getEmergencyById = async (req, res) => {
  try {
    const { emergencyId } = req.params;
    const emergency = await emergencyModel.findById(emergencyId)
      .populate('userId', 'fullname phone')
      .populate('assignedCaptain', 'fullname phone vehicle');
    if (!emergency) return res.status(404).json({ message: 'Emergency not found' });
    res.json({ emergency });
  } catch (error) {
    console.error('Error getting emergency:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

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
