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
    <Card sx={{ mb: 2, '&:hover': { elevation: 4 } }}>
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
          <Box display="flex" gap={1} alignItems="center">
            <TextField
              size="small"
              label="Your Bid (₹/kg)"
              type="number"
              sx={{ flex: 1 }}
              inputProps={{ min: bid.currentBid + 1 }}
            />
            <Button variant="contained" size="small">
              Place Bid
            </Button>
          </Box>
        ) : (
          <Button variant="outlined" fullWidth disabled>
            Bidding Ended
          </Button>
        )}
      </CardContent>
    </Card>
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
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">
              {bids.filter(b => b.status === 'active').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Live Auctions
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              3
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Won Bids
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main">
              ₹1,250
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Savings
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="info.main">
              85%
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
            <Box textAlign="center" py={4}>
              <Typography>Loading auctions...</Typography>
            </Box>
          ) : (
            bids.map((bid) => (
              <BidCard key={bid.id} bid={bid} />
            ))
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Bidding;
