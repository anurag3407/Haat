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
            businessName: 'Pure Milk Products',
            rating: 4.2,
            reviews: 200,
            distance: 3.1,
            categories: ['Dairy Products'],
            phone: '9988776655',
            address: 'Ghazipur Dairy, Delhi',
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
            name: 'Fresh Onions',
            supplier: 'Ramesh Vegetables',
            category: 'Vegetables',
            price: '₹25/kg',
            wholesalePrice: '₹22/kg',
            minQuantity: '50kg',
            available: true,
            quality: 'Premium',
            distance: 2.3,
            rating: 4.5,
            image: null,
          },
          {
            id: 2,
            name: 'Basmati Rice',
            supplier: 'Kumar Spices',
            category: 'Grains & Pulses',
            price: '₹80/kg',
            wholesalePrice: '₹75/kg',
            minQuantity: '25kg',
            available: true,
            quality: 'Premium',
            distance: 1.8,
            rating: 4.8,
            image: null,
          },
          {
            id: 3,
            name: 'Fresh Milk',
            supplier: 'Delhi Dairy',
            category: 'Dairy Products',
            price: '₹50/L',
            wholesalePrice: '₹45/L',
            minQuantity: '20L',
            available: true,
            quality: 'Standard',
            distance: 3.1,
            rating: 4.2,
            image: null,
          },
        ]);
      }
      setLoading(false);
    }, 1000);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadData();
  };

  const SupplierCard = ({ supplier }) => (
    <Card sx={{ mb: 2, '&:hover': { elevation: 4 } }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" gap={2}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
              {supplier.name.charAt(0)}
            </Avatar>
            <Box>
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
          </Box>
          <Chip
            label={`Trust Score: ${supplier.trustScore}`}
            color="success"
            size="small"
          />
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <LocationOn fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {supplier.address} • {supplier.distance} km away
          </Typography>
        </Box>

        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          {supplier.categories.map((cat) => (
            <Chip key={cat} label={cat} size="small" variant="outlined" />
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
          <Button variant="contained" size="small" fullWidth>
            View Products
          </Button>
          <IconButton color="success" href={`tel:${supplier.phone}`}>
            <Phone />
          </IconButton>
          <IconButton color="success" href={`https://wa.me/91${supplier.phone}`}>
            <WhatsApp />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );

  const ProductCard = ({ product }) => (
    <Card sx={{ mb: 2, '&:hover': { elevation: 4 } }}>
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
          <Button variant="contained" size="small" fullWidth>
            Add to Cart
          </Button>
          <Button variant="outlined" size="small">
            Quick Order
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        Sourcing Hub
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Find suppliers and products near {address?.area || 'your location'}
      </Typography>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Box display="flex">
          <Button
            variant={activeTab === 'suppliers' ? 'contained' : 'text'}
            onClick={() => setActiveTab('suppliers')}
            startIcon={<Store />}
            sx={{ flex: 1, borderRadius: 0 }}
          >
            Suppliers
          </Button>
          <Button
            variant={activeTab === 'products' ? 'contained' : 'text'}
            onClick={() => setActiveTab('products')}
            startIcon={<Inventory />}
            sx={{ flex: 1, borderRadius: 0 }}
          >
            Products
          </Button>
        </Box>
      </Paper>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleSearch}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
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
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                type="submit"
                variant="outlined"
                fullWidth
                startIcon={<FilterList />}
              >
                Filter
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Results */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            {activeTab === 'suppliers' ? 'Nearby Suppliers' : 'Available Products'}
          </Typography>
          
          {loading ? (
            <Box textAlign="center" py={4}>
              <Typography>Loading...</Typography>
            </Box>
          ) : (
            <>
              {activeTab === 'suppliers' &&
                suppliers.map((supplier) => (
                  <SupplierCard key={supplier.id} supplier={supplier} />
                ))}
              
              {activeTab === 'products' &&
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default SourcingHub;
