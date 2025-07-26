import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  Chip,
  TextField,
  Paper,
  Divider,
  Rating,
  IconButton,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Edit,
  LocationOn,
  Phone,
  Business,
  Star,
  TrendingUp,
  Group,
  ShoppingCart,
  Notifications,
  Security,
  Language,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';

const Profile = () => {
  const { user } = useAuth();
  const { address } = useLocation();
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    businessName: '',
    phone: '',
    email: '',
    address: '',
    bio: '',
  });
  
  const [stats, setStats] = useState({
    trustScore: 0,
    totalOrders: 0,
    completedDeals: 0,
    savings: 0,
    rating: 0,
    reviews: 0,
  });

  const [settings, setSettings] = useState({
    notifications: true,
    locationSharing: true,
    autoAcceptOrders: false,
  });

  useEffect(() => {
    // Load user profile data
    if (user) {
      setProfileData({
        name: user.name || '',
        businessName: user.businessName || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address || '',
        bio: user.bio || '',
      });
    }

    // Load user stats
    setTimeout(() => {
      setStats({
        trustScore: user?.role === 'vendor' ? 87 : null,
        totalOrders: 24,
        completedDeals: 18,
        savings: 3250,
        rating: 4.5,
        reviews: 12,
      });
    }, 500);
  }, [user]);

  const handleSaveProfile = () => {
    // Simulate API call to save profile
    console.log('Saving profile:', profileData);
    setEditMode(false);
  };

  const StatCard = ({ icon, title, value, color }) => (
    <Paper sx={{ p: 2, textAlign: 'center' }}>
      <Box sx={{ color, fontSize: 40, mb: 1 }}>{icon}</Box>
      <Typography variant="h5" color={color} fontWeight="bold">
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Info */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.main',
                  fontSize: 32,
                  mx: 'auto',
                  mb: 2,
                }}
              >
                {profileData.name.charAt(0)}
              </Avatar>
              
              {!editMode ? (
                <>
                  <Typography variant="h5" gutterBottom>
                    {profileData.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {profileData.businessName}
                  </Typography>
                  <Chip
                    label={user?.role?.toUpperCase()}
                    color="primary"
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  
                  {stats.trustScore && (
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
                      <Star color="warning" />
                      <Typography variant="body1">
                        Trust Score: <strong>{stats.trustScore}</strong>
                      </Typography>
                    </Box>
                  )}
                  
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={2}>
                    <Rating value={stats.rating} size="small" readOnly />
                    <Typography variant="body2" color="text.secondary">
                      ({stats.reviews} reviews)
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Phone fontSize="small" />
                    <Typography variant="body2">{profileData.phone}</Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <LocationOn fontSize="small" />
                    <Typography variant="body2" sx={{ textAlign: 'left' }}>
                      {address?.fullAddress || 'Location not set'}
                    </Typography>
                  </Box>
                  
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => setEditMode(true)}
                    fullWidth
                  >
                    Edit Profile
                  </Button>
                </>
              ) : (
                <Box sx={{ textAlign: 'left' }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Business Name"
                    value={profileData.businessName}
                    onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Bio"
                    multiline
                    rows={3}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      onClick={handleSaveProfile}
                      size="small"
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setEditMode(false)}
                      size="small"
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Stats and Settings */}
        <Grid item xs={12} md={8}>
          {/* Stats */}
          <Typography variant="h6" gutterBottom>
            Your Stats
          </Typography>
          <Grid container spacing={2} mb={3}>
            <Grid item xs={6} md={3}>
              <StatCard
                icon={<ShoppingCart />}
                title="Total Orders"
                value={stats.totalOrders}
                color="primary.main"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard
                icon={<Group />}
                title="Completed Deals"
                value={stats.completedDeals}
                color="success.main"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard
                icon={<TrendingUp />}
                title="Total Savings"
                value={`₹${stats.savings}`}
                color="info.main"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard
                icon={<Star />}
                title="Rating"
                value={stats.rating}
                color="warning.main"
              />
            </Grid>
          </Grid>

          {/* Settings */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Settings
              </Typography>
              
              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Notifications fontSize="small" />
                  Notifications
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications}
                      onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                    />
                  }
                  label="Enable push notifications"
                />
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn fontSize="small" />
                  Location
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.locationSharing}
                      onChange={(e) => setSettings({ ...settings, locationSharing: e.target.checked })}
                    />
                  }
                  label="Share location with nearby vendors"
                />
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Business fontSize="small" />
                  Business
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoAcceptOrders}
                      onChange={(e) => setSettings({ ...settings, autoAcceptOrders: e.target.checked })}
                    />
                  }
                  label="Auto-accept orders from trusted suppliers"
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" gap={1}>
                <Button variant="outlined" size="small">
                  Privacy Policy
                </Button>
                <Button variant="outlined" size="small">
                  Terms of Service
                </Button>
                <Button variant="outlined" size="small">
                  Help & Support
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
