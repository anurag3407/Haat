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
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

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
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(52,211,153,0.12)' }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      style={{ marginBottom: 24 }}
    >
      <Card sx={{
        mb: 0,
        cursor: 'pointer',
        boxShadow: 3,
        borderRadius: 4,
        background: 'linear-gradient(120deg, #E6FFF7 0%, #F7F9FB 100%)',
        border: '1px solid #34D399',
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 6, borderColor: '#2A6E9A' },
      }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: '#2A6E9A', fontWeight: 700 }}>
                <Receipt fontSize="small" sx={{ mr: 1, color: '#34D399' }} /> Order #{order.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <ShoppingCart fontSize="small" sx={{ mr: 0.5, color: '#2A6E9A' }} /> {order.supplier}
              </Typography>
            </Box>
            <Box textAlign="right">
              <Chip
                label={order.status.toUpperCase()}
                color={getStatusColor(order.status)}
                size="small"
                sx={{ fontWeight: 600, bgcolor: order.status === 'delivered' ? '#34D399' : order.status === 'shipped' ? '#2A6E9A' : '#E3E8EF', color: '#222' }}
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
                <Typography variant="body2" sx={{ color: '#2A6E9A', fontWeight: 500 }}>
                  {item.name} ({item.quantity})
                </Typography>
                <Typography variant="body2" fontWeight="bold" sx={{ color: '#34D399' }}>
                  {item.price}
                </Typography>
              </Box>
            ))}
            <Divider />
            <Box display="flex" justifyContent="space-between" py={1}>
              <Typography variant="body1" fontWeight="bold" sx={{ color: '#2A6E9A' }}>
                Total Amount
              </Typography>
              <Typography variant="body1" fontWeight="bold" sx={{ color: '#34D399' }}>
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
              {order.trackingSteps.map((label, idx) => (
                <Step key={label}>
                  <StepLabel icon={
                    idx === order.currentStep ? <CheckCircle sx={{ color: '#34D399' }} /> : <LocalShipping sx={{ color: '#2A6E9A' }} />
                  }>{label}</StepLabel>
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
              <Typography variant="body2" fontWeight="bold" sx={{ color: '#2A6E9A' }}>
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
                sx={{ fontWeight: 600, bgcolor: order.paymentStatus === 'paid' ? '#34D399' : '#E3E8EF', color: '#222' }}
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
                sx={{ borderRadius: 2, color: '#2A6E9A', borderColor: '#2A6E9A', fontWeight: 700 }}
              >
                <Star fontSize="small" sx={{ mr: 0.5, color: '#34D399' }} /> Rate & Review
              </Button>
            )}
            <Button variant="outlined" size="small" sx={{ borderRadius: 2, color: '#34D399', borderColor: '#34D399', fontWeight: 700 }}>
              View Details
            </Button>
            <Button variant="outlined" size="small" sx={{ borderRadius: 2, color: '#2A6E9A', borderColor: '#2A6E9A', fontWeight: 700 }}>
              Download Invoice
            </Button>
            {order.status !== 'delivered' && order.status !== 'cancelled' && (
              <Button variant="outlined" size="small" color="error" sx={{ borderRadius: 2, fontWeight: 700 }}>
                <Cancel fontSize="small" sx={{ mr: 0.5 }} /> Cancel Order
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const FeedbackDialog = () => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');

    return (
      <Dialog open={feedbackDialog} onClose={() => setFeedbackDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle component={motion.div} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          Rate & Review Order
        </DialogTitle>
        <DialogContent component={motion.div} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
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
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
              <Rating
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                size="large"
              />
            </motion.div>
          </Box>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <TextField
              fullWidth
              label="Your Review"
              multiline
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience with this order..."
            />
          </motion.div>
        </DialogContent>
        <DialogActions component={motion.div} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Button onClick={() => setFeedbackDialog(false)}>Cancel</Button>
          <Button variant="contained" disabled={rating === 0}>
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Loading skeleton animation
  const shimmerAnimation = {
    initial: { x: '-100%' },
    animate: { 
      x: '100%',
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  // Loading skeleton components
  const LoadingSkeleton = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {[...Array(3)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          style={{ marginBottom: 16 }}
        >
          <Card sx={{ 
            '&:hover': { elevation: 4 },
            position: 'relative',
            overflow: 'hidden'
          }}>
            <CardContent>
              {/* Header skeleton */}
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box flex={1}>
                  <Box
                    sx={{
                      height: 28,
                      width: '40%',
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                      mb: 1,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <motion.div
                      variants={shimmerAnimation}
                      initial="initial"
                      animate="animate"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      height: 16,
                      width: '60%',
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <motion.div
                      variants={shimmerAnimation}
                      initial="initial"
                      animate="animate"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                      }}
                    />
                  </Box>
                </Box>
                <Box textAlign="right">
                  <Box
                    sx={{
                      height: 24,
                      width: 80,
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                      mb: 1,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <motion.div
                      variants={shimmerAnimation}
                      initial="initial"
                      animate="animate"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      height: 16,
                      width: 60,
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <motion.div
                      variants={shimmerAnimation}
                      initial="initial"
                      animate="animate"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Order Items skeleton */}
              <Box mb={2}>
                {[...Array(2)].map((_, i) => (
                  <Box key={i} display="flex" justifyContent="space-between" py={1}>
                    <Box
                      sx={{
                        height: 16,
                        width: '50%',
                        bgcolor: 'grey.200',
                        borderRadius: 1,
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <motion.div
                        variants={shimmerAnimation}
                        initial="initial"
                        animate="animate"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        height: 16,
                        width: 60,
                        bgcolor: 'grey.200',
                        borderRadius: 1,
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <motion.div
                        variants={shimmerAnimation}
                        initial="initial"
                        animate="animate"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                        }}
                      />
                    </Box>
                  </Box>
                ))}
                <Divider sx={{ my: 1 }} />
                <Box display="flex" justifyContent="space-between" py={1}>
                  <Box
                    sx={{
                      height: 20,
                      width: '30%',
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <motion.div
                      variants={shimmerAnimation}
                      initial="initial"
                      animate="animate"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      height: 20,
                      width: 80,
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <motion.div
                      variants={shimmerAnimation}
                      initial="initial"
                      animate="animate"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Order Status Stepper skeleton */}
              <Box mb={2}>
                <Box
                  sx={{
                    height: 16,
                    width: '30%',
                    bgcolor: 'grey.200',
                    borderRadius: 1,
                    mb: 1,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <motion.div
                    variants={shimmerAnimation}
                    initial="initial"
                    animate="animate"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                    }}
                  />
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  {[...Array(4)].map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 60,
                        height: 40,
                        bgcolor: 'grey.200',
                        borderRadius: 1,
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <motion.div
                        variants={shimmerAnimation}
                        initial="initial"
                        animate="animate"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Payment Info skeleton */}
              <Grid container spacing={2} mb={2}>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      height: 16,
                      width: '70%',
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                      mb: 0.5,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <motion.div
                      variants={shimmerAnimation}
                      initial="initial"
                      animate="animate"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      height: 20,
                      width: '50%',
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <motion.div
                      variants={shimmerAnimation}
                      initial="initial"
                      animate="animate"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      height: 16,
                      width: '70%',
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                      mb: 0.5,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <motion.div
                      variants={shimmerAnimation}
                      initial="initial"
                      animate="animate"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      height: 24,
                      width: 60,
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <motion.div
                      variants={shimmerAnimation}
                      initial="initial"
                      animate="animate"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Actions skeleton */}
              <Box display="flex" gap={1}>
                <Box
                  sx={{
                    height: 32,
                    width: 120,
                    bgcolor: 'grey.200',
                    borderRadius: 1,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <motion.div
                    variants={shimmerAnimation}
                    initial="initial"
                    animate="animate"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    height: 32,
                    width: 100,
                    bgcolor: 'grey.200',
                    borderRadius: 1,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <motion.div
                    variants={shimmerAnimation}
                    initial="initial"
                    animate="animate"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );

  // Regional Offers shimmer and data
  const [offersLoading, setOffersLoading] = useState(true);
  const [offers, setOffers] = useState([]);
  useEffect(() => {
    setOffersLoading(true);
    setTimeout(() => {
      setOffers([
        {
          id: 1,
          title: 'सावन धमाका! प्याज पर 10% छूट',
          desc: 'रमेश वेजिटेबल्स से आज ही ऑर्डर करें',
          image: 'https://assets.aws.labs.envato.com/-gen/user/0e012aa3-ed88-4b15-8d51-768d7d0fdbf9/d75181c4-24ff-40e9-a35f-325fa74e3fb3/afb70442-2e01-4514-b3ce-da33a0835ebd-size-400x400',
          color: '#F59E0B',
        },
        {
          id: 2,
          title: 'दूध पर विशेष ऑफर',
          desc: 'दिल्ली डेयरी से ताज़ा दूध, हर ऑर्डर पर ₹50 कैशबैक',
          image: 'https://cdn.pixabay.com/photo/2017/06/02/18/24/milk-2368352_1280.jpg',
          color: '#2A6E9A',
        },
        {
          id: 3,
          title: 'मसालों पर छूट',
          desc: 'कुमार स्पाइसेस से ग्रुप बाय पर 15% डिस्काउंट',
          image: 'https://cdn.pixabay.com/photo/2016/11/18/15/07/spices-1838212_1280.jpg',
          color: '#FDE68A',
        },
      ]);
      setOffersLoading(false);
    }, 1200);
  }, []);

  // Shimmer for offers
  const OffersShimmer = () => (
    <Box display="flex" flexDirection="column" gap={3}>
      {[...Array(3)].map((_, i) => (
        <Card key={i} sx={{ height: 120, borderRadius: 4, boxShadow: 3, position: 'relative', overflow: 'hidden', background: 'linear-gradient(90deg, #FDE68A 0%, #F7F9FB 100%)' }}>
          <Box sx={{ display: 'flex', height: '100%' }}>
            <Box sx={{ width: 120, bgcolor: 'grey.200', position: 'relative' }}>
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}
              />
            </Box>
            <Box sx={{ flex: 1, p: 2 }}>
              <Box sx={{ height: 24, width: '60%', bgcolor: 'grey.200', borderRadius: 2, mb: 1, position: 'relative', overflow: 'hidden' }}>
                <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }} />
              </Box>
              <Box sx={{ height: 16, width: '80%', bgcolor: 'grey.200', borderRadius: 2, mb: 2, position: 'relative', overflow: 'hidden' }}>
                <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }} />
              </Box>
              <Box sx={{ height: 32, width: '40%', bgcolor: 'grey.200', borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
                <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }} />
              </Box>
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  );

  // Offers Panel
  const OffersPanel = () => (
    <Box sx={{ position: { md: 'sticky' }, top: { md: 32 }, height: '100%', pl: { md: 6 }, mt: { xs: 4, md: 2 } }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#34D399', mb: 2, letterSpacing: 1 }}>
        � क्षेत्रीय ऑफर्स और प्रमोशन्स
      </Typography>
      {offersLoading ? (
        <OffersShimmer />
      ) : (
        <Box display="flex" flexDirection="column" gap={3}>
          {offers.map((offer) => (
            <motion.div key={offer.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Card sx={{ display: 'flex', borderRadius: 4, boxShadow: 4, background: `linear-gradient(120deg, #E6FFF7 0%, #F7F9FB 100%)`, overflow: 'hidden', cursor: 'pointer', position: 'relative', minHeight: 120, border: '1px solid #34D399' }}>
                <Box sx={{ width: 120, height: 120, overflow: 'hidden', position: 'relative' }}>
                  <img src={offer.image} alt={offer.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0 0 0 32px' }} />
                </Box>
                <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#2A6E9A', fontWeight: 700, mb: 1, fontSize: '1.1rem' }}>{offer.title}</Typography>
                  <Typography variant="body2" sx={{ color: '#34D399', fontWeight: 500, mb: 2 }}>{offer.desc}</Typography>
                  <Button variant="contained" sx={{ alignSelf: 'flex-start', bgcolor: '#34D399', color: '#fff', fontWeight: 700, borderRadius: 2, boxShadow: 2, textTransform: 'none', '&:hover': { bgcolor: '#2A6E9A' } }}>ऑर्डर करें</Button>
                </Box>
                <Box sx={{ position: 'absolute', right: 12, top: 12, bgcolor: '#fff', borderRadius: 2, px: 1, py: 0.5, boxShadow: 1 }}>
                  <Typography variant="caption" sx={{ color: '#34D399', fontWeight: 700 }}>Offer</Typography>
                </Box>
              </Card>
            </motion.div>
          ))}
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(120deg, #E6FFF7 0%, #F7F9FB 100%)' }}>
      <Container maxWidth="lg" sx={{ pt: { xs: 2, md: 6 }, pb: 4 }}>
        {/* Hero Section */}
        <Paper elevation={4} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, background: 'linear-gradient(135deg, #2A6E9A 0%, #34D399 100%)', color: '#fff', mb: 4, position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', right: 0, bottom: 0, opacity: 0.12, zIndex: 0 }}>
            <img src="https://cdn.pixabay.com/photo/2017/01/06/19/15/food-1957680_1280.png" alt="Order Hero" style={{ width: 220, maxWidth: '40vw' }} />
          </Box>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Receipt fontSize="large" sx={{ color: '#fff', bgcolor: '#34D399', borderRadius: 2, p: 1, boxShadow: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, letterSpacing: 1 }}>
                My Orders
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
              Track your orders, manage deliveries, and rate your experience.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 400 }}>
              <strong>“Efficient ordering, transparent tracking, and seamless payments.”</strong>
            </Typography>
          </Box>
        </Paper>
        {/* Stats Grid */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 3, background: 'linear-gradient(120deg, #E6FFF7 0%, #F7F9FB 100%)', color: '#2A6E9A', boxShadow: 2, border: '1px solid #34D399' }}>
              <Receipt fontSize="large" sx={{ color: '#34D399', mb: 1 }} />
              <Typography variant="h4" sx={{ color: '#34D399', fontWeight: 700 }}>
                {orders.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#2A6E9A', fontWeight: 500 }}>
                Total Orders
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 3, background: 'linear-gradient(120deg, #E6FFF7 0%, #F7F9FB 100%)', color: '#2A6E9A', boxShadow: 2, border: '1px solid #34D399' }}>
              <CheckCircle fontSize="large" sx={{ color: '#2A6E9A', mb: 1 }} />
              <Typography variant="h4" sx={{ color: '#2A6E9A', fontWeight: 700 }}>
                {orders.filter(o => o.status === 'delivered').length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#2A6E9A', fontWeight: 500 }}>
                Delivered
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 3, background: 'linear-gradient(120deg, #E6FFF7 0%, #F7F9FB 100%)', color: '#2A6E9A', boxShadow: 2, border: '1px solid #34D399' }}>
              <LocalShipping fontSize="large" sx={{ color: '#34D399', mb: 1 }} />
              <Typography variant="h4" sx={{ color: '#34D399', fontWeight: 700 }}>
                {orders.filter(o => ['confirmed', 'shipped'].includes(o.status)).length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#2A6E9A', fontWeight: 500 }}>
                In Progress
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 3, background: 'linear-gradient(120deg, #E6FFF7 0%, #F7F9FB 100%)', color: '#2A6E9A', boxShadow: 2, border: '1px solid #34D399' }}>
              <Star fontSize="large" sx={{ color: '#2A6E9A', mb: 1 }} />
              <Typography variant="h4" sx={{ color: '#2A6E9A', fontWeight: 700 }}>
                ₹4,535
              </Typography>
              <Typography variant="body2" sx={{ color: '#2A6E9A', fontWeight: 500 }}>
                Total Spent
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        {/* Orders List + Offers Panel */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            {loading ? (
              <LoadingSkeleton />
            ) : (
              orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <OffersPanel />
          </Grid>
        </Grid>
        <FeedbackDialog />
      </Container>
    </Box>
  );
};

export default Orders;
