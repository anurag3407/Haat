const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const { 
  authenticateToken, 
  requireVendor, 
  requireSupplier,
  requireVendorOrSupplier,
  orderRateLimit 
} = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private (Vendors only)
router.post('/', authenticateToken, requireVendor, orderRateLimit, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      quantity,
      estimatedPrice,
      type,
      groupBuy,
      delivery,
      specialRequirements,
      images,
      voiceNote
    } = req.body;
    
    // Validation
    if (!title || !description || !category || !quantity || !estimatedPrice) {
      return res.status(400).json({
        message: 'Missing required fields',
        error: 'VALIDATION_ERROR'
      });
    }
    
    // Create order data
    const orderData = {
      vendor: req.user._id,
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      quantity: parseInt(quantity),
      estimatedPrice: parseFloat(estimatedPrice),
      type: type || 'individual',
      delivery: {
        address: delivery?.address || {},
        preferredTime: delivery?.preferredTime || 'flexible',
        urgency: delivery?.urgency || 'medium'
      },
      specialRequirements: specialRequirements?.trim() || '',
      images: images || [],
      voiceNote: voiceNote || null
    };
    
    // Handle group buy settings
    if (type === 'group' && groupBuy) {
      orderData.groupBuy = {
        isGroupBuy: true,
        minParticipants: parseInt(groupBuy.minParticipants) || 2,
        maxParticipants: parseInt(groupBuy.maxParticipants) || 50,
        currentParticipants: 1,
        participants: [{
          vendor: req.user._id,
          quantity: parseInt(quantity)
        }],
        deadline: new Date(groupBuy.deadline)
      };
      
      // Validate deadline
      if (orderData.groupBuy.deadline <= new Date()) {
        return res.status(400).json({
          message: 'Group buy deadline must be in the future',
          error: 'INVALID_DEADLINE'
        });
      }
    }
    
    // Set delivery coordinates if provided
    if (delivery?.coordinates && Array.isArray(delivery.coordinates) && delivery.coordinates.length === 2) {
      orderData.delivery.address.coordinates = delivery.coordinates;
    } else if (req.user.location?.coordinates) {
      // Use user's default location
      orderData.delivery.address.coordinates = req.user.location.coordinates;
      orderData.delivery.address = {
        ...orderData.delivery.address,
        street: req.user.location.address,
        city: req.user.location.city,
        state: req.user.location.state,
        zipCode: req.user.location.zipCode
      };
    }
    
    // Create order
    const order = new Order(orderData);
    await order.save();
    
    // Populate vendor information
    await order.populate('vendor', 'name email phone businessInfo location');
    
    // Update vendor's total orders count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalOrders: 1 }
    });
    
    res.status(201).json({
      message: 'Order created successfully',
      order
    });
    
  } catch (error) {
    console.error('Order creation error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        error: error.message
      });
    }
    
    res.status(500).json({
      message: 'Server error creating order',
      error: 'ORDER_CREATION_ERROR'
    });
  }
});

// @route   GET /api/orders
// @desc    Get orders (filtered by user role)
// @access  Private
router.get('/', authenticateToken, requireVendorOrSupplier, async (req, res) => {
  try {
    const { 
      status, 
      type, 
      category, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Build query based on user role
    let query = {};
    
    if (req.user.role === 'vendor') {
      // Vendors see their own orders
      query.vendor = req.user._id;
    } else if (req.user.role === 'supplier') {
      // Suppliers see orders they can bid on or have been assigned to
      query = {
        $or: [
          { supplier: req.user._id },
          { 
            status: { $in: ['pending', 'bidding'] },
            $or: [
              { category: { $in: req.user.categories || [] } },
              { 'bids.supplier': req.user._id }
            ]
          }
        ]
      };
    }
    
    // Apply filters
    if (status) {
      query.status = status;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (category) {
      query.category = new RegExp(category, 'i');
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Execute query
    const orders = await Order.find(query)
      .populate('vendor', 'name email phone businessInfo location civilScore')
      .populate('supplier', 'name email phone businessInfo location supplierRating')
      .populate('bids.supplier', 'name businessInfo supplierRating')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);
    
    // Get total count for pagination
    const total = await Order.countDocuments(query);
    
    res.json({
      message: 'Orders retrieved successfully',
      orders,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });
    
  } catch (error) {
    console.error('Orders retrieval error:', error);
    
    res.status(500).json({
      message: 'Server error retrieving orders',
      error: 'ORDERS_RETRIEVAL_ERROR'
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Private
router.get('/:id', authenticateToken, requireVendorOrSupplier, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('vendor', 'name email phone businessInfo location civilScore')
      .populate('supplier', 'name email phone businessInfo location supplierRating')
      .populate('bids.supplier', 'name businessInfo supplierRating')
      .populate('groupBuy.participants.vendor', 'name businessInfo')
      .populate('notes.author', 'name role');
    
    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
        error: 'ORDER_NOT_FOUND'
      });
    }
    
    // Check permissions
    const isVendor = order.vendor._id.toString() === req.user._id.toString();
    const isSupplier = order.supplier?.toString() === req.user._id.toString();
    const hasBid = order.bids.some(bid => bid.supplier._id.toString() === req.user._id.toString());
    const isParticipant = order.groupBuy?.participants?.some(
      p => p.vendor.toString() === req.user._id.toString()
    );
    
    if (!isVendor && !isSupplier && !hasBid && !isParticipant) {
      return res.status(403).json({
        message: 'Access denied',
        error: 'ACCESS_DENIED'
      });
    }
    
    res.json({
      message: 'Order retrieved successfully',
      order
    });
    
  } catch (error) {
    console.error('Order retrieval error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid order ID',
        error: 'INVALID_ORDER_ID'
      });
    }
    
    res.status(500).json({
      message: 'Server error retrieving order',
      error: 'ORDER_RETRIEVAL_ERROR'
    });
  }
});

// @route   POST /api/orders/:id/join
// @desc    Join a group buy order
// @access  Private (Vendors only)
router.post('/:id/join', authenticateToken, requireVendor, async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: 'Valid quantity is required',
        error: 'INVALID_QUANTITY'
      });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
        error: 'ORDER_NOT_FOUND'
      });
    }
    
    // Validate group buy conditions
    if (order.type !== 'group') {
      return res.status(400).json({
        message: 'This is not a group buy order',
        error: 'NOT_GROUP_BUY'
      });
    }
    
    if (order.status !== 'pending' && order.status !== 'bidding') {
      return res.status(400).json({
        message: 'Group buy is no longer accepting participants',
        error: 'GROUP_BUY_CLOSED'
      });
    }
    
    if (new Date() > order.groupBuy.deadline) {
      return res.status(400).json({
        message: 'Group buy deadline has passed',
        error: 'DEADLINE_PASSED'
      });
    }
    
    if (order.groupBuy.currentParticipants >= order.groupBuy.maxParticipants) {
      return res.status(400).json({
        message: 'Group buy is full',
        error: 'GROUP_BUY_FULL'
      });
    }
    
    // Check if user is already participating
    const existingParticipant = order.groupBuy.participants.find(
      p => p.vendor.toString() === req.user._id.toString()
    );
    
    if (existingParticipant) {
      return res.status(400).json({
        message: 'You are already participating in this group buy',
        error: 'ALREADY_PARTICIPATING'
      });
    }
    
    // Add participant
    await order.addParticipant(req.user._id, parseInt(quantity));
    
    // Populate the updated order
    await order.populate('groupBuy.participants.vendor', 'name businessInfo');
    
    res.json({
      message: 'Successfully joined group buy',
      order
    });
    
  } catch (error) {
    console.error('Group buy join error:', error);
    
    res.status(500).json({
      message: 'Server error joining group buy',
      error: 'GROUP_BUY_JOIN_ERROR'
    });
  }
});

// @route   POST /api/orders/:id/bid
// @desc    Place a bid on an order
// @access  Private (Suppliers only)
router.post('/:id/bid', authenticateToken, requireSupplier, async (req, res) => {
  try {
    const { price, message, estimatedTime } = req.body;
    
    // Validation
    if (!price || price <= 0) {
      return res.status(400).json({
        message: 'Valid price is required',
        error: 'INVALID_PRICE'
      });
    }
    
    if (!estimatedTime || estimatedTime <= 0) {
      return res.status(400).json({
        message: 'Valid estimated time is required',
        error: 'INVALID_TIME'
      });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
        error: 'ORDER_NOT_FOUND'
      });
    }
    
    // Check if order accepts bids
    if (!['pending', 'bidding'].includes(order.status)) {
      return res.status(400).json({
        message: 'Order is not accepting bids',
        error: 'BIDDING_CLOSED'
      });
    }
    
    // Check if it's a group buy and still within deadline
    if (order.type === 'group' && new Date() > order.groupBuy.deadline) {
      return res.status(400).json({
        message: 'Group buy deadline has passed',
        error: 'DEADLINE_PASSED'
      });
    }
    
    // Add/update bid
    await order.addBid(req.user._id, parseFloat(price), message?.trim() || '', parseInt(estimatedTime));
    
    // Populate the updated order
    await order.populate('bids.supplier', 'name businessInfo supplierRating');
    
    res.json({
      message: 'Bid placed successfully',
      order
    });
    
  } catch (error) {
    console.error('Bid placement error:', error);
    
    res.status(500).json({
      message: 'Server error placing bid',
      error: 'BID_PLACEMENT_ERROR'
    });
  }
});

// @route   POST /api/orders/:id/accept-bid
// @desc    Accept a bid on an order
// @access  Private (Vendors only)
router.post('/:id/accept-bid', authenticateToken, requireVendor, async (req, res) => {
  try {
    const { bidId } = req.body;
    
    if (!bidId) {
      return res.status(400).json({
        message: 'Bid ID is required',
        error: 'MISSING_BID_ID'
      });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
        error: 'ORDER_NOT_FOUND'
      });
    }
    
    // Check ownership
    if (order.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Only the order creator can accept bids',
        error: 'ACCESS_DENIED'
      });
    }
    
    // Find the bid
    const bid = order.bids.id(bidId);
    
    if (!bid) {
      return res.status(404).json({
        message: 'Bid not found',
        error: 'BID_NOT_FOUND'
      });
    }
    
    // Accept the bid
    bid.isAccepted = true;
    order.supplier = bid.supplier;
    order.finalPrice = bid.price;
    order.status = 'accepted';
    
    // Add status history
    order.statusHistory.push({
      status: 'accepted',
      timestamp: new Date(),
      note: `Bid accepted from supplier`,
      updatedBy: req.user._id
    });
    
    await order.save();
    
    // Populate the updated order
    await order.populate('supplier', 'name email phone businessInfo');
    
    res.json({
      message: 'Bid accepted successfully',
      order
    });
    
  } catch (error) {
    console.error('Bid acceptance error:', error);
    
    res.status(500).json({
      message: 'Server error accepting bid',
      error: 'BID_ACCEPTANCE_ERROR'
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private
router.put('/:id/status', authenticateToken, requireVendorOrSupplier, async (req, res) => {
  try {
    const { status, note } = req.body;
    
    const validStatuses = [
      'pending', 'bidding', 'accepted', 'confirmed', 'preparing',
      'ready', 'in_transit', 'delivered', 'completed', 'cancelled'
    ];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status',
        error: 'INVALID_STATUS'
      });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
        error: 'ORDER_NOT_FOUND'
      });
    }
    
    // Check permissions for status updates
    const isVendor = order.vendor.toString() === req.user._id.toString();
    const isSupplier = order.supplier?.toString() === req.user._id.toString();
    
    if (!isVendor && !isSupplier) {
      return res.status(403).json({
        message: 'Access denied',
        error: 'ACCESS_DENIED'
      });
    }
    
    // Validate status transitions based on role
    const currentStatus = order.status;
    let allowedTransitions = [];
    
    if (req.user.role === 'vendor') {
      allowedTransitions = {
        'accepted': ['confirmed', 'cancelled'],
        'ready': ['in_transit'],
        'delivered': ['completed'],
        'in_transit': ['delivered'],
        'preparing': ['cancelled'],
        'confirmed': ['cancelled']
      }[currentStatus] || [];
    } else if (req.user.role === 'supplier') {
      allowedTransitions = {
        'accepted': ['preparing'],
        'confirmed': ['preparing'],
        'preparing': ['ready'],
        'ready': ['in_transit'],
        'in_transit': ['delivered']
      }[currentStatus] || [];
    }
    
    if (!allowedTransitions.includes(status)) {
      return res.status(400).json({
        message: `Cannot change status from ${currentStatus} to ${status}`,
        error: 'INVALID_STATUS_TRANSITION'
      });
    }
    
    // Update status
    await order.updateStatus(status, note, req.user._id);
    
    // Handle completion - update civil scores and success rates
    if (status === 'completed') {
      // Update vendor's successful orders
      await User.findByIdAndUpdate(order.vendor, {
        $inc: { successfulOrders: 1 }
      });
      
      // Update vendor's civil score (positive for completion)
      const vendor = await User.findById(order.vendor);
      await vendor.updateCivilScore(10, 'Order completed successfully');
      
      // If it's a group buy, update all participants
      if (order.type === 'group') {
        for (const participant of order.groupBuy.participants) {
          await User.findByIdAndUpdate(participant.vendor, {
            $inc: { successfulOrders: 1 }
          });
          
          const participantUser = await User.findById(participant.vendor);
          await participantUser.updateCivilScore(5, 'Group buy completed successfully');
        }
      }
    }
    
    // Handle cancellation - negative impact on civil score
    if (status === 'cancelled' && req.user.role === 'vendor') {
      const vendor = await User.findById(order.vendor);
      await vendor.updateCivilScore(-15, 'Order cancelled by vendor');
    }
    
    await order.populate('vendor', 'name civilScore');
    await order.populate('supplier', 'name supplierRating');
    
    res.json({
      message: 'Order status updated successfully',
      order
    });
    
  } catch (error) {
    console.error('Status update error:', error);
    
    res.status(500).json({
      message: 'Server error updating status',
      error: 'STATUS_UPDATE_ERROR'
    });
  }
});

// @route   POST /api/orders/:id/notes
// @desc    Add a note to an order
// @access  Private
router.post('/:id/notes', authenticateToken, requireVendorOrSupplier, async (req, res) => {
  try {
    const { message, isPublic = true } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        message: 'Note message is required',
        error: 'MISSING_MESSAGE'
      });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
        error: 'ORDER_NOT_FOUND'
      });
    }
    
    // Check permissions
    const isVendor = order.vendor.toString() === req.user._id.toString();
    const isSupplier = order.supplier?.toString() === req.user._id.toString();
    const hasBid = order.bids.some(bid => bid.supplier.toString() === req.user._id.toString());
    
    if (!isVendor && !isSupplier && !hasBid) {
      return res.status(403).json({
        message: 'Access denied',
        error: 'ACCESS_DENIED'
      });
    }
    
    // Add note
    order.notes.push({
      author: req.user._id,
      message: message.trim(),
      isPublic: isPublic
    });
    
    await order.save();
    
    // Populate the note author
    await order.populate('notes.author', 'name role');
    
    const newNote = order.notes[order.notes.length - 1];
    
    res.json({
      message: 'Note added successfully',
      note: newNote
    });
    
  } catch (error) {
    console.error('Note addition error:', error);
    
    res.status(500).json({
      message: 'Server error adding note',
      error: 'NOTE_ADDITION_ERROR'
    });
  }
});

module.exports = router;
