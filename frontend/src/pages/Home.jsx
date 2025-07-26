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
          style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #F7F9FB 0%, #10B981 100%)' }}
    >
      <Container maxWidth="lg" sx={{ pt: { xs: 2, md: 6 }, pb: 4 }}>
          <motion.div
            variants={fadeSlideUp}
            initial="initial"
            animate="animate"
            style={{ marginBottom: 40 }}
          >
            <Paper elevation={4} sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 4,
              background: 'linear-gradient(135deg, #2A6E9A 0%, #10B981 100%)',
              color: 'primary.contrastText',
              mb: 2,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <Box sx={{ position: 'absolute', right: 0, bottom: 0, opacity: 0.45, zIndex: 0 }}>
                <img src=".\public\Google_AI_Studio_2025-07-26T12_37_56.222Z.png" alt="Street Food" style={{ width: 300, borderRadius: "10px", height:400 }} />
              </Box>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  mb: 1,
                  letterSpacing: 1,
                  color: 'primary.contrastText',
                  textShadow: '0 2px 8px rgba(42,110,154,0.18)',
                }}
              >
                Welcome, {user?.name}!
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 500,
                  mb: 1,
                  color: 'primary.contrastText',
                  textShadow: '0 2px 8px rgba(42,110,154,0.18)',
                }}
              >
                Empowering Food Vendors
              </Typography>
                <Typography
            variant="h5"
            sx={{
              mb: 2,
              fontWeight: 700,
              color: 'primary.contrastText',
              textShadow: '0 1px 4px rgba(42,110,154,0.12)',
            }}
                >
            Say goodbye to middlemen. Get fresh supplies, fair prices, and direct access to <br /> trusted suppliers.
                </Typography>
                <Typography
            variant="body1"
            sx={{
              mb: 2,
              fontWeight: 500,
              color: 'primary.contrastText',
              textShadow: '0 1px 4px rgba(42,110,154,0.10)',
            }}
                >
            <strong>“Negotiating with middlemen is tough. We help you source raw materials directly, join group buys, <br /> and bid for the best deals.”</strong>
                </Typography>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Chip
              icon={<LocationOn />}
              label={address?.fullAddress || 'Location not set'}
              color="default"
              sx={{
                fontWeight: 500,
                fontSize: '1rem',
                px: 2,
                bgcolor: 'background.paper',
                color: 'text.primary',
              }}
            />
            {user?.role === 'vendor' && stats.trustScore && (
              <Chip
                icon={<Star sx={{ color: '#F59E0B' }} />}
                label={`Trust Score: ${stats.trustScore}`}
                color="warning"
                sx={{
                  fontWeight: 600,
                  fontSize: '1rem',
                  px: 2,
                  bgcolor: 'warning.light',
                  color: 'warning.contrastText',
                }}
              />
            )}
                </Box>
                <Button
            variant="contained"
            size="large"
            color="success"
            sx={{
              fontWeight: 700,
              fontSize: '1.1rem',
              px: 4,
              py: 1.5,
              boxShadow: 3,
              color: 'success.contrastText',
            }}
            onClick={() => navigate('/sourcing')}
                >
            Explore Sourcing Hub
                </Button>
              </Box>
            </Paper>
          </motion.div>

          {/* Feature Highlights */}
        <motion.div variants={containerStagger} initial="initial" animate="animate" style={{ marginBottom: 32 }}>
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={3}>
              <StatCard
                title="Nearby Vendors"
                value={stats.nearbyVendors}
                icon={<Store fontSize="large" />}
                color="#2A6E9A"
                variants={fadeSlideRight}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard
                title="Active Group Buys"
                value={stats.activeGroupBuys}
                icon={<ShoppingCart fontSize="large" />}
                color="#10B981"
                variants={fadeSlideUp}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard
                title="Live Bids"
                value={stats.liveBids}
                icon={<Gavel fontSize="large" />}
                color="#10B981"
                variants={fadeSlideUp}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard
                title="Growth"
                value="+12%"
                icon={<TrendingUp fontSize="large" />}
                color="#EF4444"
                variants={fadeSlideLeft}
              />
            </Grid>
          </Grid>
        </motion.div>

        {/* Quick Actions with themed icons */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2A6E9A', mb: 2 }}>
          What do you want to do today?
        </Typography>
        <motion.div variants={containerStagger} initial="initial" animate="animate" style={{ marginBottom: 32 }}>
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <QuickActionCard
                icon={<img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" alt="Supplier" style={{ width: 40, height: 40 }} />}
                title="Sourcing Hub"
                subtitle="Find suppliers & products"
                color="#2A6E9A"
                onClick={() => navigate('/sourcing')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <QuickActionCard
                icon={<img src="https://cdn-icons-png.flaticon.com/512/3075/3075972.png" alt="Group Buy" style={{ width: 40, height: 40 }} />}
                title="Group Buys"
                subtitle="Join bulk purchases"
                color="#10B981"
                onClick={() => navigate('/groupbuys')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <QuickActionCard
                icon={<img src="https://cdn-icons-png.flaticon.com/512/3075/3075974.png" alt="Bidding" style={{ width: 40, height: 40 }} />}
                title="Bidding"
                subtitle="Participate in auctions"
                color="#10B981"
                onClick={() => navigate('/bidding')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <QuickActionCard
                icon={<img src="https://cdn-icons-png.flaticon.com/512/3075/3075976.png" alt="Profile" style={{ width: 40, height: 40 }} />}
                title="Profile"
                subtitle="View your details"
                color="#2A6E9A"
                onClick={() => navigate('/profile')}
              />
            </Grid>
          </Grid>
        </motion.div>

        {/* Vendor Story/Testimonial Section */}
        <motion.div variants={fadeSlideUp} initial="initial" animate="animate" style={{ marginBottom: 32 }}>
          <Paper elevation={2} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: 'linear-gradient(90deg, #10B981 0%, #F7F9FB 100%)', mb: 2 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <img src="https://cdn-icons-png.flaticon.com/512/3075/3075975.png" alt="Vendor" style={{ width: 56, height: 56 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2A6E9A' }}>
                  "I used to struggle with high prices and unreliable supplies. Now, I get fresh produce directly from trusted suppliers and save more!"
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  — Ramesh, Street Food Vendor, Delhi
                </Typography>
              </Box>
            </Box>
          </Paper>
        </motion.div>

        {/* Recent Activity */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2A6E9A', mb: 2 }}>
          Recent Activity
        </Typography>
        <motion.div variants={containerStagger} initial="initial" animate="animate">
          <Grid container spacing={2}>
            {recentActivity.map((activity) => (
              <Grid item xs={12} key={activity.id}>
                <motion.div variants={fadeSlideUp}>
                  <Card sx={{ borderRadius: 3, boxShadow: 3, background: '#fff' }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box flex={1}>
                          <Typography variant="h6" gutterBottom sx={{ color: '#2A6E9A', fontWeight: 700 }}>
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
                            sx={{ mb: 1, fontWeight: 600, fontSize: '1rem' }}
                          />
                          {activity.type === 'groupbuy' && (
                            <Box>
                              <Typography variant="body2" color="text.secondary" mb={1}>
                                {activity.participants}/{activity.target} participants
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={activity.progress}
                                sx={{ height: 8, borderRadius: 4, background: '#10B981' }}
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
                          variant="contained"
                          color="primary"
                          sx={{ fontWeight: 600, borderRadius: 2 }}
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
