const express = require('express');
const Order = require('../models/Order');
const Vendor = require('../models/Vendor');

const router = express.Router();

// Simulate UPI payment
router.post('/upi/initiate', async (req, res) => {
  try {
    const { orderId, amount, vendorId } = req.body;
    
    if (!orderId || !amount || !vendorId) {
      return res.status(400).json({ message: 'Order ID, amount, and vendor ID required' });
    }
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.pricing.total !== amount) {
      return res.status(400).json({ message: 'Amount mismatch' });
    }
    
    // Simulate UPI payment process
    const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9);
    
    // In real implementation, integrate with UPI gateway
    // For demo, we'll simulate success
    const paymentSuccess = Math.random() > 0.1; // 90% success rate
    
    if (paymentSuccess) {
      order.payment.status = 'paid';
      order.payment.transactionId = transactionId;
      order.payment.paidAt = new Date();
      
      await order.updateStatus('confirmed', 'Payment successful');
      
      // Update vendor trust score for on-time payment
      const vendor = await Vendor.findById(vendorId);
      if (vendor) {
        vendor.trustScore.paymentHistory.onTimePayments += 1;
        vendor.trustScore.paymentHistory.totalOrders += 1;
        await vendor.updateTrustScore();
      }
      
      res.json({
        success: true,
        message: 'Payment successful',
        transactionId,
        order: {
          id: order._id,
          status: order.status,
          paymentStatus: order.payment.status
        }
      });
    } else {
      order.payment.status = 'failed';
      await order.save();
      
      res.status(400).json({
        success: false,
        message: 'Payment failed. Please try again.',
        order: {
          id: order._id,
          paymentStatus: order.payment.status
        }
      });
    }
  } catch (error) {
    console.error('UPI payment error:', error);
    res.status(500).json({ message: 'Payment processing error' });
  }
});

// Get payment status
router.get('/status/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .select('payment pricing status');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({
      orderId: order._id,
      paymentStatus: order.payment.status,
      amount: order.pricing.total,
      transactionId: order.payment.transactionId,
      paidAt: order.payment.paidAt
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Refund payment (for cancelled orders)
router.post('/refund/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.payment.status !== 'paid') {
      return res.status(400).json({ message: 'Order is not paid' });
    }
    
    if (order.status !== 'cancelled') {
      return res.status(400).json({ message: 'Order is not cancelled' });
    }
    
    // Simulate refund process
    order.payment.status = 'refunded';
    await order.save();
    
    res.json({
      message: 'Refund processed successfully',
      refundAmount: order.pricing.total,
      transactionId: order.payment.transactionId
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment history for vendor
router.get('/history/vendor/:vendorId', async (req, res) => {
  try {
    const orders = await Order.find({
      vendor: req.params.vendorId,
      'payment.status': { $in: ['paid', 'refunded'] }
    })
    .populate('supplier', 'businessName')
    .select('pricing payment items type createdAt')
    .sort({ 'payment.paidAt': -1 });
    
    const paymentHistory = orders.map(order => ({
      orderId: order._id,
      amount: order.pricing.total,
      status: order.payment.status,
      transactionId: order.payment.transactionId,
      paidAt: order.payment.paidAt,
      supplier: order.supplier.businessName,
      orderType: order.type,
      itemsCount: order.items.length
    }));
    
    res.json(paymentHistory);
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
