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
          navigate('/');
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

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F7F9FB 0%, #E5F3FF 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={0}
          sx={{ 
            p: 4,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          }}
          className="animate-fade-in"
        >
          {/* Brand Header */}
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

          {error && (
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
          )}

          <form onSubmit={handleSubmit}>
            <Box textAlign="center" mb={3}>
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
            </Box>

          {mode === 'register' && (
            <>
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
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(249, 250, 251, 0.5)',
                    '&:hover': {
                      backgroundColor: 'rgba(249, 250, 251, 0.8)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                    },
                  },
                }}
              />
              
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
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(249, 250, 251, 0.5)',
                    '&:hover': {
                      backgroundColor: 'rgba(249, 250, 251, 0.8)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                    },
                  },
                }}
              />
            </>
          )}

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
            sx={{ mb: 2 }}
          />
          
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
            sx={{ mb: mode === 'register' ? 2 : 3 }}
          />

          {mode === 'register' && (
            <>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  onChange={handleInputChange('role')}
                  label="Role"
                >
                  <MenuItem value="vendor">Vendor</MenuItem>
                  <MenuItem value="supplier">Supplier</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Business Name"
                variant="outlined"
                value={formData.businessName}
                onChange={handleInputChange('businessName')}
                InputProps={{
                  startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Business Address"
                variant="outlined"
                multiline
                rows={2}
                value={formData.address}
                onChange={handleInputChange('address')}
                sx={{ mb: 2 }}
              />
            </>
          )}
          
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
              <CircularProgress size={24} color="inherit" />
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </Button>
          
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
        </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
