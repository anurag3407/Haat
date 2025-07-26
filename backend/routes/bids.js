const express = require('express');
const Bid = require('../models/Bid');
const Order = require('../models/Order');

const router = express.Router();

// Get active bids near location
router.get('/active', async (req, res) => {
  try {
    const { longitude, latitude, radius = 10, type } = req.query;
    
    let query = { 
      status: 'active',
      'timing.endTime': { $gt: new Date() }
    };
    
    if (type) {
      query.type = type;
    }
    
    if (longitude && latitude) {
      query['location.center'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: (radius || 10) * 1000
        }
      };
    }
    
    const bids = await Bid.find(query)
      .populate('product', 'name category images quality')
      .populate('supplier', 'businessName rating.averageRating')
      .sort({ 'timing.endTime': 1 });
    
    res.json(bids);
  } catch (error) {
    console.error('Get active bids error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new bid
router.post('/', async (req, res) => {
  try {
    const bid = new Bid(req.body);
    await bid.save();
    
    await bid.populate('product', 'name category');
    await bid.populate('supplier', 'businessName');
    
    res.status(201).json({
      message: 'Bid created successfully',
      bid
    });
  } catch (error) {
    console.error('Create bid error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Place bid
router.post('/:id/place-bid', async (req, res) => {
  try {
    const { vendorId, amount } = req.body;
    
    if (!vendorId || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid vendor ID and bid amount required' });
    }
    
    const bid = await Bid.findById(req.params.id);
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    
    try {
      await bid.placeBid(vendorId, amount);
      
      await bid.populate('bids.vendor', 'stallName');
      
      res.json({
        message: 'Bid placed successfully',
        currentPrice: bid.auction.currentPrice,
        bidsCount: bid.bids.length
      });
    } catch (bidError) {
      return res.status(400).json({ message: bidError.message });
    }
  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get bid details
router.get('/:id', async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id)
      .populate('product', 'name category images quality pricing')
      .populate('supplier', 'businessName rating user')
      .populate('bids.vendor', 'stallName user')
      .populate('winner.vendor', 'stallName user');
    
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    
    res.json(bid);
  } catch (error) {
    console.error('Get bid error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Close bid (manual or auto when time expires)
router.post('/:id/close', async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    
    await bid.closeBid();
    
    // If there's a winner, create an order
    if (bid.winner && bid.winner.vendor) {
      const order = new Order({
        type: 'bid_win',
        vendor: bid.winner.vendor,
        supplier: bid.supplier,
        bid: bid._id,
        items: [{
          product: bid.product,
          quantity: bid.auction.quantity,
          unit: bid.auction.unit,
          pricePerUnit: bid.winner.winningBid,
          totalPrice: bid.auction.quantity * bid.winner.winningBid
        }],
        pricing: {
          subtotal: bid.auction.quantity * bid.winner.winningBid,
          total: bid.auction.quantity * bid.winner.winningBid
        },
        delivery: {
          method: bid.conditions.deliveryRequired ? 'delivery' : 'pickup'
        },
        payment: {
          method: bid.conditions.paymentMethod === 'both' ? 'upi' : bid.conditions.paymentMethod,
          status: 'pending'
        }
      });
      
      await order.save();
      
      res.json({
        message: 'Bid closed successfully',
        winner: bid.winner,
        orderCreated: true
      });
    } else {
      res.json({
        message: 'Bid closed with no winner',
        winner: null
      });
    }
  } catch (error) {
    console.error('Close bid error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get vendor's bid history
router.get('/vendor/:vendorId/history', async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = {
      'bids.vendor': req.params.vendorId
    };
    
    if (status) {
      query.status = status;
    }
    
    const bids = await Bid.find(query)
      .populate('product', 'name category')
      .populate('supplier', 'businessName')
      .sort({ createdAt: -1 });
    
    // Add vendor's bid details to each bid
    const bidsWithVendorInfo = bids.map(bid => {
      const vendorBid = bid.bids.find(b => b.vendor.toString() === req.params.vendorId);
      return {
        ...bid.toObject(),
        vendorBid: vendorBid,
        isWinner: bid.winner && bid.winner.vendor.toString() === req.params.vendorId
      };
    });
    
    res.json(bidsWithVendorInfo);
  } catch (error) {
    console.error('Get vendor bid history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get supplier's bid history
router.get('/supplier/:supplierId/history', async (req, res) => {
  try {
    const bids = await Bid.find({ supplier: req.params.supplierId })
      .populate('product', 'name category')
      .populate('winner.vendor', 'stallName')
      .sort({ createdAt: -1 });
    
    res.json(bids);
  } catch (error) {
    console.error('Get supplier bid history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
