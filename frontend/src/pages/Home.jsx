import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  LinearProgress,
  IconButton,
  Paper,
} from '@mui/material';
import {
  TrendingUp,
  Store,
  ShoppingCart,
  Gavel,
  Star,
  LocationOn,
  Group,
  Timer,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { address } = useLocation();
  const [stats, setStats] = useState({
    nearbyVendors: 0,
    activeGroupBuys: 0,
    liveBids: 0,
    trustScore: 0,
  });
  
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Simulate loading stats and recent activity
    setTimeout(() => {
      setStats({
        nearbyVendors: 24,
        activeGroupBuys: 8,
        liveBids: 12,
        trustScore: user?.role === 'vendor' ? 87 : null,
      });
      
      setRecentActivity([
        {
          id: 1,
          type: 'groupbuy',
          title: 'Onions Group Buy',
          status: 'Active',
          progress: 75,
          participants: 12,
          target: 16,
        },
        {
          id: 2,
          type: 'bid',
          title: 'Flash Sale: Tomatoes',
          status: 'Live',
          timeLeft: '2h 45m',
          currentBid: '₹25/kg',
        },
        {
          id: 3,
          type: 'order',
          title: 'Order #1234',
          status: 'Delivered',
          amount: '₹1,250',
        },
      ]);
    }, 1000);
  }, [user]);

  // Animation variants
  const containerStagger = {
    animate: {
      transition: {
        staggerChildren: 0.12,
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

  const QuickActionCard = ({ icon, title, subtitle, color, onClick }) => (
    <motion.div
      variants={fadeSlideUp}
      whileHover={{ scale: 1.06, boxShadow: '0 8px 24px rgba(42,110,154,0.10)' }}
      whileTap={{ scale: 0.97 }}
      style={{ height: '100%' }}
    >
      <Card sx={{ cursor: 'pointer', height: '100%' }} onClick={onClick}>
        <CardContent sx={{ textAlign: 'center', p: 3 }}>
          <Box sx={{ color, mb: 2 }}>{icon}</Box>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );

  const StatCard = ({ title, value, icon, color, variants }) => (
    <motion.div variants={variants || fadeSlideUp}>
      <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ color, fontSize: 40 }}>{icon}</Box>
        <Box>
          <Typography variant="h4" color={color}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }}
      exit={{ opacity: 0, y: -32, transition: { duration: 0.4, ease: 'easeIn' } }}
      style={{ minHeight: '100vh' }}
    >
      <Container maxWidth="lg">
        {/* Welcome Header */}
        <motion.div
          variants={fadeSlideUp}
          initial="initial"
          animate="animate"
          style={{ marginBottom: 32 }}
        >
          <Box 
            sx={{ 
              mb: 4,
              textAlign: 'center',
            }}
          >
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2A6E9A 0%, #D97757 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Welcome, {user?.name}!
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              {user?.role === 'vendor' ? 'Manage your stall and connect with suppliers' : 'Discover local vendors and group opportunities'}
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={2}>
              <LocationOn sx={{ color: 'text.secondary' }} />
              <Typography variant="body1" color="text.secondary">
                {address?.fullAddress || 'Location not set'}
              </Typography>
            </Box>
            {user?.role === 'vendor' && stats.trustScore && (
              <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                <Star sx={{ color: '#F59E0B' }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Trust Score: <strong>{stats.trustScore}</strong>
                </Typography>
              </Box>
            )}
          </Box>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerStagger}
          initial="initial"
          animate="animate"
          style={{ marginBottom: 24 }}
        >
          <Grid container spacing={2} mb={3}>
            <Grid item xs={6} md={3}>
              <StatCard
                title="Nearby Vendors"
                value={stats.nearbyVendors}
                icon={<Store />}
                color="primary.main"
                variants={fadeSlideRight}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard
                title="Active Group Buys"
                value={stats.activeGroupBuys}
                icon={<ShoppingCart />}
                color="success.main"
                variants={fadeSlideUp}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard
                title="Live Bids"
                value={stats.liveBids}
                icon={<Gavel />}
                color="warning.main"
                variants={fadeSlideUp}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard
                title="Growth"
                value="+12%"
                icon={<TrendingUp />}
                color="error.main"
                variants={fadeSlideLeft}
              />
            </Grid>
          </Grid>
        </motion.div>

        {/* Quick Actions */}
        <Typography variant="h5" gutterBottom>
          Quick Actions
        </Typography>
        <motion.div
          variants={containerStagger}
          initial="initial"
          animate="animate"
          style={{ marginBottom: 24 }}
        >
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <QuickActionCard
                icon={<Store fontSize="large" />}
                title="Sourcing Hub"
                subtitle="Find suppliers & products"
                color="primary.main"
                onClick={() => navigate('/sourcing')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <QuickActionCard
                icon={<ShoppingCart fontSize="large" />}
                title="Group Buys"
                subtitle="Join bulk purchases"
                color="success.main"
                onClick={() => navigate('/groupbuys')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <QuickActionCard
                icon={<Gavel fontSize="large" />}
                title="Bidding"
                subtitle="Participate in auctions"
                color="warning.main"
                onClick={() => navigate('/bidding')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <QuickActionCard
                icon={<Group fontSize="large" />}
                title="Network"
                subtitle="Connect with vendors"
                color="info.main"
                onClick={() => navigate('/profile')}
              />
            </Grid>
          </Grid>
        </motion.div>

        {/* Recent Activity */}
        <Typography variant="h5" gutterBottom>
          Recent Activity
        </Typography>
        <motion.div
          variants={containerStagger}
          initial="initial"
          animate="animate"
        >
          <Grid container spacing={2}>
            {recentActivity.map((activity) => (
              <Grid item xs={12} key={activity.id}>
                <motion.div variants={fadeSlideUp}>
                  <Card>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box flex={1}>
                          <Typography variant="h6" gutterBottom>
                            {activity.title}
                          </Typography>
                          <Chip
                            label={activity.status}
                            size="small"
                            color={
                              activity.status === 'Active' || activity.status === 'Live'
                                ? 'success'
                                : activity.status === 'Delivered'
                                ? 'primary'
                                : 'default'
                            }
                            sx={{ mb: 1 }}
                          />
                          {activity.type === 'groupbuy' && (
                            <Box>
                              <Typography variant="body2" color="text.secondary" mb={1}>
                                {activity.participants}/{activity.target} participants
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={activity.progress}
                                sx={{ height: 8, borderRadius: 4 }}
                              />
                            </Box>
                          )}
                          {activity.type === 'bid' && (
                            <Box display="flex" alignItems="center" gap={2}>
                              <Typography variant="body2" color="text.secondary">
                                <Timer fontSize="small" sx={{ mr: 0.5 }} />
                                {activity.timeLeft}
                              </Typography>
                              <Typography variant="body2" color="success.main">
                                Current: {activity.currentBid}
                              </Typography>
                            </Box>
                          )}
                          {activity.type === 'order' && (
                            <Typography variant="body2" color="text.secondary">
                              Amount: {activity.amount}
                            </Typography>
                          )}
                        </Box>
                        <Button
                          size="small"
                          onClick={() => {
                            if (activity.type === 'groupbuy') navigate('/groupbuys');
                            else if (activity.type === 'bid') navigate('/bidding');
                            else navigate('/orders');
                          }}
                        >
                          View
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default Home;
