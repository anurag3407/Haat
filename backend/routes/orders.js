const express = require('express');
const Order = require('../models/Order');

const router = express.Router();

// Create direct order
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.calculateTotal();
    
    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order details
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('vendor', 'stallName user')
      .populate('supplier', 'businessName user')
      .populate('items.product', 'name category images')
      .populate('groupBuy', 'title')
      .populate('bid', 'title');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { status, note } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    await order.updateStatus(status, note);
    
    res.json({
      message: 'Order status updated',
      status: order.status,
      timeline: order.timeline
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get vendor's orders
router.get('/vendor/:vendorId', async (req, res) => {
  try {
    const { status, type } = req.query;
    
    let query = { vendor: req.params.vendorId };
    
    if (status) {
      query.status = status;
    }
    
    if (type) {
      query.type = type;
    }
    
    const orders = await Order.find(query)
      .populate('supplier', 'businessName rating.averageRating')
      .populate('items.product', 'name category')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Get vendor orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get supplier's orders
router.get('/supplier/:supplierId', async (req, res) => {
  try {
    const { status, type } = req.query;
    
    let query = { supplier: req.params.supplierId };
    
    if (status) {
      query.status = status;
    }
    
    if (type) {
      query.type = type;
    }
    
    const orders = await Order.find(query)
      .populate('vendor', 'stallName user')
      .populate('items.product', 'name category')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Get supplier orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add feedback/rating to order
router.post('/:id/feedback', async (req, res) => {
  try {
    const { 
      vendorRating, 
      vendorComment, 
      supplierRating, 
      supplierComment,
      qualityRating,
      deliveryRating 
    } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.status !== 'delivered') {
      return res.status(400).json({ message: 'Can only rate completed orders' });
    }
    
    order.feedback = {
      vendorRating,
      vendorComment,
      supplierRating,
      supplierComment,
      qualityRating,
      deliveryRating
    };
    
    await order.save();
    
    res.json({
      message: 'Feedback added successfully',
      feedback: order.feedback
    });
  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
