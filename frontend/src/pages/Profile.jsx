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
                    {prefix}
                    {typeof value === 'number' ? <AnimatedCounter toValue={value} /> : value}
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
      style={{ minHeight: "100vh" }}
    >
      <Container maxWidth="lg" sx={{ mt: 2, py: 4 }}>
        <motion.div variants={sectionVariants}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Profile
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {/* Profile Info */}
          <Grid item xs={12} md={4}>
            <AnimatedSection variants={sectionVariants}>
                <motion.div variants={cardHoverVariants} initial="initial" whileHover="whileHover">
                    <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <motion.div
                        variants={avatarVariants}
                        initial="initial"
                        animate="animate"
                        whileHover="whileHover"
                        style={{ display: 'inline-block', cursor: 'pointer' }}
                        >
                        <Avatar
                            sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: 32, mx: 'auto', mb: 2 }}
                        >
                            {profileData.name.charAt(0)}
                        </Avatar>
                        </motion.div>
                        {!editMode ? (
                        <>
                            <motion.div variants={staggerContainer} initial="initial" animate="animate">
                                {/* ... other profile details */}
                                <motion.div variants={staggerItem}>
                                    <Typography variant="h5" gutterBottom>{profileData.name}</Typography>
                                </motion.div>
                                <motion.div variants={staggerItem}>
                                    <Typography variant="body1" color="text.secondary" gutterBottom>{profileData.businessName}</Typography>
                                </motion.div>
                                <motion.div variants={staggerItem}>
                                    <Chip label={user?.role?.toUpperCase()} color="primary" size="small" sx={{ mb: 2 }}/>
                                </motion.div>
                                {stats.trustScore && (
                                <motion.div variants={staggerItem}>
                                    <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
                                    <Star color="warning" />
                                    <Typography variant="body1">Trust Score: <strong>{stats.trustScore}</strong></Typography>
                                    </Box>
                                </motion.div>
                                )}
                                <motion.div variants={staggerItem}>
                                    <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={2}>
                                        <Rating value={stats.rating} size="small" readOnly />
                                        <Typography variant="body2" color="text.secondary">({stats.reviews} reviews)</Typography>
                                    </Box>
                                </motion.div>
                                <motion.div variants={staggerItem}>
                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                        <Phone fontSize="small" />
                                        <Typography variant="body2">{profileData.phone}</Typography>
                                    </Box>
                                </motion.div>
                                <motion.div variants={staggerItem}>
                                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                                        <LocationOn fontSize="small" />
                                        <Typography variant="body2" sx={{ textAlign: 'left' }}>{address?.fullAddress || 'Location not set'}</Typography>
                                    </Box>
                                </motion.div>
                            </motion.div>
                            <motion.div variants={buttonVariants} whileHover="whileHover" whileTap="whileTap">
                            <Button variant="outlined" startIcon={<Edit />} onClick={() => setEditMode(true)} fullWidth sx={{ mt: 1 }}>
                                Edit Profile
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
                                <motion.div variants={buttonVariants} whileHover="whileHover" whileTap="whileTap"><Button variant="contained" onClick={handleSaveProfile} size="small">Save</Button></motion.div>
                                <motion.div variants={buttonVariants} whileHover="whileHover" whileTap="whileTap"><Button variant="outlined" onClick={() => setEditMode(false)} size="small">Cancel</Button></motion.div>
                            </Box>
                        </Box>
                        )}
                    </CardContent>
                    </Card>
                </motion.div>
            </AnimatedSection>
          </Grid>

          {/* Stats and Settings */}
          <Grid item xs={12} md={8}>
            <AnimatedSection variants={sectionVariants}>
              <Typography variant="h6" gutterBottom>
                Your Stats
              </Typography>
            </AnimatedSection>
            <AnimatedSection variants={staggerContainer}>
                <Grid container spacing={2} mb={4}>
                    <Grid item xs={6} sm={3}>
                        <StatCard icon={<ShoppingCart />} title="Total Orders" value={stats.totalOrders} color="primary.main"/>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <StatCard icon={<Group />} title="Completed Deals" value={stats.completedDeals} color="success.main"/>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <StatCard icon={<TrendingUp />} title="Total Savings" value={stats.savings} prefix="₹" color="info.main"/>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <StatCard icon={<Star />} title="Rating" value={stats.rating} color="warning.main"/>
                    </Grid>
                </Grid>
            </AnimatedSection>

            {/* Settings */}
            <AnimatedSection variants={sectionVariants}>
                <motion.div variants={cardHoverVariants} initial="initial" whileHover="whileHover">
                    <Card>
                        <CardContent>
                        <Typography variant="h6" gutterBottom>Settings</Typography>
                        <Box mb={2}><Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Notifications fontSize="small" />Notifications</Typography><FormControlLabel control={<Switch checked={settings.notifications} onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}/>} label="Enable push notifications"/></Box>
                        <Box mb={2}><Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><LocationOn fontSize="small" />Location</Typography><FormControlLabel control={<Switch checked={settings.locationSharing} onChange={(e) => setSettings({ ...settings, locationSharing: e.target.checked })}/>} label="Share location with nearby vendors"/></Box>
                        <Box mb={2}><Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Business fontSize="small" />Business</Typography><FormControlLabel control={<Switch checked={settings.autoAcceptOrders} onChange={(e) => setSettings({ ...settings, autoAcceptOrders: e.target.checked })}/>} label="Auto-accept orders from trusted suppliers"/></Box>
                        <Divider sx={{ my: 2 }} />
                        <Box display="flex" gap={1} flexWrap="wrap">
                            <motion.div variants={buttonVariants} whileHover="whileHover" whileTap="whileTap"><Button variant="outlined" size="small" startIcon={<Security/>}>Privacy Policy</Button></motion.div>
                            <motion.div variants={buttonVariants} whileHover="whileHover" whileTap="whileTap"><Button variant="outlined" size="small" startIcon={<Language/>}>Terms of Service</Button></motion.div>
                            <motion.div variants={buttonVariants} whileHover="whileHover" whileTap="whileTap"><Button variant="outlined" size="small">Help & Support</Button></motion.div>
                        </Box>
                        </CardContent>
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