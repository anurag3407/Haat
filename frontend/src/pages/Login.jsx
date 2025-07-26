  // Advanced window loader animation
  const WindowLoader = ({ show }) => (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            background: 'linear-gradient(135deg, #F7F9FB 0%, #E5F3FF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Animated blobs */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: [0.7, 1.1, 1], opacity: [0, 0.18, 0.12] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'mirror' }}
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            <Box sx={{ width: 320, height: 320, borderRadius: '50%', background: 'linear-gradient(135deg, #2A6E9A 0%, #F59E0B 100%)', filter: 'blur(48px)' }} />
          </motion.div>
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: [0.7, 1.1, 1], opacity: [0, 0.12, 0.18] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'mirror', delay: 1 }}
            style={{ position: 'absolute', bottom: 0, right: 0 }}
          >
            <Box sx={{ width: 220, height: 220, borderRadius: '50%', background: 'linear-gradient(135deg, #FDE68A 0%, #2A6E9A 100%)', filter: 'blur(32px)' }} />
          </motion.div>
          {/* Shimmer loader */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ position: 'relative', zIndex: 2 }}
          >
            <Box sx={{ width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(135deg, #2A6E9A 0%, #F59E0B 100%)', boxShadow: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}
              />
              <Store sx={{ fontSize: 56, color: '#fff', zIndex: 2 }} />
            </Box>
            <Typography variant="h5" sx={{ mt: 3, color: '#2A6E9A', fontWeight: 700, textShadow: '0 2px 8px #FDE68A', letterSpacing: 1 }}>Loading...</Typography>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
} from '@mui/material';
import { Email, Lock, Store, Person, Phone, Business } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'vendor',
    businessName: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const { loginUser, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        if (!formData.email || !formData.password) {
          setError('Please enter email and password');
          return;
        }

        const result = await loginUser(formData.email, formData.password);
        if (result.success) {
          navigate('/');
        } else {
          setError(result.error || 'Login failed');
        }
      } else {
        // Registration
        if (!formData.email || !formData.password || !formData.name || !formData.phone) {
          setError('Please fill all required fields');
          return;
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          return;
        }

        const result = await register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          role: formData.role,
          businessName: formData.businessName,
          address: formData.address,
        });

        if (result.success) {
          // Show success animation
          setShowSuccess(true);
          setShowConfetti(true);
          
          // Auto-navigate after animation
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          setError(result.error || 'Registration failed');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    setError('');
  };

  // Animation variants
  const containerStagger = {
    animate: {
      transition: {
        staggerChildren: 0.13,
        delayChildren: 0.2,
      },
    },
  };

  const fadeSlideUp = {
    initial: { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const fadeSlideDown = {
    initial: { opacity: 0, y: -32 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  // Enhanced field styles with focus animations
  const enhancedFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      backgroundColor: 'rgba(249, 250, 251, 0.5)',
      transition: 'all 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease',
      transform: 'scale(1)',
      '&:hover': {
        backgroundColor: 'rgba(249, 250, 251, 0.8)',
      },
      '&.Mui-focused': {
        backgroundColor: 'white',
        transform: 'scale(1.02)',
        boxShadow: '0 8px 24px rgba(42, 110, 154, 0.15)',
        '& fieldset': {
          borderColor: '#2A6E9A',
          borderWidth: '2px',
        },
      },
    },
  };

  // Success animation variants
  const successContainerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2
      }
    }
  };

  const successItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    }
  };

  const checkmarkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: {
        pathLength: { duration: 0.8, ease: 'easeInOut' },
        opacity: { duration: 0.3, delay: 0.5 }
      }
    }
  };

  // Confetti component
  const Confetti = () => {
    const confettiColors = ['#2A6E9A', '#D97757', '#10B981', '#F59E0B', '#EF4444'];
    
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)],
              borderRadius: Math.random() > 0.5 ? '50%' : '0%',
              left: Math.random() * 100 + '%',
              top: -10,
            }}
            animate={{
              y: [0, window.innerHeight + 10],
              x: [0, (Math.random() - 0.5) * 100],
              rotate: [0, 360],
              opacity: [1, 0],
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              ease: 'easeOut',
              delay: Math.random() * 0.5,
            }}
          />
        ))}
      </div>
    );
  };

  // Success component
  const SuccessAnimation = () => (
    <motion.div
      variants={successContainerVariants}
      initial="hidden"
      animate="visible"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: 12,
        zIndex: 5,
      }}
    >
      <motion.div variants={successItemVariants}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <motion.path
              d="M9 12l2 2 4-4"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={checkmarkVariants}
              initial="hidden"
              animate="visible"
            />
          </svg>
        </Box>
      </motion.div>
      
      <motion.div variants={successItemVariants}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            color: '#10B981',
            mb: 1,
            textAlign: 'center',
          }}
        >
          Registration Successful!
        </Typography>
      </motion.div>
      
      <motion.div variants={successItemVariants}>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary',
            textAlign: 'center',
            mb: 3,
          }}
        >
          Welcome to Haat B2B! Redirecting you to your dashboard...
        </Typography>
      </motion.div>
      
      <motion.div variants={successItemVariants}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '3px solid #E5E7EB',
            borderTop: '3px solid #10B981',
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        />
      </motion.div>
    </motion.div>
  );

  return (
    <>
      <WindowLoader show={loading} />
      <Box 
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(120deg, #E5F3FF 0%, #A7D8F0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Background Blob */}
        <motion.div
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            width: 400,
            height: 400,
            zIndex: 0,
            pointerEvents: 'none',
            filter: 'blur(60px)',
            background: 'radial-gradient(circle at 60% 40%, rgba(42, 110, 154, 0.3) 0%, rgba(217, 119, 87, 0.3) 100%)',
            transform: 'translateX(-50%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 40, -40, 0],
            y: [0, 20, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        />

        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            variants={fadeSlideDown}
            initial="initial"
            animate="animate"
          >
            <Paper 
              elevation={0}
              sx={(theme) => ({
                p: 4,
                borderRadius: 3,
                border: '1px solid',
                borderColor: theme.palette.divider,
                background: theme.palette.mode === 'light'
                  ? 'linear-gradient(120deg, #FFFFFF 80%, #A7D8F0 100%)'
                  : 'rgba(30, 41, 59, 0.95)',
                color: theme.palette.text.primary,
                backdropFilter: 'blur(10px)',
                boxShadow: theme.palette.mode === 'light'
                  ? '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.06)'
                  : '0 20px 25px -5px rgb(0 0 0 / 0.18), 0 8px 10px -6px rgb(0 0 0 / 0.16)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'background 0.3s',
              })}
              className="animate-fade-in"
            >
              {/* Success Animation Overlay */}
              <AnimatePresence>
                {showSuccess && <SuccessAnimation />}
              </AnimatePresence>

              {/* Confetti */}
              <AnimatePresence>
                {showConfetti && <Confetti />}
              </AnimatePresence>

              {/* Brand Header */}
              <motion.div
                variants={fadeSlideUp}
                initial="initial"
                animate="animate"
              >
                <Box textAlign="center" mb={4}>
                  <Box 
                    sx={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2A6E9A 0%, #D97757 100%)',
                      mb: 2,
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    }}
                  >
                    <Store sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #2A6E9A 0%, #D97757 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1,
                    }}
                  >
                    Haat B2B
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
                    Hyperlocal B2B Marketplace for Street Vendors
                  </Typography>
                </Box>
              </motion.div>

              {/* Error Alert */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
                    exit={{ opacity: 0, y: -16, transition: { duration: 0.3 } }}
                  >
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mb: 3,
                        borderRadius: 2,
                        '& .MuiAlert-icon': {
                          color: '#EF4444',
                        },
                      }}
                      className="animate-slide-up"
                    >
                      {error}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.form
                onSubmit={handleSubmit}
                variants={containerStagger}
                initial="initial"
                animate="animate"
              >
                <Box textAlign="center" mb={3}>
                  <motion.div variants={fadeSlideUp}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 1,
                      }}
                    >
                      {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {mode === 'login' 
                        ? 'Sign in to access your marketplace' 
                        : 'Join the hyperlocal B2B revolution'
                      }
                    </Typography>
                  </motion.div>
                </Box>

                {/* Registration fields with AnimatePresence for mode switching */}
                <AnimatePresence mode="wait" initial={false}>
                  {mode === 'register' && (
                    <>
                      <motion.div
                        key="name"
                        variants={fadeSlideUp}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } }}
                        exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
                      >
                        <TextField
                          fullWidth
                          label="Full Name"
                          variant="outlined"
                          value={formData.name}
                          onChange={handleInputChange('name')}
                          required
                          InputProps={{
                            startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                          }}
                          sx={{ 
                            mb: 2,
                            ...enhancedFieldStyles,
                          }}
                        />
                      </motion.div>
                      
                      <motion.div
                        key="phone"
                        variants={fadeSlideUp}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0, transition: { type: 'spring', stiffness: 400, damping: 30, delay: 0.1 } }}
                        exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
                      >
                        <TextField
                          fullWidth
                          label="Phone Number"
                          variant="outlined"
                          value={formData.phone}
                          onChange={handleInputChange('phone')}
                          placeholder="10-digit mobile number"
                          required
                          InputProps={{
                            startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                          }}
                          inputProps={{ maxLength: 10 }}
                          sx={{ 
                            mb: 2,
                            ...enhancedFieldStyles,
                          }}
                        />
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>

                <motion.div variants={fadeSlideUp}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    variant="outlined"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    required
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    sx={{ 
                      mb: 2,
                      ...enhancedFieldStyles,
                    }}
                  />
                </motion.div>
                
                <motion.div variants={fadeSlideUp}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    required
                    InputProps={{
                      startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    sx={{ 
                      mb: mode === 'register' ? 2 : 3,
                      ...enhancedFieldStyles,
                    }}
                  />
                </motion.div>

                <AnimatePresence mode="wait" initial={false}>
                  {mode === 'register' && (
                    <>
                      <motion.div
                        key="role"
                        variants={fadeSlideUp}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0, transition: { type: 'spring', stiffness: 400, damping: 30, delay: 0.2 } }}
                        exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
                      >
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <InputLabel>Role</InputLabel>
                          <Select
                            value={formData.role}
                            onChange={handleInputChange('role')}
                            label="Role"
                            sx={{
                              ...enhancedFieldStyles,
                            }}
                          >
                            <MenuItem value="vendor">Vendor</MenuItem>
                            <MenuItem value="supplier">Supplier</MenuItem>
                          </Select>
                        </FormControl>
                      </motion.div>
                      
                      <motion.div
                        key="businessName"
                        variants={fadeSlideUp}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0, transition: { type: 'spring', stiffness: 400, damping: 30, delay: 0.3 } }}
                        exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
                      >
                        <TextField
                          fullWidth
                          label="Business Name"
                          variant="outlined"
                          value={formData.businessName}
                          onChange={handleInputChange('businessName')}
                          InputProps={{
                            startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} />,
                          }}
                          sx={{ 
                            mb: 2,
                            ...enhancedFieldStyles,
                          }}
                        />
                      </motion.div>
                      
                      <motion.div
                        key="address"
                        variants={fadeSlideUp}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0, transition: { type: 'spring', stiffness: 400, damping: 30, delay: 0.4 } }}
                        exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
                      >
                        <TextField
                          fullWidth
                          label="Business Address"
                          variant="outlined"
                          multiline
                          rows={2}
                          value={formData.address}
                          onChange={handleInputChange('address')}
                          sx={{ 
                            mb: 2,
                            ...enhancedFieldStyles,
                          }}
                        />
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>

                <motion.div variants={fadeSlideUp}>
                  <motion.div
                    whileHover={{ scale: 1.04, boxShadow: '0 8px 24px rgba(42,110,154,0.10)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{ 
                        mb: 2,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        },
                      }}
                    >
                      {loading ? (
                        <span style={{ visibility: 'hidden' }}>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                      ) : (
                        mode === 'login' ? 'Sign In' : 'Create Account'
                      )}
                    </Button>
                  </motion.div>
                </motion.div>

                <motion.div variants={fadeSlideUp}>
                  <Box textAlign="center">
                    <Link
                      component="button"
                      type="button"
                      variant="body2"
                      onClick={() => {
                        setMode(mode === 'login' ? 'register' : 'login');
                        setError('');
                      }}
                      sx={{
                        color: 'primary.main',
                        textDecoration: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {mode === 'login' 
                        ? "Don't have an account? Sign up" 
                        : 'Already have an account? Sign in'
                      }
                    </Link>
                  </Box>
                </motion.div>
              </motion.form>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </>
  );
};

export default Login;
