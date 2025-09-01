// models/userDetails.model.js
const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user', // link to user model
      required: true,
      unique: true,
    },

    // Basic Info
    phone: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'],
    },
    dob: {
      type: Date,
      required: true,
    },
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
      required: true,
    },

    // Medical Info
    allergies: {
      type: String,
      default: '',
    },
    medications: {
      type: String,
      default: '',
    },
    conditions: {
      type: String,
      default: '',
    },

    // Emergency Contact
    emergencyName: {
      type: String,
      required: true,
      trim: true,
    },
    emergencyPhone: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'],
    },

    // Insurance
    insuranceProvider: {
      type: String,
      default: '',
    },
    policyNumber: {
      type: String,
      default: '',
    },

    // Address
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    zip: {
      type: String,
      required: true,
      match: [/^[0-9]{5,6}$/, 'Please enter a valid ZIP code'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('userDetails', userDetailsSchema);
