const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userFullName: {
    type: String,
    required: true
  },
  userPhone: {
    type: String,
    default: 'Not provided'
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    },
    address: {
      type: String,
      default: null
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedCaptain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Captain',
    default: null
  },
  emergencyType: {
    type: String,
    enum: ['medical', 'accident', 'other'],
    default: 'medical'
  },
  description: {
    type: String,
    required: true
  },
  captainResponse: {
    accepted: {
      type: Boolean,
      default: false
    },
    responseTime: {
      type: Date,
      default: null
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Emergency', emergencySchema);
