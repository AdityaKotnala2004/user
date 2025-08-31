const express = require('express');
const router = express.Router();
const { 
  createEmergency, 
  acceptEmergency, 
  updateEmergencyStatus, 
  getEmergencyById, 
  getEmergenciesByUserId, 
  getEmergenciesByCaptainId 
} = require('../controllers/emergency.controller');
const { authUser, authCaptain } = require('../middlewares/auth.middleware');

// Create emergency SOS request
router.post('/create', authUser, createEmergency);

// Captain accepts emergency request
router.post('/accept', authCaptain, acceptEmergency);

// Update emergency status
router.put('/status/:emergencyId', authUser, updateEmergencyStatus);

// Get emergency by ID
router.get('/:emergencyId', authUser, getEmergencyById);

// Get emergencies by user ID
router.get('/user/:userId', authUser, getEmergenciesByUserId);

// Get emergencies by captain ID
router.get('/captain/:captainId', authCaptain, getEmergenciesByCaptainId);

module.exports = router;
