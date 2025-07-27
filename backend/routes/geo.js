const express = require('express');
const axios = require('axios');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/geo/geocode
// @desc    Geocode an address using Google Maps API
// @access  Private
router.get('/geocode', authenticateToken, async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({
        message: 'Address parameter is required',
        error: 'MISSING_ADDRESS'
      });
    }
    
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });
    
    if (response.data.status !== 'OK') {
      return res.status(400).json({
        message: 'Geocoding failed',
        error: response.data.status,
        details: response.data.error_message
      });
    }
    
    const result = response.data.results[0];
    const { lat, lng } = result.geometry.location;
    
    res.json({
      message: 'Address geocoded successfully',
      location: {
        latitude: lat,
        longitude: lng,
        formatted_address: result.formatted_address,
        place_id: result.place_id,
        address_components: result.address_components
      }
    });
    
  } catch (error) {
    console.error('Geocoding error:', error);
    
    if (error.response?.data) {
      return res.status(400).json({
        message: 'Google Maps API error',
        error: error.response.data
      });
    }
    
    res.status(500).json({
      message: 'Server error during geocoding',
      error: 'GEOCODING_ERROR'
    });
  }
});

// @route   GET /api/geo/reverse-geocode
// @desc    Reverse geocode coordinates to address
// @access  Private
router.get('/reverse-geocode', authenticateToken, async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({
        message: 'Latitude and longitude parameters are required',
        error: 'MISSING_COORDINATES'
      });
    }
    
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        latlng: `${lat},${lng}`,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });
    
    if (response.data.status !== 'OK') {
      return res.status(400).json({
        message: 'Reverse geocoding failed',
        error: response.data.status,
        details: response.data.error_message
      });
    }
    
    const results = response.data.results;
    
    res.json({
      message: 'Coordinates reverse geocoded successfully',
      addresses: results.map(result => ({
        formatted_address: result.formatted_address,
        place_id: result.place_id,
        types: result.types,
        address_components: result.address_components
      }))
    });
    
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    
    if (error.response?.data) {
      return res.status(400).json({
        message: 'Google Maps API error',
        error: error.response.data
      });
    }
    
    res.status(500).json({
      message: 'Server error during reverse geocoding',
      error: 'REVERSE_GEOCODING_ERROR'
    });
  }
});

// @route   GET /api/geo/distance
// @desc    Calculate distance between two points using Google Maps API
// @access  Private
router.get('/distance', authenticateToken, async (req, res) => {
  try {
    const { 
      origin_lat, 
      origin_lng, 
      dest_lat, 
      dest_lng,
      units = 'metric',
      mode = 'driving'
    } = req.query;
    
    if (!origin_lat || !origin_lng || !dest_lat || !dest_lng) {
      return res.status(400).json({
        message: 'Origin and destination coordinates are required',
        error: 'MISSING_COORDINATES'
      });
    }
    
    const origins = `${origin_lat},${origin_lng}`;
    const destinations = `${dest_lat},${dest_lng}`;
    
    const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
      params: {
        origins,
        destinations,
        units,
        mode,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });
    
    if (response.data.status !== 'OK') {
      return res.status(400).json({
        message: 'Distance calculation failed',
        error: response.data.status,
        details: response.data.error_message
      });
    }
    
    const element = response.data.rows[0].elements[0];
    
    if (element.status !== 'OK') {
      return res.status(400).json({
        message: 'Distance calculation failed',
        error: element.status
      });
    }
    
    res.json({
      message: 'Distance calculated successfully',
      distance: {
        text: element.distance.text,
        value: element.distance.value, // in meters
        duration: {
          text: element.duration.text,
          value: element.duration.value // in seconds
        }
      }
    });
    
  } catch (error) {
    console.error('Distance calculation error:', error);
    
    if (error.response?.data) {
      return res.status(400).json({
        message: 'Google Maps API error',
        error: error.response.data
      });
    }
    
    res.status(500).json({
      message: 'Server error during distance calculation',
      error: 'DISTANCE_CALCULATION_ERROR'
    });
  }
});

// @route   GET /api/geo/nearby
// @desc    Find nearby vendors or suppliers
// @access  Private
router.get('/nearby', authenticateToken, async (req, res) => {
  try {
    const { 
      lat, 
      lng, 
      radius = 10, // km
      type = 'both' // 'vendors', 'suppliers', or 'both'
    } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({
        message: 'Latitude and longitude are required',
        error: 'MISSING_COORDINATES'
      });
    }
    
    const User = require('../models/User');
    
    // Convert radius from km to meters
    const radiusInMeters = parseFloat(radius) * 1000;
    
    let roleFilter = {};
    if (type === 'vendors') {
      roleFilter.role = 'vendor';
    } else if (type === 'suppliers') {
      roleFilter.role = 'supplier';
    } else {
      roleFilter.role = { $in: ['vendor', 'supplier'] };
    }
    
    // Find users within radius using MongoDB geospatial query
    const nearbyUsers = await User.find({
      ...roleFilter,
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radiusInMeters
        }
      },
      isActive: true
    })
    .select('name role businessInfo location averageRating totalReviews profileImage')
    .limit(50);
    
    // Calculate distances for each user
    const usersWithDistance = nearbyUsers.map(user => {
      const userLng = user.location.coordinates[0];
      const userLat = user.location.coordinates[1];
      
      // Simple distance calculation (Haversine formula simplified)
      const R = 6371; // Earth radius in km
      const dLat = (userLat - parseFloat(lat)) * Math.PI / 180;
      const dLng = (userLng - parseFloat(lng)) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(parseFloat(lat) * Math.PI / 180) * Math.cos(userLat * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      return {
        ...user.toObject(),
        distance: Math.round(distance * 10) / 10 // Round to 1 decimal place
      };
    });
    
    // Sort by distance
    usersWithDistance.sort((a, b) => a.distance - b.distance);
    
    res.json({
      message: 'Nearby users found successfully',
      users: usersWithDistance,
      count: usersWithDistance.length,
      searchRadius: radius
    });
    
  } catch (error) {
    console.error('Nearby users search error:', error);
    
    res.status(500).json({
      message: 'Server error finding nearby users',
      error: 'NEARBY_SEARCH_ERROR'
    });
  }
});

module.exports = router;
