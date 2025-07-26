import React, { useState, useEffect, useRef } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { useLocation } from '../contexts/LocationContext';
import { motion, useInView, animate } from 'framer-motion';

// --- Animation Variants ---

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.6 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const sectionVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
};

const avatarVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 15, delay: 0.2 } },
  whileHover: { scale: 1.1, boxShadow: '0 0 25px rgba(0, 123, 255, 0.5)', transition: { type: 'spring', stiffness: 400, damping: 10 } },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 25 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const buttonVariants = {
  whileHover: { scale: 1.05, y: -1, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' },
  whileTap: { scale: 0.95, y: 0 },
};

const cardHoverVariants = {
    initial: { y: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.12)' },
    whileHover: { y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.15)' , transition: { type: 'spring', stiffness: 400, damping: 15 }},
};


// --- Helper Components ---

const AnimatedSection = ({ children, variants }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
    >
      {children}
    </motion.div>
  );
};

// New component for the count-up animation
const AnimatedCounter = ({ toValue }) => {
    const nodeRef = useRef();

    useEffect(() => {
        const node = nodeRef.current;
        const controls = animate(0, toValue, {
            duration: 1.5,
            ease: "easeOut",
            onUpdate(value) {
                if(node) {
                    node.textContent = Math.round(value).toLocaleString();
                }
            }
        });
        return () => controls.stop();
    }, [toValue]);

    return <span ref={nodeRef} />;
}


// --- Main Profile Component ---

const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
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
    if (user) {
      setProfileData({
        name: user.name || 'User Name',
        businessName: user.businessName || 'Business Name',
        phone: user.phone || 'N/A',
        email: user.email || 'N/A',
        address: user.address || 'N/A',
        bio: user.bio || '',
      });
    }
    
    // Simulate API call for stats
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
    console.log('Saving profile:', profileData);
    setEditMode(false);
  };

  const StatCard = ({ icon, title, value, color, prefix = '' }) => (
    <motion.div variants={staggerItem} style={{ height: '100%' }}>
       <motion.div variants={cardHoverVariants} initial="initial" whileHover="whileHover" style={{ height: '100%' }}>
            <Paper sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Box sx={{ color, fontSize: 40, mb: 1, transition: 'transform 0.3s ease' }}>
                    {icon}
                </Box>
                <Typography variant="h5" color={color} fontWeight="bold">
                    {prefix}{value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {title}
                </Typography>
            </Paper>
       </motion.div>
    </motion.div>
  );

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
        style={{ minHeight: "100vh", position: 'relative', background: 'linear-gradient(135deg, #E5F3FF 0%, #A7D8F0 100%)' }}
    >
      {/* Animated floating shapes background */}
      <Box sx={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: -120, y: -80 }}
          animate={{ opacity: 0.18, scale: 1.1, x: 0, y: 0 }}
          transition={{ duration: 2 }}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <Box sx={{ width: 220, height: 220, borderRadius: '50%', background: 'linear-gradient(135deg, #2A6E9A 0%, #F59E0B 100%)', filter: 'blur(32px)' }} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.7, x: 120, y: 120 }}
          animate={{ opacity: 0.12, scale: 1, x: 0, y: 0 }}
          transition={{ duration: 2 }}
          style={{ position: 'absolute', bottom: 0, right: 0 }}
        >
          <Box sx={{ width: 180, height: 180, borderRadius: '50%', background: 'linear-gradient(135deg, #FDE68A 0%, #2A6E9A 100%)', filter: 'blur(24px)' }} />
        </motion.div>
      </Box>
      <Container maxWidth="lg" sx={{ mt: 2, py: 4, position: 'relative', zIndex: 1 }}>
        <motion.div variants={sectionVariants}>
          <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: '#2A6E9A', textShadow: '0 2px 12px #FDE68A' }}>
            Profile
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {/* Profile Info */}
          <Grid item xs={12} md={4}>
            <AnimatedSection variants={sectionVariants}>
                <motion.div variants={cardHoverVariants} initial="initial" whileHover="whileHover">
                    <Card sx={{
                      borderRadius: 6,
                      boxShadow: '0 8px 32px rgba(42,110,154,0.10)',
                      background: 'rgba(255,255,255,0.25)',
                      backdropFilter: 'blur(12px)',
                      border: '1.5px solid rgba(245,158,11,0.18)',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'box-shadow 0.3s',
                    }}>
                    <CardContent sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                        <motion.div
                        variants={avatarVariants}
                        initial="initial"
                        animate="animate"
                        whileHover="whileHover"
                        style={{ display: 'inline-block', cursor: 'pointer' }}
                        >
                        <Avatar
                            sx={{ width: 90, height: 90, bgcolor: 'primary.main', fontSize: 36, mx: 'auto', mb: 2, boxShadow: 3, border: '3px solid #FDE68A', transition: 'box-shadow 0.3s' }}
                        >
                            {profileData.name.charAt(0)}
                        </Avatar>
                        </motion.div>
                        {!editMode ? (
                        <>
                            <motion.div variants={staggerContainer} initial="initial" animate="animate">
                                {/* ... other profile details ... */}
                                <motion.div variants={staggerItem}>
                                    <Typography variant="h5" gutterBottom sx={{ color: '#2A6E9A', fontWeight: 700, textShadow: '0 2px 8px #FDE68A' }}>{profileData.name}</Typography>
                                </motion.div>
                                <motion.div variants={staggerItem}>
                                    <Typography variant="body1" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>{profileData.businessName}</Typography>
                                </motion.div>
                                <motion.div variants={staggerItem}>
                                    <Chip label={user?.role?.toUpperCase()} color="primary" size="small" sx={{ mb: 2, fontWeight: 700 }}/>
                                </motion.div>
                                {stats.trustScore && (
                                <motion.div variants={staggerItem}>
                                    <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
                                    <Star color="warning" />
                                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#F59E0B' }}>Trust Score: <strong>{stats.trustScore}</strong></Typography>
                                    </Box>
                                </motion.div>
                                )}
                                <motion.div variants={staggerItem}>
                                    <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={2}>
                                        <Rating value={stats.rating} size="small" readOnly sx={{ color: '#F59E0B' }} />
                                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>({stats.reviews} reviews)</Typography>
                                    </Box>
                                </motion.div>
                                <motion.div variants={staggerItem}>
                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                        <Phone fontSize="small" sx={{ color: '#2A6E9A' }} />
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{profileData.phone}</Typography>
                                    </Box>
                                </motion.div>
                                <motion.div variants={staggerItem}>
                                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                                        <LocationOn fontSize="small" sx={{ color: '#F59E0B' }} />
                                        <Typography variant="body2" sx={{ textAlign: 'left', fontWeight: 500 }}>{address?.fullAddress || 'Location not set'}</Typography>
                                    </Box>
                                </motion.div>
                            </motion.div>
                            <motion.div variants={buttonVariants} whileHover="whileHover" whileTap="whileTap">
                            <Button variant="contained" startIcon={<Edit />} onClick={() => setEditMode(true)} fullWidth sx={{ mt: 1, bgcolor: '#F59E0B', color: '#fff', fontWeight: 700, borderRadius: 2, boxShadow: 2, textTransform: 'none', transition: 'background 0.2s', '&:hover': { bgcolor: '#2A6E9A' } }}>
                                Edit Profile
                            </Button>
                            </motion.div>
                    <motion.div variants={buttonVariants} whileHover="whileHover" whileTap="whileTap">
                        <Button
                          variant="outlined"
                          fullWidth
                          sx={{ mt: 1, color: '#2A6E9A', borderColor: '#2A6E9A', fontWeight: 700, borderRadius: 2, boxShadow: 1, textTransform: 'none', transition: 'border 0.2s', '&:hover': { borderColor: '#34D399', bgcolor: '#E6FFF7' } }}
                          onClick={() => { logout(); navigate('/login'); }}
                        >
                          Logout
                        </Button>
                    </motion.div>
                        </>
                        ) : (
                         // --- Edit Mode Form (no changes here) ---
                         <Box sx={{ textAlign: 'left' }}>
                            <motion.div variants={staggerContainer} initial="initial" animate="animate">
                                <motion.div variants={staggerItem}><TextField fullWidth label="Full Name" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} sx={{ mb: 2 }}/></motion.div>
                                <motion.div variants={staggerItem}><TextField fullWidth label="Business Name" value={profileData.businessName} onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })} sx={{ mb: 2 }}/></motion.div>
                                <motion.div variants={staggerItem}><TextField fullWidth label="Email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} sx={{ mb: 2 }}/></motion.div>
                                <motion.div variants={staggerItem}><TextField fullWidth label="Bio" multiline rows={3} value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} sx={{ mb: 2 }}/></motion.div>
                            </motion.div>
                            <Box display="flex" gap={1}>
                                <motion.div variants={buttonVariants} whileHover="whileHover" whileTap="whileTap"><Button variant="contained" onClick={handleSaveProfile} size="small" sx={{ bgcolor: '#F59E0B', color: '#fff', fontWeight: 700, borderRadius: 2, boxShadow: 2, textTransform: 'none', transition: 'background 0.2s', '&:hover': { bgcolor: '#2A6E9A' } }}>Save</Button></motion.div>
                                <motion.div variants={buttonVariants} whileHover="whileHover" whileTap="whileTap"><Button variant="outlined" onClick={() => setEditMode(false)} size="small" sx={{ color: '#2A6E9A', borderColor: '#2A6E9A', fontWeight: 700, borderRadius: 2, boxShadow: 1, textTransform: 'none', transition: 'border 0.2s', '&:hover': { borderColor: '#F59E0B' } }}>Cancel</Button></motion.div>
                            </Box>
                        </Box>
                        )}
                    </CardContent>
                    {/* Glassmorphism animated overlay */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.10 }} transition={{ duration: 0.7 }} style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 24, background: 'linear-gradient(90deg, #FDE68A 0%, #2A6E9A 100%)' }} />
                  </Card>
                </motion.div>
            </AnimatedSection>
          </Grid>

          {/* Stats and Settings */}
          <Grid item xs={12} md={8}>
            <AnimatedSection variants={sectionVariants}>
              <Typography variant="h6" gutterBottom sx={{ color: '#2A6E9A', fontWeight: 700, textShadow: '0 2px 8px #FDE68A' }}>
                Your Stats
              </Typography>
            </AnimatedSection>
            <AnimatedSection variants={staggerContainer}>
                <Grid container spacing={2} mb={4}>
                    <Grid item xs={6} sm={3}>
                        <StatCard icon={<ShoppingCart />} title="Total Orders" value={stats.totalOrders} color="#2A6E9A"/>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <StatCard icon={<Group />} title="Completed Deals" value={stats.completedDeals} color="#F59E0B"/>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <StatCard icon={<TrendingUp />} title="Total Savings" value={stats.savings} prefix="₹" color="#2A6E9A"/>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <StatCard icon={<Star />} title="Rating" value={stats.rating} color="#F59E0B"/>
                    </Grid>
                </Grid>
            </AnimatedSection>

            {/* Settings */}
            <AnimatedSection variants={sectionVariants}>
                <motion.div variants={cardHoverVariants} initial="initial" whileHover="whileHover">
                    <Card sx={{
                      borderRadius: 6,
                      boxShadow: '0 8px 32px rgba(245,158,11,0.12)',
                      background: 'rgba(255,255,255,0.25)',
                      backdropFilter: 'blur(12px)',
                      border: '1.5px solid rgba(245,158,11,0.18)',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'box-shadow 0.3s',
                    }}>
                        <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ color: '#2A6E9A', fontWeight: 700, textShadow: '0 2px 8px #FDE68A' }}>Settings</Typography>
                        <Box mb={2}><Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#F59E0B', fontWeight: 700 }}><Notifications fontSize="small" />Notifications</Typography><FormControlLabel control={<Switch checked={settings.notifications} onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}/>} label="Enable push notifications" /></Box>
                        <Box mb={2}><Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#2A6E9A', fontWeight: 700 }}><LocationOn fontSize="small" />Location</Typography><FormControlLabel control={<Switch checked={settings.locationSharing} onChange={(e) => setSettings({ ...settings, locationSharing: e.target.checked })}/>} label="Share location with nearby vendors" /></Box>
                        <Box mb={2}><Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#F59E0B', fontWeight: 700 }}><Business fontSize="small" />Business</Typography><FormControlLabel control={<Switch checked={settings.autoAcceptOrders} onChange={(e) => setSettings({ ...settings, autoAcceptOrders: e.target.checked })}/>} label="Auto-accept orders from trusted suppliers" /></Box>
                        <Divider sx={{ my: 2 }} />
                        <Box display="flex" gap={1} flexWrap="wrap">
                            <motion.div variants={buttonVariants} whileHover="whileHover" whileTap="whileTap"><Button variant="outlined" size="small" startIcon={<Security/>} sx={{ color: '#2A6E9A', borderColor: '#2A6E9A', fontWeight: 700, borderRadius: 2, boxShadow: 1, textTransform: 'none', transition: 'border 0.2s', '&:hover': { borderColor: '#F59E0B' } }}>Privacy Policy</Button></motion.div>
                            <motion.div variants={buttonVariants} whileHover="whileHover" whileTap="whileTap"><Button variant="outlined" size="small" startIcon={<Language/>} sx={{ color: '#F59E0B', borderColor: '#F59E0B', fontWeight: 700, borderRadius: 2, boxShadow: 1, textTransform: 'none', transition: 'border 0.2s', '&:hover': { borderColor: '#2A6E9A' } }}>Terms of Service</Button></motion.div>
                            <motion.div variants={buttonVariants} whileHover="whileHover" whileTap="whileTap"><Button variant="contained" size="small" sx={{ bgcolor: '#2A6E9A', color: '#fff', fontWeight: 700, borderRadius: 2, boxShadow: 2, textTransform: 'none', transition: 'background 0.2s', '&:hover': { bgcolor: '#F59E0B' } }}>Help & Support</Button></motion.div>
                        </Box>
                        </CardContent>
                        {/* Glassmorphism animated overlay */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.10 }} transition={{ duration: 0.7 }} style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 18, background: 'linear-gradient(90deg, #FDE68A 0%, #2A6E9A 100%)' }} />
                    </Card>
                </motion.div>
            </AnimatedSection>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
};

export default Profile;