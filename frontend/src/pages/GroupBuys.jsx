import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  LinearProgress,
  Chip,
  Avatar,
  AvatarGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Add,
  Group,
  Timer,
  LocationOn,
  TrendingUp,
  Share,
  People,
  ShoppingCart,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const GroupBuys = () => {
  const [groupBuys, setGroupBuys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [selectedGroupBuy, setSelectedGroupBuy] = useState(null);
  const { user } = useAuth();

  const [newGroupBuy, setNewGroupBuy] = useState({
    productName: '',
    targetQuantity: '',
    currentPrice: '',
    targetPrice: '',
    category: '',
    deadline: '',
    description: '',
  });

  const categories = [
    'Vegetables',
    'Fruits',
    'Grains & Pulses',
    'Dairy Products',
    'Spices',
    'Snacks',
    'Others'
  ];

  useEffect(() => {
    loadGroupBuys();
  }, []);

  const loadGroupBuys = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setGroupBuys([
        {
          id: 1,
          productName: 'Premium Onions',
          organizer: 'Ramesh Kumar',
          organizerId: 'vendor123',
          targetQuantity: 500,
          currentQuantity: 375,
          targetPrice: 20,
          currentPrice: 25,
          category: 'Vegetables',
          deadline: '2024-01-25T18:00:00',
          participants: [
            { id: 1, name: 'Amit Singh', quantity: 50 },
            { id: 2, name: 'Priya Sharma', quantity: 75 },
            { id: 3, name: 'Suresh Gupta', quantity: 100 },
            { id: 4, name: 'Meera Devi', quantity: 150 },
          ],
          location: 'Azadpur Mandi',
          distance: 2.3,
          status: 'active',
          description: 'High quality onions for retail vendors. Grade A quality assured.',
        },
        {
          id: 2,
          productName: 'Basmati Rice (10kg bags)',
          organizer: 'Kumar Traders',
          organizerId: 'supplier456',
          targetQuantity: 200,
          currentQuantity: 120,
          targetPrice: 800,
          currentPrice: 950,
          category: 'Grains & Pulses',
          deadline: '2024-01-24T12:00:00',
          participants: [
            { id: 5, name: 'Raj Patel', quantity: 30 },
            { id: 6, name: 'Sita Ram', quantity: 40 },
            { id: 7, name: 'Govind Singh', quantity: 50 },
          ],
          location: 'Khari Baoli',
          distance: 1.8,
          status: 'active',
          description: 'Premium Basmati rice, 1121 variety. Bulk discount available.',
        },
        {
          id: 3,
          productName: 'Fresh Tomatoes',
          organizer: 'Vegetable Union',
          organizerId: 'vendor789',
          targetQuantity: 300,
          currentQuantity: 300,
          targetPrice: 18,
          currentPrice: 22,
          category: 'Vegetables',
          deadline: '2024-01-23T10:00:00',
          participants: [
            { id: 8, name: 'Lakshmi Devi', quantity: 80 },
            { id: 9, name: 'Ravi Kumar', quantity: 120 },
            { id: 10, name: 'Anita Singh', quantity: 100 },
          ],
          location: 'Okhla Mandi',
          distance: 4.2,
          status: 'completed',
          description: 'Fresh tomatoes, Grade A quality. Ready for distribution.',
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleCreateGroupBuy = async () => {
    // Simulate API call
    console.log('Creating group buy:', newGroupBuy);
    setCreateDialogOpen(false);
    setNewGroupBuy({
      productName: '',
      targetQuantity: '',
      currentPrice: '',
      targetPrice: '',
      category: '',
      deadline: '',
      description: '',
    });
    loadGroupBuys();
  };

  const handleJoinGroupBuy = async (quantity) => {
    // Simulate API call
    console.log('Joining group buy:', selectedGroupBuy.id, 'with quantity:', quantity);
    setJoinDialogOpen(false);
    setSelectedGroupBuy(null);
    loadGroupBuys();
  };

  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    
    return `${hours}h ${minutes}m`;
  };

  const GroupBuyCard = ({ groupBuy }) => {
    const progress = (groupBuy.currentQuantity / groupBuy.targetQuantity) * 100;
    const savings = groupBuy.currentPrice - groupBuy.targetPrice;
    const timeLeft = getTimeRemaining(groupBuy.deadline);
    
    return (
      <Card sx={{ mb: 2, '&:hover': { elevation: 4 } }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="h6" gutterBottom>
                {groupBuy.productName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Organized by {groupBuy.organizer}
              </Typography>
              <Chip
                label={groupBuy.category}
                size="small"
                variant="outlined"
                sx={{ mt: 1 }}
              />
            </Box>
            <Box textAlign="right">
              <Chip
                label={groupBuy.status === 'completed' ? 'Completed' : 'Active'}
                color={groupBuy.status === 'completed' ? 'success' : 'primary'}
                size="small"
              />
              {groupBuy.status === 'active' && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  <Timer fontSize="small" sx={{ mr: 0.5 }} />
                  {timeLeft}
                </Typography>
              )}
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <LocationOn fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {groupBuy.location} • {groupBuy.distance} km away
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" mb={2}>
            {groupBuy.description}
          </Typography>

          <Box mb={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body2">
                Progress: {groupBuy.currentQuantity}/{groupBuy.targetQuantity} kg
              </Typography>
              <Typography variant="body2" color="success.main">
                {Math.round(progress)}% complete
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(progress, 100)}
              sx={{ height: 8, borderRadius: 4 }}
              color={progress >= 100 ? 'success' : 'primary'}
            />
          </Box>

          <Grid container spacing={2} mb={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Current Price
              </Typography>
              <Typography variant="h6" color="error">
                ₹{groupBuy.currentPrice}/kg
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Target Price
              </Typography>
              <Typography variant="h6" color="success.main">
                ₹{groupBuy.targetPrice}/kg
              </Typography>
            </Grid>
          </Grid>

          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <People fontSize="small" />
              <Typography variant="body2">
                {groupBuy.participants.length} participants
              </Typography>
            </Box>
            <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: 12 } }}>
              {groupBuy.participants.map((participant) => (
                <Avatar key={participant.id}>
                  {participant.name.charAt(0)}
                </Avatar>
              ))}
            </AvatarGroup>
          </Box>

          <Typography variant="body2" color="success.main" fontWeight="bold" mb={2}>
            Potential Savings: ₹{savings}/kg
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" gap={1}>
            {groupBuy.status === 'active' && progress < 100 && (
              <Button
                variant="contained"
                size="small"
                fullWidth
                onClick={() => {
                  setSelectedGroupBuy(groupBuy);
                  setJoinDialogOpen(true);
                }}
              >
                Join Group Buy
              </Button>
            )}
            {groupBuy.status === 'completed' && (
              <Button variant="outlined" size="small" fullWidth>
                View Details
              </Button>
            )}
            <IconButton size="small">
              <Share />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const JoinDialog = () => {
    const [quantity, setQuantity] = useState('');
    
    return (
      <Dialog open={joinDialogOpen} onClose={() => setJoinDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Join Group Buy</DialogTitle>
        <DialogContent>
          <Typography variant="body1" mb={2}>
            {selectedGroupBuy?.productName} - ₹{selectedGroupBuy?.targetPrice}/kg
          </Typography>
          <TextField
            fullWidth
            label="Quantity (kg)"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            sx={{ mt: 2 }}
            helperText={`Remaining: ${selectedGroupBuy?.targetQuantity - selectedGroupBuy?.currentQuantity} kg`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJoinDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => handleJoinGroupBuy(quantity)}
            variant="contained"
            disabled={!quantity || quantity <= 0}
          >
            Join
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const CreateDialog = () => (
    <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>Create New Group Buy</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Product Name"
              value={newGroupBuy.productName}
              onChange={(e) => setNewGroupBuy({ ...newGroupBuy, productName: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={newGroupBuy.category}
                onChange={(e) => setNewGroupBuy({ ...newGroupBuy, category: e.target.value })}
                label="Category"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Target Quantity (kg)"
              type="number"
              value={newGroupBuy.targetQuantity}
              onChange={(e) => setNewGroupBuy({ ...newGroupBuy, targetQuantity: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Current Price (₹/kg)"
              type="number"
              value={newGroupBuy.currentPrice}
              onChange={(e) => setNewGroupBuy({ ...newGroupBuy, currentPrice: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Target Price (₹/kg)"
              type="number"
              value={newGroupBuy.targetPrice}
              onChange={(e) => setNewGroupBuy({ ...newGroupBuy, targetPrice: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Deadline"
              type="datetime-local"
              value={newGroupBuy.deadline}
              onChange={(e) => setNewGroupBuy({ ...newGroupBuy, deadline: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={newGroupBuy.description}
              onChange={(e) => setNewGroupBuy({ ...newGroupBuy, description: e.target.value })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleCreateGroupBuy} variant="contained">
          Create Group Buy
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Group Buys
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join bulk purchases to get better prices
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Group Buy
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {groupBuys.filter(gb => gb.status === 'active').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Group Buys
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">
              ₹2,340
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Savings
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main">
              24
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Joined Groups
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="info.main">
              12
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completed
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Group Buys List */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {loading ? (
            <Box textAlign="center" py={4}>
              <Typography>Loading group buys...</Typography>
            </Box>
          ) : (
            groupBuys.map((groupBuy) => (
              <GroupBuyCard key={groupBuy.id} groupBuy={groupBuy} />
            ))
          )}
        </Grid>
      </Grid>

      <CreateDialog />
      <JoinDialog />
    </Container>
  );
};

export default GroupBuys;
