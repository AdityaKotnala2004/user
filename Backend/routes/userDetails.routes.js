const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const userDetailsController = require("../controllers/userDetails.controller");
const { body } = require('express-validator'); // Add this import

// Save or Update user details
router.post("/save", 
  authMiddleware.authUser,
  [
    body('phone').matches(/^[0-9]{10}$/).withMessage('Please enter a valid 10-digit phone number'),
    body('dob').isDate().withMessage('Invalid date of birth'),
    body('bloodType').isIn(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']).withMessage('Invalid blood type'),
    body('emergencyName').trim().notEmpty().withMessage('Emergency name is required'),
    body('emergencyPhone').matches(/^[0-9]{10}$/).withMessage('Please enter a valid 10-digit emergency phone number'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('state').trim().notEmpty().withMessage('State is required'),
    body('zip').matches(/^[0-9]{5,6}$/).withMessage('Please enter a valid ZIP code'),
    // Optional fields (allergies, etc.) can be added if needed, but schema defaults handle them
  ],
  userDetailsController.saveUserDetails
);

// Get logged-in user details (no change needed)
router.get("/me", authMiddleware.authUser, userDetailsController.getUserDetails);

module.exports = router;
