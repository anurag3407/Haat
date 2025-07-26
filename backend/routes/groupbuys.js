const express = require('express');
const GroupBuy = require('../models/GroupBuy');
const Order = require('../models/Order');

const router = express.Router();

// Get active group buys near location
router.get('/active', async (req, res) => {
  try {
    const { longitude, latitude, radius = 10, category } = req.query;
    
    let query = { 
      status: 'active',
      'schedule.endTime': { $gt: new Date() }
    };
    
    if (longitude && latitude) {
      query['location.center'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: (radius || 10) * 1000 // Convert km to meters
        }
      };
    }
    
    const groupBuys = await GroupBuy.find(query)
      .populate('product', 'name category images pricing')
      .populate('supplier', 'businessName rating.averageRating')
      .populate('participants.vendor', 'stallName')
      .sort({ 'schedule.endTime': 1 });
    
    // Filter by category if specified
    let filteredGroupBuys = groupBuys;
    if (category) {
      filteredGroupBuys = groupBuys.filter(gb => gb.product.category === category);
    }
    
    res.json(filteredGroupBuys);
  } catch (error) {
    console.error('Get active group buys error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new group buy
router.post('/', async (req, res) => {
  try {
    const groupBuy = new GroupBuy(req.body);
    await groupBuy.save();
    
    await groupBuy.populate('product', 'name category pricing');
    await groupBuy.populate('supplier', 'businessName');
    
    res.status(201).json({
      message: 'Group buy created successfully',
      groupBuy
    });
  } catch (error) {
    console.error('Create group buy error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join group buy
router.post('/:id/join', async (req, res) => {
  try {
    const { vendorId, quantity } = req.body;
    
    if (!vendorId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Valid vendor ID and quantity required' });
    }
    
    const groupBuy = await GroupBuy.findById(req.params.id);
    if (!groupBuy) {
      return res.status(404).json({ message: 'Group buy not found' });
    }
    
    if (groupBuy.status !== 'active') {
      return res.status(400).json({ message: 'Group buy is not active' });
    }
    
    if (new Date() > groupBuy.schedule.endTime) {
      return res.status(400).json({ message: 'Group buy has expired' });
    }
    
    // Check if vendor already joined
    const existingParticipant = groupBuy.participants.find(
      p => p.vendor.toString() === vendorId
    );
    
    if (existingParticipant) {
      return res.status(400).json({ message: 'Vendor already joined this group buy' });
    }
    
    // Add participant
    groupBuy.participants.push({
      vendor: vendorId,
      quantity: quantity,
      status: 'committed'
    });
    
    // Update progress
    await groupBuy.updateProgress();
    
    res.json({
      message: 'Successfully joined group buy',
      groupBuy,
      progress: groupBuy.progress
    });
  } catch (error) {
    console.error('Join group buy error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Leave group buy
router.post('/:id/leave', async (req, res) => {
  try {
    const { vendorId } = req.body;
    
    const groupBuy = await GroupBuy.findById(req.params.id);
    if (!groupBuy) {
      return res.status(404).json({ message: 'Group buy not found' });
    }
    
    // Find and update participant status
    const participant = groupBuy.participants.find(
      p => p.vendor.toString() === vendorId
    );
    
    if (!participant) {
      return res.status(404).json({ message: 'Vendor not found in this group buy' });
    }
    
    if (participant.status === 'paid' || participant.status === 'confirmed') {
      return res.status(400).json({ message: 'Cannot leave after payment confirmation' });
    }
    
    participant.status = 'cancelled';
    
    // Update progress
    await groupBuy.updateProgress();
    
    res.json({
      message: 'Successfully left group buy',
      progress: groupBuy.progress
    });
  } catch (error) {
    console.error('Leave group buy error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get group buy details
router.get('/:id', async (req, res) => {
  try {
    const groupBuy = await GroupBuy.findById(req.params.id)
      .populate('product', 'name category images pricing description')
      .populate('supplier', 'businessName rating user')
      .populate('participants.vendor', 'stallName user');
    
    if (!groupBuy) {
      return res.status(404).json({ message: 'Group buy not found' });
    }
    
    res.json(groupBuy);
  } catch (error) {
    console.error('Get group buy error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete group buy (when target reached)
router.post('/:id/complete', async (req, res) => {
  try {
    const groupBuy = await GroupBuy.findById(req.params.id);
    if (!groupBuy) {
      return res.status(404).json({ message: 'Group buy not found' });
    }
    
    if (groupBuy.progress.currentQuantity < groupBuy.requirements.targetQuantity) {
      return res.status(400).json({ message: 'Target quantity not reached' });
    }
    
    groupBuy.status = 'closed';
    await groupBuy.save();
    
    // Create individual orders for each participant
    const orders = [];
    for (const participant of groupBuy.participants) {
      if (participant.status !== 'cancelled') {
        const order = new Order({
          type: 'group_buy',
          vendor: participant.vendor,
          supplier: groupBuy.supplier,
          groupBuy: groupBuy._id,
          items: [{
            product: groupBuy.product,
            quantity: participant.quantity,
            unit: groupBuy.requirements.unit,
            pricePerUnit: groupBuy.requirements.pricePerUnit,
            totalPrice: participant.quantity * groupBuy.requirements.pricePerUnit
          }],
          pricing: {
            subtotal: participant.quantity * groupBuy.requirements.pricePerUnit,
            total: participant.quantity * groupBuy.requirements.pricePerUnit
          },
          delivery: {
            method: 'delivery',
            scheduledDate: groupBuy.schedule.deliveryDate
          },
          payment: {
            method: 'upi',
            status: 'pending'
          }
        });
        
        await order.calculateTotal();
        orders.push(order);
      }
    }
    
    await Order.insertMany(orders);
    
    res.json({
      message: 'Group buy completed successfully',
      ordersCreated: orders.length
    });
  } catch (error) {
    console.error('Complete group buy error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get vendor's group buy history
router.get('/vendor/:vendorId/history', async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = {
      'participants.vendor': req.params.vendorId
    };
    
    if (status) {
      query.status = status;
    }
    
    const groupBuys = await GroupBuy.find(query)
      .populate('product', 'name category pricing')
      .populate('supplier', 'businessName')
      .sort({ createdAt: -1 });
    
    res.json(groupBuys);
  } catch (error) {
    console.error('Get vendor group buy history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
