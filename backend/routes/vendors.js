const express = require('express');
const Vendor = require('../models/Vendor');
const User = require('../models/User');

const router = express.Router();

// Get vendor profile with trust score
router.get('/profile/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id)
      .populate('user', 'name phone location')
      .populate('analytics.favoriteSuppliers', 'businessName');
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    res.json(vendor);
  } catch (error) {
    console.error('Get vendor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update vendor trust score
router.put('/update-trust-score/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    await vendor.updateTrustScore();
    res.json({ 
      message: 'Trust score updated',
      trustScore: vendor.trustScore
    });
  } catch (error) {
    console.error('Update trust score error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get vendors near location (for suppliers to see potential customers)
router.get('/nearby', async (req, res) => {
  try {
    const { longitude, latitude, radius = 10 } = req.query;
    
    if (!longitude || !latitude) {
      return res.status(400).json({ message: 'Longitude and latitude required' });
    }
    
    const vendors = await Vendor.find()
      .populate({
        path: 'user',
        match: {
          'location.coordinates': {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
              },
              $maxDistance: radius * 1000 // Convert km to meters
            }
          }
        },
        select: 'name phone location'
      });
    
    // Filter out vendors where user is null (didn't match location criteria)
    const nearbyVendors = vendors.filter(vendor => vendor.user);
    
    res.json(nearbyVendors);
  } catch (error) {
    console.error('Get nearby vendors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get vendor analytics
router.get('/analytics/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id)
      .populate('analytics.favoriteSuppliers', 'businessName rating.averageRating');
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    res.json({
      trustScore: vendor.trustScore,
      analytics: vendor.analytics,
      businessInfo: {
        stallName: vendor.stallName,
        businessType: vendor.businessType,
        businessHours: vendor.businessHours
      }
    });
  } catch (error) {
    console.error('Get vendor analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
