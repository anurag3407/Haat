import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import Confetti from 'react-confetti';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Avatar,
  TextField,
  Paper,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  Timer,
  LocationOn,
  Gavel,
  TrendingUp,
  Person,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const Bidding = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [bidSuccess, setBidSuccess] = useState(false);
  const [ripple, setRipple] = useState(false);

  useEffect(() => {
    loadBids();
  }, []);

  const loadBids = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setBids([
        {
          id: 1,
          productName: 'Flash Sale: Premium Tomatoes',
          supplier: 'Vegetable Market Co.',
          category: 'Vegetables',
          startingPrice: 30,
          currentBid: 22,
          minBid: 20,
          quantity: '200kg',
          timeLeft: '2h 45m',
          bidders: 8,
          status: 'active',
          location: 'Azadpur Mandi',
          distance: 2.3,
          description: 'Fresh premium tomatoes, Grade A quality. Quick sale due to surplus stock.',
        },
        {
          id: 2,
          productName: 'Bulk Onions - Urgent Sale',
          supplier: 'Ramesh Trading',
          category: 'Vegetables',
          startingPrice: 28,
          currentBid: 24,
          minBid: 22,
          quantity: '500kg',
          timeLeft: '1h 15m',
          bidders: 12,
          status: 'active',
          location: 'Okhla Mandi',
          distance: 4.1,
          description: 'Quality onions, slight overstock, looking for quick clearance.',
        },
        {
          id: 3,
          productName: 'Basmati Rice Flash Sale',
          supplier: 'Kumar Grains',
          category: 'Grains & Pulses',
          startingPrice: 85,
          currentBid: 78,
          minBid: 75,
          quantity: '100kg',
          timeLeft: 'Ended',
          bidders: 15,
          status: 'ended',
          location: 'Khari Baoli',
          distance: 1.8,
          description: 'Premium Basmati rice, 1121 variety.',
          winner: 'You won!',
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  const getTimeColor = (timeLeft) => {
    if (timeLeft === 'Ended') return 'text.secondary';
    if (timeLeft.includes('h') && parseInt(timeLeft) < 2) return 'error.main';
    return 'warning.main';
  };

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 18 } },
  hover: { scale: 1.03, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', transition: { duration: 0.2 } }
};

const BidCard = ({ bid, index }) => {
  // Ripple and confetti only for active bids
  const handlePlaceBid = () => {
    setRipple(true);
    setBidSuccess(true);
    setShowConfetti(true);
    setTimeout(() => setRipple(false), 400);
    setTimeout(() => setShowConfetti(false), 1800);
    setTimeout(() => setBidSuccess(false), 2000);
  };
  return (
    <Card sx={{ mb: 2, cursor: 'pointer', boxShadow: 2, borderRadius: 3, transition: 'box-shadow 0.2s', position: 'relative', overflow: 'hidden' }}>
      {bidSuccess && showConfetti && bid.status === 'active' && (
        <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={180} />
      )}
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {bid.productName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              by {bid.supplier}
            </Typography>
            <Chip
              label={bid.category}
              size="small"
              variant="outlined"
              sx={{ mt: 1 }}
            />
          </Box>
          <Box textAlign="right">
            <Chip
              label={bid.status === 'ended' ? 'Ended' : 'Live'}
              color={bid.status === 'ended' ? 'default' : 'success'}
              size="small"
            />
            <Typography 
              variant="body2" 
              color={getTimeColor(bid.timeLeft)}
              sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <Timer fontSize="small" />
              {bid.timeLeft}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <LocationOn fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {bid.location} • {bid.distance} km away
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" mb={2}>
          {bid.description}
        </Typography>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={4}>
            <Typography variant="body2" color="text.secondary">
              Starting Price
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              ₹{bid.startingPrice}/kg
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" color="text.secondary">
              Current Bid
            </Typography>
            <Typography variant="h6" color="success.main">
              ₹{bid.currentBid}/kg
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" color="text.secondary">
              Quantity
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {bid.quantity}
            </Typography>
          </Grid>
        </Grid>

        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Person fontSize="small" />
          <Typography variant="body2">
            {bid.bidders} bidders
          </Typography>
        </Box>

        {bid.status === 'ended' && bid.winner && (
          <Box mb={2}>
            <Chip
              label={bid.winner}
              color="success"
              variant="filled"
            />
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {bid.status === 'active' ? (
          <Box display="flex" gap={2} alignItems="center" position="relative">
            <TextField
              size="small"
              label="Your Bid (₹/kg)"
              type="number"
              sx={{ flex: 1 }}
              inputProps={{ min: bid.currentBid + 1 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', height: '100%' }}>
              <Button
                variant="contained"
                size="medium"
                onClick={handlePlaceBid}
                sx={{ position: 'relative', zIndex: 1, minWidth: 110, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                Place Bid
              </Button>
              {ripple && (
                <span
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: 48,
                    height: 48,
                    background: 'rgba(25, 118, 210, 0.25)',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                    zIndex: 0
                  }}
                />
              )}
            </Box>
          </Box>
        ) : (
          <Button variant="outlined" fullWidth disabled>
            Bidding Ended
          </Button>
        )}
      </CardContent>
    </Card>
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
                      width: '60%',
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
                      height: 24,
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
                <Box textAlign="right">
                  <Box
                    sx={{
                      height: 24,
                      width: 60,
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
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        bgcolor: 'grey.200',
                        borderRadius: 0.5,
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
                        width: 50,
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
              </Box>

              {/* Location skeleton */}
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    bgcolor: 'grey.200',
                    borderRadius: 0.5,
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
              </Box>

              {/* Description skeleton */}
              <Box
                sx={{
                  height: 16,
                  width: '100%',
                  bgcolor: 'grey.200',
                  borderRadius: 1,
                  mb: 2,
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

              {/* Price Grid skeleton */}
              <Grid container spacing={2} mb={2}>
                <Grid item xs={4}>
                  <Box
                    sx={{
                      height: 16,
                      width: '80%',
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
                </Grid>
                <Grid item xs={4}>
                  <Box
                    sx={{
                      height: 16,
                      width: '80%',
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
                </Grid>
                <Grid item xs={4}>
                  <Box
                    sx={{
                      height: 16,
                      width: '80%',
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
                      width: '40%',
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

              {/* Bidders skeleton */}
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    bgcolor: 'grey.200',
                    borderRadius: 0.5,
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

              {/* Winner skeleton (conditional) */}
              <Box mb={2}>
                <Box
                  sx={{
                    height: 24,
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

              <Divider sx={{ my: 2 }} />

              {/* Bidding form skeleton */}
              <Box display="flex" gap={1} alignItems="center">
                <Box
                  sx={{
                    height: 40,
                    flex: 1,
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
                    height: 40,
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

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        Live Bidding
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Participate in flash sales and surplus auctions
      </Typography>

      {/* Stats */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }} component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Typography variant="h4" color="success.main">
              <CountUp end={bids.filter(b => b.status === 'active').length} duration={1.2} />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Live Auctions
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }} component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <Typography variant="h4" color="primary">
              <CountUp end={3} duration={1.2} />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Won Bids
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }} component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <Typography variant="h4" color="warning.main">
              <CountUp end={1250} duration={1.2} prefix="₹" />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Savings
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }} component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <Typography variant="h4" color="info.main">
              <CountUp end={85} duration={1.2} suffix="%" />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Win Rate
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Bidding List */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <AnimatePresence>
              {bids.map((bid, idx) => (
                <BidCard key={bid.id} bid={bid} index={idx} />
              ))}
            </AnimatePresence>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Bidding;
