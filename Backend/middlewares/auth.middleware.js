const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blacklistToken.model');
const captainModel = require('../models/captain.model');

module.exports.authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  console.log('Auth attempt - Token received:', token); // Debug: Log received token

  if (!token) {
    console.log('No token provided'); // Debug
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const isBlacklisted = await blackListTokenModel.findOne({ token: token });
  if (isBlacklisted) {
    console.log('Token is blacklisted'); // Debug
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', decoded); // Debug: Log decoded token
    const user = await userModel.findById(decoded._id);
    if (!user) {
      console.log('User not found for decoded ID:', decoded._id); // Debug
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    return next();
  } catch (err) {
    console.log('Token verification failed:', err.message); // Debug: Log verification error
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports.authCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  console.log('Auth attempt (Captain) - Token received:', token); // Debug

  if (!token) {
    console.log('No token provided (Captain)'); // Debug
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const isBlacklisted = await blackListTokenModel.findOne({ token: token });
  if (isBlacklisted) {
    console.log('Token is blacklisted (Captain)'); // Debug
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully (Captain):', decoded); // Debug
    const captain = await captainModel.findById(decoded._id);
    if (!captain) {
      console.log('Captain not found for decoded ID:', decoded._id); // Debug
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.captain = captain;
    return next();
  } catch (err) {
    console.log('Token verification failed (Captain):', err.message); // Debug
    console.log(err);
    res.status(401).json({ message: 'Unauthorized' });
  }
};
