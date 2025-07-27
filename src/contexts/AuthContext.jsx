import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Auth Context
const AuthContext = createContext({});

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'LOGIN_ERROR':
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// API helper functions
const apiCall = async (endpoint, options = {}) => {
  const { tokens, ...otherOptions } = options;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(tokens?.accessToken && {
        Authorization: `Bearer ${tokens.accessToken}`,
      }),
    },
    ...otherOptions,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Auth Provider Component
export default function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const queryClient = useQueryClient();

  // Load tokens from localStorage on mount
  useEffect(() => {
    const savedTokens = localStorage.getItem('auth_tokens');
    const savedUser = localStorage.getItem('auth_user');

    if (savedTokens && savedUser) {
      try {
        const tokens = JSON.parse(savedTokens);
        const user = JSON.parse(savedUser);
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, tokens },
        });
      } catch (error) {
        console.error('Error loading saved auth data:', error);
        localStorage.removeItem('auth_tokens');
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  // Fetch current user profile when authenticated
  const { data: userProfile, error: profileError } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => apiCall('/auth/me', { tokens: state.tokens }),
    enabled: !!state.tokens?.accessToken,
    retry: 1,
    onSuccess: (data) => {
      dispatch({
        type: 'UPDATE_USER',
        payload: data.user,
      });
    },
    onError: (error) => {
      if (error.message.includes('expired') || error.message.includes('invalid')) {
        logout();
      }
    },
  });

  // Helper function to save auth data
  const saveAuthData = (user, tokens) => {
    localStorage.setItem('auth_user', JSON.stringify(user));
    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
  };

  // Helper function to clear auth data
  const clearAuthData = () => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_tokens');
  };

  // Login function
  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const data = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      // Handle both token formats for compatibility
      const { user, tokens, token } = data;
      const authTokens = tokens || { accessToken: token, refreshToken: null };
      
      saveAuthData(user, authTokens);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, tokens: authTokens },
      });

      toast.success(`Welcome back, ${user.name}!`);
      return { success: true, data };
    } catch (error) {
      dispatch({
        type: 'LOGIN_ERROR',
        payload: error.message,
      });
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const data = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      // Handle both token formats for compatibility
      const { user, tokens, token } = data;
      const authTokens = tokens || { accessToken: token, refreshToken: null };
      
      saveAuthData(user, authTokens);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, tokens: authTokens },
      });

      toast.success(`Welcome to VendorHub, ${user.name}!`);
      return { success: true, data };
    } catch (error) {
      dispatch({
        type: 'LOGIN_ERROR',
        payload: error.message,
      });
      toast.error(error.message || 'Registration failed');
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (state.tokens?.accessToken) {
        await apiCall('/auth/logout', {
          method: 'POST',
          tokens: state.tokens,
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      clearAuthData();
      dispatch({ type: 'LOGOUT' });
      queryClient.clear();
      toast.success('Logged out successfully');
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const data = await apiCall('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
        tokens: state.tokens,
      });

      dispatch({
        type: 'UPDATE_USER',
        payload: data.user,
      });

      // Update saved user data
      saveAuthData(data.user, state.tokens);
      
      // Invalidate user profile query
      queryClient.invalidateQueries(['user-profile']);

      toast.success('Profile updated successfully');
      return { success: true, data };
    } catch (error) {
      toast.error(error.message || 'Profile update failed');
      return { success: false, error: error.message };
    }
  };

  // Change password function
  const changePassword = async (passwordData) => {
    try {
      const data = await apiCall('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(passwordData),
        tokens: state.tokens,
      });

      toast.success('Password changed successfully');
      return { success: true, data };
    } catch (error) {
      toast.error(error.message || 'Password change failed');
      return { success: false, error: error.message };
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      if (!state.tokens?.refreshToken) {
        throw new Error('No refresh token available');
      }

      const data = await apiCall('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: state.tokens.refreshToken }),
      });

      const newTokens = data.tokens;
      const updatedTokens = { ...state.tokens, ...newTokens };
      
      saveAuthData(state.user, updatedTokens);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: state.user, tokens: updatedTokens },
      });

      return updatedTokens;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      throw error;
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return state.user?.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(state.user?.role);
  };

  // Context value
  const contextValue = {
    // State
    user: state.user,
    tokens: state.tokens,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshToken,
    clearError,
    
    // Helpers
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Custom hook for authenticated API calls
export const useAuthenticatedApi = () => {
  const { tokens, refreshToken, logout } = useAuth();

  const authenticatedApiCall = async (endpoint, options = {}) => {
    try {
      return await apiCall(endpoint, { ...options, tokens });
    } catch (error) {
      // If token expired, try to refresh
      if (error.message.includes('expired') && tokens?.refreshToken) {
        try {
          const newTokens = await refreshToken();
          return await apiCall(endpoint, { ...options, tokens: newTokens });
        } catch (refreshError) {
          logout();
          throw refreshError;
        }
      }
      throw error;
    }
  };

  return authenticatedApiCall;
};
