import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Chip,
  Avatar,
  Rating,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Search,
  FilterList,
  LocationOn,
  Store,
  Star,
  Phone,
  WhatsApp,
  Inventory,
  LocalShipping,
  Category,
} from '@mui/icons-material';
import { useLocation } from '../contexts/LocationContext';
import { motion, AnimatePresence } from 'framer-motion';

const SourcingHub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('suppliers'); // 'suppliers' or 'products'
  
  const { address, distanceFrom } = useLocation();

  const categories = [
    'Vegetables',
    'Fruits',
    'Grains & Pulses',
    'Dairy Products',
    'Spices',
    'Snacks',
    'Beverages',
    'Others'
  ];

  useEffect(() => {
    loadData();
  }, [activeTab, selectedCategory, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    
    // Simulate API calls
    setTimeout(() => {
      if (activeTab === 'suppliers') {
        setSuppliers([
          {
            id: 1,
            name: 'Ramesh Vegetables',
            businessName: 'Fresh Produce Co.',
            rating: 4.5,
            reviews: 120,
            distance: 2.3,
            categories: ['Vegetables', 'Fruits'],
            phone: '9876543210',
            address: 'Azadpur Mandi, Delhi',
            trustScore: 92,
            deliveryTime: '2-3 hours',
            minimumOrder: '₹500',
            image: null,
          },
          {
            id: 2,
            name: 'Kumar Spices',
            businessName: 'Spice World',
            rating: 4.8,
            reviews: 85,
            distance: 1.8,
            categories: ['Spices', 'Grains & Pulses'],
            phone: '9123456789',
            address: 'Khari Baoli, Delhi',
            trustScore: 95,
            deliveryTime: '4-5 hours',
            minimumOrder: '₹300',
            image: null,
          },
          {
            id: 3,
            name: 'Delhi Dairy',
            businessName: 'Fresh Milk Co.',
            rating: 4.2,
            reviews: 65,
            distance: 3.1,
            categories: ['Dairy Products'],
            phone: '9876543211',
            address: 'Najafgarh, Delhi',
            trustScore: 88,
            deliveryTime: '1-2 hours',
            minimumOrder: '₹200',
            image: null,
          },
        ]);
      } else {
        setProducts([
          {
            id: 1,
            name: 'Fresh Tomatoes',
            supplier: 'Ramesh Vegetables',
            rating: 4.5,
            quality: 'Grade A',
            price: '₹40/kg',
            wholesalePrice: '₹32/kg',
            distance: 2.3,
            minQuantity: '10kg',
            category: 'Vegetables',
          },
          {
            id: 2,
            name: 'Premium Basmati Rice',
            supplier: 'Kumar Spices',
            rating: 4.8,
            quality: 'Premium',
            price: '₹120/kg',
            wholesalePrice: '₹95/kg',
            distance: 1.8,
            minQuantity: '25kg',
            category: 'Grains & Pulses',
          },
          {
            id: 3,
            name: 'Fresh Milk',
            supplier: 'Delhi Dairy',
            rating: 4.2,
            quality: 'Pure',
            price: '₹60/L',
            wholesalePrice: '₹48/L',
            distance: 3.1,
            minQuantity: '20L',
            category: 'Dairy Products',
          },
        ]);
      }
      setLoading(false);
    }, 1000);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Animation variants
  const containerStagger = {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const fadeSlideUp = {
    initial: { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const fadeSlideRight = {
    initial: { opacity: 0, x: -32 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const fadeSlideLeft = {
    initial: { opacity: 0, x: 32 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
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
      variants={containerStagger}
      initial="initial"
      animate="animate"
    >
      {[...Array(3)].map((_, index) => (
        <motion.div
          key={index}
          variants={fadeSlideUp}
          style={{ marginBottom: 16 }}
        >
          <Card sx={{ 
            '&:hover': { elevation: 4 },
            position: 'relative',
            overflow: 'hidden'
          }}>
            <CardContent>
              {/* Header skeleton */}
              <Box display="flex" alignItems="flex-start" mb={2}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: 'grey.200',
                    mr: 2,
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
                <Box flex={1}>
                  <Box
                    sx={{
                      height: 24,
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
                  <Box display="flex" gap={1}>
                    {[...Array(5)].map((_, i) => (
                      <Box
                        key={i}
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
                    ))}
                  </Box>
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

              {/* Address skeleton */}
              <Box
                sx={{
                  height: 16,
                  width: '70%',
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

              {/* Categories skeleton */}
              <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                {[...Array(3)].map((_, i) => (
                  <Box
                    key={i}
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
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Grid skeleton */}
              <Grid container spacing={2} mb={2}>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      height: 16,
                      width: '60%',
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
                <Grid item xs={6}>
                  <Box
                    sx={{
                      height: 16,
                      width: '60%',
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

              {/* Buttons skeleton */}
              <Box display="flex" gap={1} mt={2}>
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
                    width: 40,
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
                <Box
                  sx={{
                    width: 40,
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
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );

  const SupplierCard = ({ supplier }) => (
    <motion.div
      variants={fadeSlideUp}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      style={{ marginBottom: 16 }}
    >
      <Card sx={{ '&:hover': { elevation: 4 } }}>
        <CardContent>
          <Box display="flex" alignItems="flex-start" mb={2}>
            <Avatar 
              sx={{ 
                width: 60, 
                height: 60, 
                bgcolor: 'primary.main',
                mr: 2,
                fontSize: '1.5rem',
                fontWeight: 600,
              }}
            >
              {supplier.name.charAt(0)}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h6">{supplier.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {supplier.businessName}
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <Rating value={supplier.rating} size="small" readOnly />
                <Typography variant="body2" color="text.secondary">
                  ({supplier.reviews})
                </Typography>
              </Box>
            </Box>
            <Chip 
              label={`Trust Score: ${supplier.trustScore}`} 
              size="small" 
              color="primary" 
              variant="outlined"
              sx={{ ml: 1 }}
            />
          </Box>

          <Typography variant="body2" color="text.secondary">
            {supplier.address} • {supplier.distance} km away
          </Typography>

        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          {supplier.categories.map((cat) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.random() * 0.3 }}
            >
              <Chip label={cat} size="small" variant="outlined" />
            </motion.div>
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Delivery Time
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {supplier.deliveryTime}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Min Order
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {supplier.minimumOrder}
            </Typography>
          </Grid>
        </Grid>

        <Box display="flex" gap={1} mt={2}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ flex: '0 1 160px', maxWidth: 160 }}
          >
            <Button variant="contained" size="small" fullWidth sx={{ minWidth: 120, maxWidth: 160 }}>
              View Products
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton color="success" href={`tel:${supplier.phone}`} sx={{ minWidth: 44, width: 44, height: 40 }}>
              <Phone />
            </IconButton>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton color="success" href={`https://wa.me/91${supplier.phone}`} sx={{ minWidth: 44, width: 44, height: 40 }}>
              <WhatsApp />
            </IconButton>
          </motion.div>
        </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const ProductCard = ({ product }) => (
    <motion.div
      variants={fadeSlideUp}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      style={{ marginBottom: 16 }}
    >
      <Card sx={{ '&:hover': { elevation: 4 } }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="h6">{product.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                by {product.supplier}
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <Rating value={product.rating} size="small" readOnly />
                <Chip label={product.quality} size="small" color="primary" variant="outlined" />
              </Box>
            </Box>
            <Box textAlign="right">
              <Typography variant="h6" color="primary">
                {product.wholesalePrice}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                {product.price}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <LocationOn fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {product.distance} km away
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" mb={2}>
            Min Quantity: {product.minQuantity}
          </Typography>

          <Box display="flex" gap={1}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ flex: '0 1 140px', maxWidth: 140 }}
            >
              <Button variant="contained" size="small" fullWidth sx={{ minWidth: 100, maxWidth: 140 }}>
                Add to Cart
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ minWidth: 100 }}
            >
              <Button variant="outlined" size="small" sx={{ minWidth: 100 }}>
                Quick Order
              </Button>
            </motion.div>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }}
      exit={{ opacity: 0, y: -32, transition: { duration: 0.4, ease: 'easeIn' } }}
    >
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        {/* Header */}
        <motion.div
          variants={fadeSlideUp}
          initial="initial"
          animate="animate"
        >
          <Typography variant="h4" gutterBottom>
            Sourcing Hub
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Find suppliers and products near {address?.area || 'your location'}
          </Typography>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          variants={containerStagger}
          initial="initial"
          animate="animate"
        >
          <Box display="flex" gap={2} mb={3} flexWrap="wrap">
            <motion.div variants={fadeSlideRight} style={{ flex: 1, minWidth: 200 }}>
              <TextField
                fullWidth
                placeholder="Search suppliers or products..."
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{ mb: 2 }}
              />
            </motion.div>
            
            <motion.div variants={fadeSlideLeft}>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </motion.div>
          </Box>
        </motion.div>

        {/* Tabs */}
        <motion.div
          variants={fadeSlideUp}
          initial="initial"
          animate="animate"
        >
          <Box display="flex" gap={1} mb={3}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={activeTab === 'suppliers' ? 'contained' : 'text'}
                onClick={() => setActiveTab('suppliers')}
                startIcon={<Store />}
              >
                Suppliers
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={activeTab === 'products' ? 'contained' : 'text'}
                onClick={() => setActiveTab('products')}
                startIcon={<Inventory />}
              >
                Products
              </Button>
            </motion.div>
          </Box>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { duration: 0.4 } }}
          exit={{ opacity: 0, x: -20, transition: { duration: 0.3 } }}
        >
          <Typography variant="h6" gutterBottom>
            {activeTab === 'suppliers' ? 'Nearby Suppliers' : 'Available Products'}
          </Typography>
          
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <motion.div
              variants={containerStagger}
              initial="initial"
              animate="animate"
            >
              {activeTab === 'suppliers' &&
                suppliers.map((supplier) => (
                  <SupplierCard key={supplier.id} supplier={supplier} />
                ))}
              
              {activeTab === 'products' &&
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </motion.div>
          )}
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default SourcingHub;
