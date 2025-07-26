const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// Search products (main sourcing hub functionality)
router.get('/search', async (req, res) => {
  try {
    const { 
      query, 
      category, 
      minPrice, 
      maxPrice, 
      available,
      longitude,
      latitude,
      radius = 10,
      sortBy = 'relevance'
    } = req.query;
    
    let searchCriteria = {};
    
    // Text search
    if (query) {
      searchCriteria.$text = { $search: query };
    }
    
    // Category filter
    if (category) {
      searchCriteria.category = category;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      searchCriteria['pricing.basePrice'] = {};
      if (minPrice) searchCriteria['pricing.basePrice'].$gte = parseFloat(minPrice);
      if (maxPrice) searchCriteria['pricing.basePrice'].$lte = parseFloat(maxPrice);
    }
    
    // Availability filter
    if (available !== undefined) {
      searchCriteria['availability.isAvailable'] = available === 'true';
    }
    
    let products = await Product.find(searchCriteria)
      .populate({
        path: 'supplier',
        populate: {
          path: 'user',
          select: 'name location'
        }
      });
    
    // Filter by location if coordinates provided
    if (longitude && latitude) {
      products = products.filter(product => {
        const supplierLocation = product.supplier?.user?.location;
        if (!supplierLocation || !supplierLocation.coordinates) {
          return false;
        }
        
        const [supplierLng, supplierLat] = supplierLocation.coordinates;
        const distance = calculateDistance(
          parseFloat(latitude), parseFloat(longitude),
          supplierLat, supplierLng
        );
        
        return distance <= radius;
      });
    }
    
    // Sort results
    switch (sortBy) {
      case 'price_low':
        products.sort((a, b) => a.pricing.basePrice - b.pricing.basePrice);
        break;
      case 'price_high':
        products.sort((a, b) => b.pricing.basePrice - a.pricing.basePrice);
        break;
      case 'rating':
        products.sort((a, b) => (b.supplier?.rating?.averageRating || 0) - (a.supplier?.rating?.averageRating || 0));
        break;
      case 'distance':
        if (longitude && latitude) {
          products.sort((a, b) => {
            const distA = calculateDistance(latitude, longitude, 
              a.supplier?.user?.location?.coordinates?.[1] || 0,
              a.supplier?.user?.location?.coordinates?.[0] || 0);
            const distB = calculateDistance(latitude, longitude,
              b.supplier?.user?.location?.coordinates?.[1] || 0,
              b.supplier?.user?.location?.coordinates?.[0] || 0);
            return distA - distB;
          });
        }
        break;
      default: // relevance
        if (query) {
          // Products are already sorted by text search relevance
        }
    }
    
    res.json(products);
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product details
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({
        path: 'supplier',
        populate: {
          path: 'user',
          select: 'name phone location'
        }
      });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Increment view count
    product.analytics.views += 1;
    await product.save();
    
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new product (for suppliers)
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    
    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get products by category for quick browsing
router.get('/category/:category', async (req, res) => {
  try {
    const { longitude, latitude, radius = 10 } = req.query;
    
    const products = await Product.find({ 
      category: req.params.category,
      'availability.isAvailable': true 
    })
    .populate({
      path: 'supplier',
      populate: {
        path: 'user',
        select: 'name location'
      }
    })
    .limit(50);
    
    res.json(products);
  } catch (error) {
    console.error('Get category products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to calculate distance
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
