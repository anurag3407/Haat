import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LocationProvider } from './contexts/LocationContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import SourcingHub from './pages/SourcingHub';
import GroupBuys from './pages/GroupBuys';
import Bidding from './pages/Bidding';
import Orders from './pages/Orders';
import Profile from './pages/Profile';

// Create modern theme with new color palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#2A6E9A', // Dusty Blue
      light: '#3B82C4',
      dark: '#1E5A7A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4A5568', // Slate Gray
      light: '#6B7280',
      dark: '#374151',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    warning: {
      main: '#F59E0B',
      light: '#FCD34D',
      dark: '#D97706',
    },
    info: {
      main: '#2A6E9A', // Same as primary
      light: '#3B82C4',
      dark: '#1E5A7A',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    background: {
      default: '#F7F9FB', // Very Light Gray/Off-White
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2D3748', // Charcoal
      secondary: '#4A5568', // Slate Gray
    },
    divider: '#E5E7EB',
    action: {
      hover: 'rgba(42, 110, 154, 0.04)',
      selected: 'rgba(42, 110, 154, 0.08)',
      disabled: 'rgba(45, 55, 72, 0.26)',
      disabledBackground: 'rgba(45, 55, 72, 0.12)',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      color: '#2D3748',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.2,
      color: '#2D3748',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#2D3748',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#2D3748',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#2D3748',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#2D3748',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#4A5568',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#4A5568',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#2D3748',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#4A5568',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      color: '#6B7280',
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  shadows: [
    'none',
    '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
    // Continue with remaining shadows
    '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
    '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
    '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
    '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
    '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
    '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
    '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
    '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
    '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
    '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
    '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
    '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
    '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
    '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
    '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
    '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
    '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '0.875rem',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          },
        },
        containedPrimary: {
          backgroundColor: '#2A6E9A',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#1E5A7A',
          },
        },
        containedSecondary: {
          backgroundColor: '#4A5568',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#374151',
          },
        },
        outlined: {
          borderColor: '#2A6E9A',
          color: '#2A6E9A',
          '&:hover': {
            backgroundColor: 'rgba(42, 110, 154, 0.04)',
            borderColor: '#1E5A7A',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '& fieldset': {
              borderColor: '#D1D5DB',
            },
            '&:hover fieldset': {
              borderColor: '#9CA3AF',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2A6E9A',
              boxShadow: '0 0 0 3px rgba(42, 110, 154, 0.1)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontSize: '0.75rem',
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: 'rgba(42, 110, 154, 0.1)',
          color: '#2A6E9A',
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to home if authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? <Navigate to="/" /> : children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <LocationProvider>
          <Router>
            <Routes>
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Home />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sourcing" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <SourcingHub />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/groupbuys" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <GroupBuys />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/bidding" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Bidding />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/orders" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Orders />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Profile />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              {/* TODO: Add more protected routes */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </LocationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
