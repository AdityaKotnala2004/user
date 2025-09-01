const dotenv = require('dotenv');

dotenv.config();

const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db');

// Routes
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');
const mapsRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes');
const userDetailsRoutes = require('./routes/userDetails.routes'); // ✅ added
const emergencyRoutes = require('./routes/emergency.routes'); // ✅ added emergency routes

// Connect DB
connectToDb();

// CORS configuration - Allows credentials (cookies) and specifies frontend origin
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL/port (e.g., Vite default)
  credentials: true // Essential for sending cookies
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Test route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Routes
app.use('/users', userRoutes);
app.use('/captains', captainRoutes);
app.use('/maps', mapsRoutes);
app.use('/rides', rideRoutes);
app.use('/user-details', userDetailsRoutes); // ✅ added
app.use('/emergency', emergencyRoutes); // ✅ added emergency routes

module.exports = app;
