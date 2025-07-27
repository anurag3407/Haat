import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import CreamThemeProvider from './theme/CreamThemeProvider';
import AuthProvider from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

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
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';

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
                <Navbar />
                <main className="main-content">
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
                      background: '#F9F6F1',
                      color: '#352E2E',
                      border: '1px solid #DCC6A0',
                      borderRadius: '16px',
                      fontFamily: 'Poppins, sans-serif',
                    },
                    success: {
                      iconTheme: {
                        primary: '#4CAF50',
                        secondary: '#F9F6F1',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#F44336',
                        secondary: '#F9F6F1',
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
