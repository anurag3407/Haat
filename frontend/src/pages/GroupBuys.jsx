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

// --- THEME COLORS ---
const BLUE = '#2A6E9A';
const GREEN = '#34D399'; // Use Bidding page green
const shimmerGradient = 'linear-gradient(90deg, transparent, #34D399 40%, #2A6E9A 60%, transparent)';

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
        style={{ width: '100%' }}
      >
        <Card sx={{
          mb: 3,
          boxShadow: 3,
          borderRadius: 4,
          transition: 'box-shadow 0.2s',
          width: '100%',
          minHeight: 180,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'stretch',
          overflow: 'hidden',
          background: `linear-gradient(120deg, #E6FFF7 0%, ${BLUE} 100%)`,
        }}>
          {/* Left: Product & Organizer */}
          <Box sx={{ flex: 2, p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: BLUE, mb: 0.5 }}>
              {groupBuy.productName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Organized by {groupBuy.organizer}
            </Typography>
            <Chip label={groupBuy.category} size="small" sx={{ bgcolor: GREEN, color: '#fff', fontWeight: 600, mt: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <LocationOn fontSize="small" sx={{ verticalAlign: 'middle', color: BLUE, mr: 0.5 }} />
              {groupBuy.location} • {groupBuy.distance} km away
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {groupBuy.description}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mt={2}>
              <People fontSize="small" />
              <Typography variant="body2">
                {groupBuy.participants.length} participants
              </Typography>
              <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: 14 } }}>
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
          </Box>
          {/* Middle: Progress & Prices */}
          <Box sx={{ flex: 1.5, p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', bgcolor: 'rgba(52,211,153,0.10)', borderLeft: { md: `2px solid ${GREEN}` }, minWidth: 220 }}>
            <Box mb={1}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Progress: {groupBuy.currentQuantity}/{groupBuy.targetQuantity} kg
              </Typography>
              <Box sx={{ height: 10, borderRadius: 5, bgcolor: '#F3F4F6', overflow: 'hidden', position: 'relative', mt: 0.5 }}>
                <motion.div
                  variants={progressVariants}
                  initial="initial"
                  animate="animate"
                  custom={progress}
                  style={{ height: '100%', background: progress >= 100 ? '#2e7d32' : `linear-gradient(90deg, ${GREEN} 0%, ${BLUE} 100%)`, borderRadius: 5 }}
                />
              </Box>
            </Box>
            <Box display="flex" gap={2} alignItems="center" mb={1}>
              <Box>
                <Typography variant="body2" color="text.secondary">Current Price</Typography>
                <Typography variant="h6" sx={{ color: BLUE, fontWeight: 700 }}>
                  ₹{groupBuy.currentPrice}/kg
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Target Price</Typography>
                <Typography variant="h6" sx={{ color: GREEN, fontWeight: 700 }}>
                  ₹{groupBuy.targetPrice}/kg
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color='fuchsia' fontWeight="bold" mb={1}>
              Potential Savings: ₹{savings}/kg
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Chip label={groupBuy.status === 'completed' ? 'Completed' : 'Active'} color={groupBuy.status === 'completed' ? 'success' : 'primary'} size="small" />
              {groupBuy.status === 'active' && (
                <Typography variant="body2" color="error" sx={{ ml: 1 }}>
                  <Timer fontSize="small" sx={{ mr: 0.5 }} />
                  {timeLeft}
                </Typography>
              )}
            </Box>
          </Box>
          {/* Right: Actions */}
          <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minWidth: 180, bgcolor: 'rgba(52,211,153,0.18)', borderLeft: { md: `2px solid ${BLUE}` } }}>
            <Box display="flex" flexDirection="column" gap={2} width="100%">
              {groupBuy.status === 'active' && progress < 100 && (
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => {
                    setSelectedGroupBuy(groupBuy);
                    setJoinDialogOpen(true);
                  }}
                  sx={{ borderRadius: 3, fontWeight: 700, bgcolor: `linear-gradient(90deg, ${GREEN} 0%, ${BLUE} 100%)`, color: '#fff', boxShadow: 2 }}
                  component={motion.button}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Join Group Buy
                </Button>
              )}
              {groupBuy.status === 'completed' && (
                <Button variant="outlined" size="large" fullWidth sx={{ borderRadius: 3, fontWeight: 700, color: BLUE, borderColor: BLUE }} component={motion.button} whileHover={{ scale: 1.05 }}>
                  View Details
                </Button>
              )}
              <IconButton size="large" sx={{ bgcolor: '#F3F4F6', borderRadius: 2, boxShadow: 1, color: BLUE }} component={motion.button} whileHover={{ scale: 1.2 }}>
                <Share />
              </IconButton>
            </Box>
          </Box>
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
          <DialogTitle>Create New Group Buy</DialogTitle>H
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
          style={{ marginBottom: 24, width: '100%' }}
        >
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
            transition: 'box-shadow 0.2s',
            background: `linear-gradient(120deg, #E6FFF7 0%, ${BLUE} 100%)`,
          }}>
            <CardContent sx={{ width: '100%' }}>
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
                        background: shimmerGradient,
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
                        background: shimmerGradient,
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
                        background: shimmerGradient,
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
                        background: shimmerGradient,
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
                        background: shimmerGradient,
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
                      background: shimmerGradient,
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
                      background: shimmerGradient,
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
                    background: shimmerGradient,
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
                        background: shimmerGradient,
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
                        background: shimmerGradient,
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
                      background: shimmerGradient,
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
                        background: shimmerGradient,
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
                        background: shimmerGradient,
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
                        background: shimmerGradient,
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
                        background: shimmerGradient,
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
                        background: shimmerGradient,
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
                        background: shimmerGradient,
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
                          background: shimmerGradient,
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
                      background: shimmerGradient,
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
                      background: shimmerGradient,
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
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }}
      exit={{ opacity: 0, y: -32, transition: { duration: 0.4, ease: 'easeIn' } }}
      style={{ minHeight: '100vh', background: `linear-gradient(120deg, #E6FFF7 0%, ${GREEN} 100%)` }}
    >
      <Container maxWidth="lg" sx={{ pt: { xs: 2, md: 6 }, pb: 4 }}>
        {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={250} />}
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }}
          style={{ marginBottom: 40 }}
        >
          <Paper elevation={4} sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            background: `linear-gradient(135deg, ${BLUE} 0%, ${GREEN} 100%)`,
            color: '#fff',
            mb: 2,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <Box sx={{ position: 'absolute', right: 0, bottom: 0, opacity: 0.15, zIndex: 0 }}>
              <img src="https://cdn.pixabay.com/photo/2017/01/06/19/15/food-1957680_1280.png" alt="Street Food" style={{ width: 220, maxWidth: '40vw' }} />
            </Box>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, letterSpacing: 1 }}>
                Group Buys
              </Typography>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
                Join bulk purchases to get better prices, save more, and build your vendor community.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 400 }}>
                <strong>“Collaborate, buy together, and unlock exclusive deals for your business.”</strong>
              </Typography>
            </Box>
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              style={{ position: 'absolute', top: 24, right: 32, zIndex: 2 }}
            >
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setCreateDialogOpen(true)}
                sx={{ boxShadow: 3, borderRadius: 3, bgcolor: `linear-gradient(90deg, ${GREEN} 0%, ${BLUE} 100%)`, color: '#fff', fontWeight: 700 }}
                component={motion.button}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.97 }}
              >
                Create Group Buy
              </Button>
            </motion.div>
          </Paper>
        </motion.div>
        {/* Stats */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={6} md={3}>
            <Paper sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: 3,
              background: `linear-gradient(120deg, #E6FFF7 0%, ${BLUE} 100%)`,
              color: '#2A6E9A',
              boxShadow: 2,
              border: `1px solid ${GREEN}`,
            }} component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Typography variant="h4" sx={{ color: BLUE, fontWeight: 700 }}>
                <CountUp end={groupBuys.filter(gb => gb.status === 'active').length} duration={1.2} />
              </Typography>
              <Typography variant="body2" sx={{ color: BLUE, fontWeight: 500 }}>
                Active Group Buys
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: 3,
              background: `linear-gradient(120deg, #E6FFF7 0%, ${BLUE} 100%)`,
              color: '#2A6E9A',
              boxShadow: 2,
              border: `1px solid ${GREEN}`,
            }} component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <Typography variant="h4" sx={{ color: BLUE, fontWeight: 700 }}>
                <CountUp end={2340} duration={1.2} prefix="₹" />
              </Typography>
              <Typography variant="body2" sx={{ color: BLUE, fontWeight: 500 }}>
                Total Savings
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: 3,
              background: `linear-gradient(120deg, #E6FFF7 0%, ${BLUE} 100%)`,
              color: '#2A6E9A',
              boxShadow: 2,
              border: `1px solid ${GREEN}`,
            }} component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Typography variant="h4" sx={{ color: BLUE, fontWeight: 700 }}>
                <CountUp end={24} duration={1.2} />
              </Typography>
              <Typography variant="body2" sx={{ color: BLUE, fontWeight: 500 }}>
                Joined Groups
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: 3,
              background: `linear-gradient(120deg, #E6FFF7 0%, ${BLUE} 100%)`,
              color: '#2A6E9A',
              boxShadow: 2,
              border: `1px solid ${GREEN}`,
            }} component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <Typography variant="h4" sx={{ color: BLUE, fontWeight: 700 }}>
                <CountUp end={12} duration={1.2} />
              </Typography>
              <Typography variant="body2" sx={{ color: BLUE, fontWeight: 500 }}>
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
    </motion.div>
  );
};

export default GroupBuys;
