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

const Bidding = () => {
  // Shimmer animation for loading
  const shimmerAnimation = {
    initial: { x: '-100%' },
    animate: {
      x: '100%',
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const LoadingSkeleton = () => (
    <Box>
      {[...Array(3)].map((_, idx) => (
        <Box key={idx} sx={{ mb: 2, width: '100%' }}>
          <Card sx={{
            width: '100%',
            minHeight: 180,
            boxShadow: 3,
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'stretch',
            background: 'linear-gradient(120deg, #E6FFF7 0%, #2A6E9A 100%)',
          }}>
            <CardContent sx={{ width: '100%' }}>
              {/* Header skeleton */}
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box flex={1}>
                  <Box sx={{ height: 28, width: '60%', bgcolor: 'grey.100', borderRadius: 1, mb: 1, position: 'relative', overflow: 'hidden' }}>
                    <Box component="span" sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, #34D399 60%, transparent)', opacity: 0.7 }}>
                      <Box component="span" sx={{ position: 'absolute', width: '100%', height: '100%' }}>
                        <Box component="span" sx={{ position: 'absolute', width: '100%', height: '100%' }}>
                          {/* Shimmer */}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ height: 16, width: '40%', bgcolor: 'grey.100', borderRadius: 1, mb: 1, position: 'relative', overflow: 'hidden' }}>
                    <Box component="span" sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, #2A6E9A 60%, transparent)', opacity: 0.7 }} />
                  </Box>
                  <Box sx={{ height: 24, width: 80, bgcolor: 'grey.100', borderRadius: 1, position: 'relative', overflow: 'hidden' }}>
                    <Box component="span" sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, #34D399 60%, transparent)', opacity: 0.7 }} />
                  </Box>
                </Box>
                <Box textAlign="right">
                  <Box sx={{ height: 24, width: 80, bgcolor: 'grey.100', borderRadius: 1, mb: 1, position: 'relative', overflow: 'hidden' }}>
                    <Box component="span" sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, #34D399 60%, transparent)', opacity: 0.7 }} />
                  </Box>
                  <Box sx={{ height: 16, width: 60, bgcolor: 'grey.100', borderRadius: 1, position: 'relative', overflow: 'hidden' }}>
                    <Box component="span" sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, #2A6E9A 60%, transparent)', opacity: 0.7 }} />
                  </Box>
                </Box>
              </Box>
              {/* Location skeleton */}
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Box sx={{ width: 16, height: 16, bgcolor: 'grey.100', borderRadius: 0.5, position: 'relative', overflow: 'hidden' }}>
                    <Box component="span" sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, #34D399 60%, transparent)', opacity: 0.7 }} />
                </Box>
                  <Box sx={{ height: 16, width: '50%', bgcolor: 'grey.100', borderRadius: 1, position: 'relative', overflow: 'hidden' }}>
                    <Box component="span" sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, #2A6E9A 60%, transparent)', opacity: 0.7 }} />
                </Box>
              </Box>
              {/* Description skeleton */}
              <Box sx={{ height: 16, width: '100%', bgcolor: 'grey.100', borderRadius: 1, mb: 2, position: 'relative', overflow: 'hidden' }}>
                <Box component="span" sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, #34D399 60%, transparent)', opacity: 0.7 }} />
              </Box>
              {/* Price Grid skeleton */}
              <Grid container spacing={2} mb={2}>
                <Grid item xs={4}>
                  <Box sx={{ height: 16, width: '70%', bgcolor: 'grey.100', borderRadius: 1, mb: 0.5, position: 'relative', overflow: 'hidden' }}>
                    <Box component="span" sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, #34D399 60%, transparent)', opacity: 0.7 }} />
                  </Box>
                  <Box sx={{ height: 24, width: '50%', bgcolor: 'grey.100', borderRadius: 1, position: 'relative', overflow: 'hidden' }}>
                    <Box component="span" sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, #2A6E9A 60%, transparent)', opacity: 0.7 }} />
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ height: 16, width: '70%', bgcolor: 'grey.100', borderRadius: 1, mb: 0.5, position: 'relative', overflow: 'hidden' }}>
                    <Box component="span" sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, #34D399 60%, transparent)', opacity: 0.7 }} />
                  </Box>
                  <Box sx={{ height: 24, width: '50%', bgcolor: 'grey.100', borderRadius: 1, position: 'relative', overflow: 'hidden' }}>
                    <Box component="span" sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, #2A6E9A 60%, transparent)', opacity: 0.7 }} />
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ height: 16, width: '70%', bgcolor: 'grey.100', borderRadius: 1, mb: 0.5, position: 'relative', overflow: 'hidden' }}>
                    <Box component="span" sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, #2A6E9A 60%, transparent)', opacity: 0.7 }} />
                  </Box>
                  <Box sx={{ height: 24, width: '50%', bgcolor: 'grey.100', borderRadius: 1, position: 'relative', overflow: 'hidden' }}>
                    <Box component="span" sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, #34D399 60%, transparent)', opacity: 0.7 }} />
                  </Box>
                </Grid>
              </Grid>
              {/* Bidders skeleton */}
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Box sx={{ width: 16, height: 16, bgcolor: 'grey.100', borderRadius: 0.5, position: 'relative', overflow: 'hidden' }}>
                    <Box component="span" sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, #34D399 60%, transparent)', opacity: 0.7 }} />
                </Box>
                  <Box sx={{ height: 16, width: 80, bgcolor: 'grey.100', borderRadius: 1, position: 'relative', overflow: 'hidden' }}>
                    <Box component="span" sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, #2A6E9A 60%, transparent)', opacity: 0.7 }} />
                </Box>
              </Box>
              {/* Action buttons skeleton */}
              <Box display="flex" gap={1}>
                <Box sx={{ height: 36, flex: 1, bgcolor: 'grey.100', borderRadius: 1, position: 'relative', overflow: 'hidden' }}>
                  <Box component="span" sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, #34D399 60%, transparent)', opacity: 0.7 }} />
                </Box>
                <Box sx={{ height: 36, width: 100, bgcolor: 'grey.100', borderRadius: 1, position: 'relative', overflow: 'hidden' }}>
                  <Box component="span" sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, #2A6E9A 60%, transparent)', opacity: 0.7 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const BidCard = ({ bid }) => (
    <Card sx={{
      mb: 2,
      boxShadow: 3,
      borderRadius: 4,
      background: 'linear-gradient(120deg, #E6FFF7 0%, #F7F9FB 100%)',
      border: '1px solid #34D399',
      position: 'relative',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s',
      '&:hover': { boxShadow: 6, borderColor: '#34D399' },
    }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: '#2A6E9A', fontWeight: 700 }}>
              {bid.productName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              by {bid.supplier}
            </Typography>
            <Chip
              label={bid.category}
              size="small"
              sx={{ mt: 1, bgcolor: '#34D399', color: '#fff', fontWeight: 600 }}
            />
          </Box>
          <Box textAlign="right">
            <Chip
              label={bid.status === 'ended' ? 'Ended' : 'Live'}
              color={bid.status === 'ended' ? 'default' : 'success'}
              size="small"
              sx={{ fontWeight: 600 }}
            />
            <Typography 
              variant="body2" 
              color={getTimeColor(bid.timeLeft)}
              sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <Timer fontSize="small" sx={{ color: '#2A6E9A' }} />
              {bid.timeLeft}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <LocationOn fontSize="small" sx={{ color: '#2A6E9A' }} />
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
            <Typography variant="body1" fontWeight="bold" sx={{ color: '#34D399' }}>
              ₹{bid.startingPrice}/kg
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" color="text.secondary">
              Current Bid
            </Typography>
            <Typography variant="h6" sx={{ color: '#2A6E9A', fontWeight: 700 }}>
              ₹{bid.currentBid}/kg
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" color="text.secondary">
              Quantity
            </Typography>
            <Typography variant="body1" fontWeight="bold" sx={{ color: '#34D399' }}>
              {bid.quantity}
            </Typography>
          </Grid>
        </Grid>

        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Person fontSize="small" sx={{ color: '#34D399' }} />
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
              sx={{ fontWeight: 600 }}
            />
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {bid.status === 'active' ? (
          <Box display="flex" gap={1} alignItems="center">
            <TextField
              size="small"
              label="Your Bid (₹/kg)"
              type="number"
              sx={{ flex: 1, bgcolor: '#E6FFF7', borderRadius: 2 }}
              inputProps={{ min: bid.currentBid + 1 }}
            />
            <Button variant="contained" size="small" sx={{ bgcolor: '#34D399', color: '#fff', fontWeight: 700, borderRadius: 2, boxShadow: 2 }}>
              Place Bid
            </Button>
          </Box>
        ) : (
          <Button variant="outlined" fullWidth disabled sx={{ borderRadius: 2, color: '#2A6E9A', borderColor: '#2A6E9A', fontWeight: 700 }}>
            Bidding Ended
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(120deg, #F7F9FB 0%, #E6FFF7 100%)' }}>
      <Container maxWidth="lg" sx={{ pt: { xs: 2, md: 6 }, pb: 4 }}>
        {/* Hero Section */}
        <Paper elevation={4} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, background: 'linear-gradient(135deg, #2A6E9A 0%, #34D399 100%)', color: '#fff', mb: 4, position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', right: 0, bottom: 0, opacity: 0.15, zIndex: 0 }}>
            <img src="https://cdn.pixabay.com/photo/2017/01/06/19/15/food-1957680_1280.png" alt="Street Food" style={{ width: 220, maxWidth: '40vw' }} />
          </Box>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Gavel fontSize="large" sx={{ color: '#fff', bgcolor: '#34D399', borderRadius: 2, p: 1, boxShadow: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, letterSpacing: 1 }}>
                Live Bidding
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
              Participate in flash sales, surplus auctions, and win the best deals for your business.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 400 }}>
              <strong>“Bid smart, save more, and get fresh produce at unbeatable prices.”</strong>
            </Typography>
          </Box>
        </Paper>
        {/* Stats Grid */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 3, background: 'linear-gradient(120deg, #E6FFF7 0%, #f7f9fb 100%)', color: '#2A6E9A', boxShadow: 2, border: '1px solid #34D399' }}>
              <Gavel fontSize="large" sx={{ color: '#34D399', mb: 1 }} />
              <Typography variant="h4" sx={{ color: '#34D399', fontWeight: 700 }}>
                {bids.filter(b => b.status === 'active').length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#2A6E9A', fontWeight: 500 }}>
                Live Auctions
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 3, background: 'linear-gradient(120deg, #E6FFF7 0%, #f7f9fb 100%)', color: '#2A6E9A', boxShadow: 2, border: '1px solid #34D399' }}>
              <TrendingUp fontSize="large" sx={{ color: '#2A6E9A', mb: 1 }} />
              <Typography variant="h4" sx={{ color: '#2A6E9A', fontWeight: 700 }}>
                3
              </Typography>
              <Typography variant="body2" sx={{ color: '#2A6E9A', fontWeight: 500 }}>
                Won Bids
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 3, background: 'linear-gradient(120deg, #E6FFF7 0%, #f7f9fb 100%)', color: '#2A6E9A', boxShadow: 2, border: '1px solid #34D399' }}>
              <Person fontSize="large" sx={{ color: '#34D399', mb: 1 }} />
              <Typography variant="h4" sx={{ color: '#34D399', fontWeight: 700 }}>
                ₹1,250
              </Typography>
              <Typography variant="body2" sx={{ color: '#2A6E9A', fontWeight: 500 }}>
                Total Savings
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 3, background: 'linear-gradient(120deg, #E6FFF7 0%, #f7f9fb 100%)', color: '#2A6E9A', boxShadow: 2, border: '1px solid #34D399' }}>
              <Timer fontSize="large" sx={{ color: '#2A6E9A', mb: 1 }} />
              <Typography variant="h4" sx={{ color: '#2A6E9A', fontWeight: 700 }}>
                85%
              </Typography>
              <Typography variant="body2" sx={{ color: '#2A6E9A', fontWeight: 500 }}>
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
            bids.map((bid, idx) => (
              <BidCard key={bid.id} bid={bid} />
            ))
          )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Bidding;
