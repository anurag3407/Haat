const express = require('express');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');

const router = express.Router();

// Get supplier profile
router.get('/profile/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id)
      .populate('user', 'name phone location')
      .populate('analytics.topCustomers', 'stallName');
    
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    res.json(supplier);
  } catch (error) {
    console.error('Get supplier error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get suppliers by category and location
router.get('/search', async (req, res) => {
  try {
    const { 
      category, 
      longitude, 
      latitude, 
      radius = 10,
      minRating = 0,
      acceptsGroupOrders,
      participatesInBidding
    } = req.query;
    
    let matchCriteria = {};
    
    if (category) {
      matchCriteria.categories = category;
    }
    
    if (minRating > 0) {
      matchCriteria['rating.averageRating'] = { $gte: parseFloat(minRating) };
    }
    
    if (acceptsGroupOrders !== undefined) {
      matchCriteria['capabilities.acceptsGroupOrders'] = acceptsGroupOrders === 'true';
    }
    
    if (participatesInBidding !== undefined) {
      matchCriteria['capabilities.participatesInBidding'] = participatesInBidding === 'true';
    }
    
    let suppliers = await Supplier.find(matchCriteria)
      .populate('user', 'name phone location');
    
    // Filter by location if coordinates provided
    if (longitude && latitude) {
      suppliers = suppliers.filter(supplier => {
        if (!supplier.user.location || !supplier.user.location.coordinates) {
          return false;
        }
        
        const [supplierLng, supplierLat] = supplier.user.location.coordinates;
        const distance = calculateDistance(
          parseFloat(latitude), parseFloat(longitude),
          supplierLat, supplierLng
        );
        
        return distance <= radius;
      });
    }
    
    res.json(suppliers);
  } catch (error) {
    console.error('Search suppliers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add review for supplier
router.post('/review/:id', async (req, res) => {
  try {
    const { vendorId, rating, comment, orderId } = req.body;
    
    if (!vendorId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Valid vendor ID and rating (1-5) required' });
    }
    
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    // Add review
    supplier.rating.reviews.push({
      vendor: vendorId,
      rating: rating,
      comment: comment || '',
      order: orderId
    });
    
    // Update average rating
    await supplier.updateRating();
    
    res.json({
      message: 'Review added successfully',
      newRating: supplier.rating.averageRating
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get supplier's products
router.get('/:id/products', async (req, res) => {
  try {
    const { category, available } = req.query;
    
    let query = { supplier: req.params.id };
    
    if (category) {
      query.category = category;
    }
    
    if (available !== undefined) {
      query['availability.isAvailable'] = available === 'true';
    }
    
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    console.error('Get supplier products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

module.exports = router;
