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
  InputAdornment
} from '@mui/material';
import CountUp from 'react-countup';
import Confetti from 'react-confetti';
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
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const GroupBuys = () => {
  const [showConfetti, setShowConfetti] = useState(false);
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
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
    loadGroupBuys();
  };

  const handleJoinGroupBuy = async (quantity) => {
    // Simulate API call
    console.log('Joining group buy:', selectedGroupBuy.id, 'with quantity:', quantity);
    setJoinDialogOpen(false);
    setSelectedGroupBuy(null);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
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

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 18 } },
    hover: { scale: 1.03, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', transition: { duration: 0.2 } }
  };

  const avatarVariants = {
    hidden: { opacity: 0, scale: 0.7 },
    visible: (i) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.1 } })
  };

  const progressVariants = {
    initial: { width: 0 },
    animate: (progress) => ({ width: `${Math.min(progress, 100)}%`, transition: { duration: 1.2, ease: 'easeOut' } })
  };

  const GroupBuyCard = ({ groupBuy, index }) => {
    const progress = (groupBuy.currentQuantity / groupBuy.targetQuantity) * 100;
    const savings = groupBuy.currentPrice - groupBuy.targetPrice;
    const timeLeft = getTimeRemaining(groupBuy.deadline);

    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        transition={{ delay: index * 0.12 }}
      >
        <Card sx={{ mb: 2, cursor: 'pointer', boxShadow: 2, borderRadius: 3, transition: 'box-shadow 0.2s' }}>
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
              <Box sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.200', overflow: 'hidden', position: 'relative' }}>
                <motion.div
                  variants={progressVariants}
                  initial="initial"
                  animate="animate"
                  custom={progress}
                  style={{ height: '100%', background: progress >= 100 ? '#2e7d32' : '#1976d2', borderRadius: 4 }}
                />
              </Box>
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
                {groupBuy.participants.map((participant, i) => (
                  <motion.div
                    key={participant.id}
                    variants={avatarVariants}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    style={{ display: 'inline-block' }}
                  >
                    <Avatar>
                      {participant.name.charAt(0)}
                    </Avatar>
                  </motion.div>
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
                  component={motion.button}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Join Group Buy
                </Button>
              )}
              {groupBuy.status === 'completed' && (
                <Button variant="outlined" size="small" fullWidth component={motion.button} whileHover={{ scale: 1.05 }}>
                  View Details
                </Button>
              )}
              <IconButton size="small" component={motion.button} whileHover={{ scale: 1.2 }}>
                <Share />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const JoinDialog = () => {
    const [quantity, setQuantity] = useState('');
    
    return (
      <AnimatePresence>
        {joinDialogOpen && (
          <Dialog
            open={joinDialogOpen}
            onClose={() => setJoinDialogOpen(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              component: motion.div,
              initial: { opacity: 0, scale: 0.8 },
              animate: { opacity: 1, scale: 1 },
              exit: { opacity: 0, scale: 0.8 },
              transition: { duration: 0.3 }
            }}
          >
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
              <Button onClick={() => setJoinDialogOpen(false)} component={motion.button} whileTap={{ scale: 0.95 }}>Cancel</Button>
              <Button
                onClick={() => handleJoinGroupBuy(quantity)}
                variant="contained"
                disabled={!quantity || quantity <= 0}
                component={motion.button}
                whileTap={{ scale: 0.95 }}
              >
                Join
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </AnimatePresence>
    );
  };

  const handleFieldChange = React.useCallback((field) => (e) => {
    setNewGroupBuy((prev) => ({ ...prev, [field]: e.target.value }));
  }, []);

  const MemoCreateDialog = React.useMemo(() => (
    <AnimatePresence>
      {createDialogOpen && (
        <Dialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            component: motion.div,
            initial: { opacity: 0, scale: 0.8 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.8 },
            transition: { duration: 0.3 }
          }}
        >
          <DialogTitle>Create New Group Buy</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Product Name"
                  value={newGroupBuy.productName}
                  onChange={handleFieldChange('productName')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newGroupBuy.category}
                    onChange={handleFieldChange('category')}
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
                  onChange={handleFieldChange('targetQuantity')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Current Price (₹/kg)"
                  type="number"
                  value={newGroupBuy.currentPrice}
                  onChange={handleFieldChange('currentPrice')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Target Price (₹/kg)"
                  type="number"
                  value={newGroupBuy.targetPrice}
                  onChange={handleFieldChange('targetPrice')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Deadline"
                  type="datetime-local"
                  value={newGroupBuy.deadline}
                  onChange={handleFieldChange('deadline')}
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
                  onChange={handleFieldChange('description')}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)} component={motion.button} whileTap={{ scale: 0.95 }}>Cancel</Button>
            <Button onClick={handleCreateGroupBuy} variant="contained" component={motion.button} whileTap={{ scale: 0.95 }}>
              Create Group Buy
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  ), [createDialogOpen, newGroupBuy, categories, handleFieldChange]);

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

              {/* Progress skeleton */}
              <Box mb={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box
                    sx={{
                      height: 16,
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
                <Box
                  sx={{
                    height: 8,
                    width: '100%',
                    bgcolor: 'grey.200',
                    borderRadius: 4,
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

              {/* Price Grid skeleton */}
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
                      height: 24,
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
              </Grid>

              {/* Participants skeleton */}
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
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
                <Box display="flex" gap={0.5}>
                  {[...Array(4)].map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: 'grey.200',
                        borderRadius: '50%',
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

              {/* Action buttons skeleton */}
              <Box display="flex" gap={1}>
                <Box
                  sx={{
                    height: 36,
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
                    height: 36,
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
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={250} />}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom component={motion.h4} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            Group Buys
          </Typography>
          <Typography variant="body1" color="text.secondary" component={motion.p} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            Join bulk purchases to get better prices
          </Typography>
        </Box>
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ boxShadow: 3 }}
            component={motion.button}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.97 }}
          >
            Create Group Buy
          </Button>
        </motion.div>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }} component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Typography variant="h4" color="primary">
              <CountUp end={groupBuys.filter(gb => gb.status === 'active').length} duration={1.2} />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Group Buys
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }} component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <Typography variant="h4" color="success.main">
              <CountUp end={2340} duration={1.2} prefix="₹" />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Savings
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }} component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <Typography variant="h4" color="warning.main">
              <CountUp end={24} duration={1.2} />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Joined Groups
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }} component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <Typography variant="h4" color="info.main">
              <CountUp end={12} duration={1.2} />
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
            <LoadingSkeleton />
          ) : (
            <AnimatePresence>
              {groupBuys.map((groupBuy, idx) => (
                <GroupBuyCard key={groupBuy.id} groupBuy={groupBuy} index={idx} />
              ))}
            </AnimatePresence>
          )}
        </Grid>
      </Grid>

      {MemoCreateDialog}
      <JoinDialog />
    </Container>
  );
};

export default GroupBuys;
