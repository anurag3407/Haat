import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Rating,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ShoppingCart,
  LocalShipping,
  CheckCircle,
  Cancel,
  Star,
  Receipt,
  Phone,
} from '@mui/icons-material';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedbackDialog, setFeedbackDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setOrders([
        {
          id: 'ORD001',
          supplier: 'Ramesh Vegetables',
          items: [
            { name: 'Onions', quantity: '50kg', price: '₹1,100' },
            { name: 'Tomatoes', quantity: '30kg', price: '₹660' },
          ],
          totalAmount: '₹1,760',
          status: 'delivered',
          orderDate: '2024-01-20',
          deliveryDate: '2024-01-21',
          paymentMethod: 'UPI',
          paymentStatus: 'paid',
          trackingSteps: ['Order Placed', 'Confirmed', 'Shipped', 'Delivered'],
          currentStep: 3,
        },
        {
          id: 'ORD002',
          supplier: 'Kumar Spices',
          items: [
            { name: 'Basmati Rice', quantity: '25kg', price: '₹1,875' },
          ],
          totalAmount: '₹1,875',
          status: 'shipped',
          orderDate: '2024-01-22',
          deliveryDate: '2024-01-23',
          paymentMethod: 'Cash on Delivery',
          paymentStatus: 'pending',
          trackingSteps: ['Order Placed', 'Confirmed', 'Shipped', 'Delivered'],
          currentStep: 2,
        },
        {
          id: 'ORD003',
          supplier: 'Delhi Dairy',
          items: [
            { name: 'Fresh Milk', quantity: '20L', price: '₹900' },
          ],
          totalAmount: '₹900',
          status: 'confirmed',
          orderDate: '2024-01-23',
          deliveryDate: '2024-01-24',
          paymentMethod: 'UPI',
          paymentStatus: 'paid',
          trackingSteps: ['Order Placed', 'Confirmed', 'Shipped', 'Delivered'],
          currentStep: 1,
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'confirmed': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const OrderCard = ({ order }) => (
    <Card sx={{ mb: 2, '&:hover': { elevation: 4 } }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Order #{order.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.supplier}
            </Typography>
          </Box>
          <Box textAlign="right">
            <Chip
              label={order.status.toUpperCase()}
              color={getStatusColor(order.status)}
              size="small"
            />
            <Typography variant="body2" color="text.secondary" mt={1}>
              {order.orderDate}
            </Typography>
          </Box>
        </Box>

        {/* Order Items */}
        <Box mb={2}>
          {order.items.map((item, index) => (
            <Box key={index} display="flex" justifyContent="space-between" py={1}>
              <Typography variant="body2">
                {item.name} ({item.quantity})
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {item.price}
              </Typography>
            </Box>
          ))}
          <Divider />
          <Box display="flex" justifyContent="space-between" py={1}>
            <Typography variant="body1" fontWeight="bold">
              Total Amount
            </Typography>
            <Typography variant="body1" fontWeight="bold" color="primary">
              {order.totalAmount}
            </Typography>
          </Box>
        </Box>

        {/* Order Status Stepper */}
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Order Status
          </Typography>
          <Stepper activeStep={order.currentStep} alternativeLabel>
            {order.trackingSteps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Payment Info */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Payment Method
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {order.paymentMethod}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Payment Status
            </Typography>
            <Chip
              label={order.paymentStatus.toUpperCase()}
              size="small"
              color={order.paymentStatus === 'paid' ? 'success' : 'warning'}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Actions */}
        <Box display="flex" gap={1}>
          {order.status === 'delivered' && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSelectedOrder(order);
                setFeedbackDialog(true);
              }}
            >
              Rate & Review
            </Button>
          )}
          <Button variant="outlined" size="small">
            View Details
          </Button>
          <Button variant="outlined" size="small">
            Download Invoice
          </Button>
          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <Button variant="outlined" size="small" color="error">
              Cancel Order
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  const FeedbackDialog = () => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');

    return (
      <Dialog open={feedbackDialog} onClose={() => setFeedbackDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Rate & Review Order</DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Typography variant="body1" mb={1}>
              Order #{selectedOrder?.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedOrder?.supplier}
            </Typography>
          </Box>
          
          <Box mb={2}>
            <Typography variant="body2" mb={1}>
              Your Rating
            </Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              size="large"
            />
          </Box>
          
          <TextField
            fullWidth
            label="Your Review"
            multiline
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience with this order..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialog(false)}>Cancel</Button>
          <Button variant="contained" disabled={rating === 0}>
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Track your orders and manage deliveries
      </Typography>

      {/* Stats */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {orders.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Orders
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">
              {orders.filter(o => o.status === 'delivered').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Delivered
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main">
              {orders.filter(o => ['confirmed', 'shipped'].includes(o.status)).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              In Progress
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="info.main">
              ₹4,535
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Spent
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Orders List */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {loading ? (
            <Box textAlign="center" py={4}>
              <Typography>Loading orders...</Typography>
            </Box>
          ) : (
            orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </Grid>
      </Grid>

      <FeedbackDialog />
    </Container>
  );
};

export default Orders;
