// controllers/userDetails.controller.js
const UserDetails = require('../models/userDetails.model');
const { validationResult } = require('express-validator'); // Add this import

// Save or Update user details
exports.saveUserDetails = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user._id; // Provided by auth middleware
    if (!userId) {
      return res.status(401).json({ message: "No user authenticated" });
    }

    // Destructure details from request body
    const {
      phone, dob, bloodType, allergies, medications, conditions,
      emergencyName, emergencyPhone, insuranceProvider, policyNumber,
      address, city, state, zip,
    } = req.body;

    console.log("Saving user details for userId:", userId); // Debugging log
    console.log("Payload:", req.body); // Debugging log

    let details = await UserDetails.findOne({ user: userId });

    if (details) {
      // Update existing
      details.phone = phone;
      details.dob = dob;
      details.bloodType = bloodType;
      details.allergies = allergies;
      details.medications = medications;
      details.conditions = conditions;
      details.emergencyName = emergencyName;
      details.emergencyPhone = emergencyPhone;
      details.insuranceProvider = insuranceProvider;
      details.policyNumber = policyNumber;
      details.address = address;
      details.city = city;
      details.state = state;
      details.zip = zip;
      await details.save();
    } else {
      // Create new
      details = new UserDetails({
        user: userId,
        phone,
        dob,
        bloodType,
        allergies,
        medications,
        conditions,
        emergencyName,
        emergencyPhone,
        insuranceProvider,
        policyNumber,
        address,
        city,
        state,
        zip,
      });
      await details.save();
    }

    console.log("User details saved:", details); // Debugging log
    res.status(200).json({ message: "User details saved successfully", details });
  } catch (err) {
    console.error("Error saving details:", err); // Improved logging
    res.status(500).json({ message: "Error saving details", error: err.message });
  }
};

// Get user details (no major change needed, but add logging for consistency)
exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const details = await UserDetails.findOne({ user: userId })
      .populate("user", "fullname email");
    if (!details) {
      return res.status(404).json({ message: "User details not found" });
    }
    res.status(200).json(details);
  } catch (err) {
    console.error("Error fetching details:", err);
    res.status(500).json({ message: "Error fetching details", error: err.message });
  }
};
