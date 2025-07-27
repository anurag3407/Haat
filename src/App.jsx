import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import styled from 'styled-components';

import CreamThemeProvider from './theme/CreamThemeProvider';
import AuthProvider from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import haatLogo from './assets/haat.png';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GroupBuy from './pages/GroupBuy';
import CivilScore from './pages/CivilScore';
import SupplierRatings from './pages/SupplierRatings';
import NewOrder from './pages/NewOrder';
import OrderTracking from './pages/OrderTracking';
import CommunityFeed from './pages/CommunityFeed';

// Components
import LoadingSpinner from './components/LoadingSpinner';

// Inline Navbar Component
const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #F7F4EC;
  border-bottom: 1px solid #87AFC7;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  box-shadow: 0 2px 10px rgba(135, 175, 199, 0.1);
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: #36454F;
  font-size: 1.5rem;
  font-weight: bold;
`;

const LogoImg = styled.img`
  height: 40px;
  width: 40px;
  border-radius: 8px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #6C7B8B;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    color: #36454F;
    background: #87AFC7;
  }
  
  &.active {
    color: #36454F;
    background: #87AFC7;
  }
`;

const AuthSection = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const AuthBtn = styled(Link)`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
  
  &.login {
    color: #36454F;
    border: 1px solid #87AFC7;
    background: transparent;
    
    &:hover {
      background: #87AFC7;
      color: white;
    }
  }
  
  &.register {
    background: #87AFC7;
    color: white;
    border: 1px solid #87AFC7;
    
    &:hover {
      background: #6C7B8B;
    }
  }
`;

const UserBtn = styled.button`
  background: #87AFC7;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background: #6C7B8B;
  }
`;

// Inline Navbar Component
function InlineNavbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard', requireAuth: true },
    { to: '/group-buy', label: 'Group Buy', requireAuth: true },
    { to: '/community', label: 'Community', requireAuth: true },
    { to: '/suppliers', label: 'Suppliers' },
  ];

  const filteredLinks = navLinks.filter(link => !link.requireAuth || isAuthenticated);

  return (
    <NavbarContainer>
      <Logo to="/">
        <LogoImg src={haatLogo} alt="Haat" />
        Haat
      </Logo>

      <NavLinks>
        {filteredLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? 'active' : ''}
          >
            {link.label}
          </NavLink>
        ))}
      </NavLinks>

      <AuthSection>
        {isAuthenticated ? (
          <UserBtn onClick={() => logout()}>
            👤 {user?.name || 'User'}
          </UserBtn>
        ) : (
          <>
            <AuthBtn to="/login" className="login">Login</AuthBtn>
            <AuthBtn to="/register" className="register">Register</AuthBtn>
          </>
        )}
      </AuthSection>
    </NavbarContainer>
  );
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CreamThemeProvider>
        <AuthProvider>
          <Router>
              <div className="app">
                <InlineNavbar />
                <main className="main-content" style={{ paddingTop: '80px' }}>
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      
                      {/* Protected Routes */}
                      <Route path="/dashboard" element={
                        // <ProtectedRoute>
                          <Dashboard />
                        // </ProtectedRoute>
                      } />
                      
                      <Route path="/group-buy" element={
                        <ProtectedRoute>
                          <GroupBuy />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/civil-score" element={
                        <ProtectedRoute allowedRoles={['vendor']}>
                          <CivilScore />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/supplier-ratings" element={
                        <ProtectedRoute>
                          <SupplierRatings />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/new-order" element={
                        <ProtectedRoute allowedRoles={['vendor']}>
                          <NewOrder />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/orders/:id/tracking" element={
                        <ProtectedRoute>
                          <OrderTracking />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/community" element={
                        <ProtectedRoute>
                          <CommunityFeed />
                        </ProtectedRoute>
                      } />
                    </Routes>
                  </AnimatePresence>
                </main>
                
                {/* Toast notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#F7F4EC',
                      color: '#36454F',
                      border: '1px solid #87AFC7',
                      borderRadius: '16px',
                      fontFamily: 'Poppins, sans-serif',
                    },
                    success: {
                      iconTheme: {
                        primary: '#4CAF50',
                        secondary: '#F7F4EC',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#F44336',
                        secondary: '#F7F4EC',
                      },
                    },
                  }}
                />
              </div>
            </Router>
          </AuthProvider>
        </CreamThemeProvider>
      </QueryClientProvider>
    );
  }
  
  export default App;
