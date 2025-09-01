const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const mapController = require('../controllers/map.controller');
const { query } = require('express-validator');

router.get('/get-coordinates',
  query('address').isString().isLength({ min: 3 }),
  authMiddleware.authUser,
  mapController.getCoordinates
);

// ✅ FIX: Allow both authUser and authCaptain for distance calculation
router.get('/get-distance-time',
  query('origin').isString().isLength({ min: 3 }),
  query('destination').isString().isLength({ min: 3 }),
  (req, res, next) => {
    // Try captain auth first, then user auth
    authMiddleware.authCaptain(req, res, (err) => {
      if (err) {
        authMiddleware.authUser(req, res, next);
      } else {
        next();
      }
    });
  },
  mapController.getDistanceTime
);

router.get('/get-suggestions',
  query('input').isString().isLength({ min: 3 }),
  authMiddleware.authUser,
  mapController.getAutoCompleteSuggestions
);

module.exports = router;
