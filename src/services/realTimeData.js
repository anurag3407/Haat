// Real-time Data Service for Haat
import { useQuery, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

// Real-time data hooks

// Get live dashboard statistics
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiCall('/dashboard/stats'),
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
  });
};

// Get live orders with real-time updates
export const useLiveOrders = (filters = {}) => {
  return useQuery({
    queryKey: ['live-orders', filters],
    queryFn: () => {
      const params = new URLSearchParams(filters);
      return apiCall(`/orders?${params}`);
    },
    refetchInterval: 15000, // Refresh every 15 seconds
    staleTime: 10000,
  });
};

// Get live group buy data
export const useLiveGroupBuys = () => {
  return useQuery({
    queryKey: ['live-group-buys'],
    queryFn: () => apiCall('/community/group-buys'),
    refetchInterval: 20000, // Refresh every 20 seconds
    staleTime: 15000,
  });
};

// Get live supplier ratings and reviews
export const useLiveSuppliers = (filters = {}) => {
  return useQuery({
    queryKey: ['live-suppliers', filters],
    queryFn: () => {
      const params = new URLSearchParams(filters);
      return apiCall(`/suppliers?${params}`);
    },
    refetchInterval: 60000, // Refresh every minute
    staleTime: 45000,
  });
};

// Get live community feed
export const useLiveCommunityFeed = () => {
  return useQuery({
    queryKey: ['live-community-feed'],
    queryFn: () => apiCall('/community/feed'),
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 25000,
  });
};

// Get live vendor civil scores
export const useLiveCivilScores = () => {
  return useQuery({
    queryKey: ['live-civil-scores'],
    queryFn: () => apiCall('/vendors/civil-scores'),
    refetchInterval: 300000, // Refresh every 5 minutes
    staleTime: 240000,
  });
};

// Get live user profile
export const useLiveUserProfile = () => {
  return useQuery({
    queryKey: ['live-user-profile'],
    queryFn: () => apiCall('/auth/me'),
    refetchInterval: 120000, // Refresh every 2 minutes
    staleTime: 90000,
  });
};

// Get live market insights
export const useLiveMarketInsights = () => {
  return useQuery({
    queryKey: ['live-market-insights'],
    queryFn: () => apiCall('/community/market-insights'),
    refetchInterval: 600000, // Refresh every 10 minutes
    staleTime: 480000,
  });
};

// Get live vendor/supplier counts by location
export const useLiveLocationStats = (location) => {
  return useQuery({
    queryKey: ['live-location-stats', location],
    queryFn: () => apiCall(`/geo/nearby?lat=${location.lat}&lng=${location.lng}&radius=10`),
    refetchInterval: 180000, // Refresh every 3 minutes
    staleTime: 120000,
    enabled: !!location,
  });
};

// Real-time notifications
export const useLiveNotifications = () => {
  return useQuery({
    queryKey: ['live-notifications'],
    queryFn: () => apiCall('/notifications'),
    refetchInterval: 10000, // Refresh every 10 seconds
    staleTime: 5000,
  });
};

// Category-wise data
export const useLiveCategoryData = (category) => {
  return useQuery({
    queryKey: ['live-category-data', category],
    queryFn: () => apiCall(`/categories/${category}/stats`),
    refetchInterval: 120000, // Refresh every 2 minutes
    staleTime: 90000,
    enabled: !!category,
  });
};

// Real-time utility functions
export const useRefreshData = () => {
  const queryClient = useQueryClient();
  
  return {
    refreshAll: () => {
      queryClient.invalidateQueries();
    },
    refreshDashboard: () => {
      queryClient.invalidateQueries(['dashboard-stats']);
      queryClient.invalidateQueries(['live-orders']);
      queryClient.invalidateQueries(['live-group-buys']);
    },
    refreshCommunity: () => {
      queryClient.invalidateQueries(['live-community-feed']);
      queryClient.invalidateQueries(['live-market-insights']);
    },
    refreshProfile: () => {
      queryClient.invalidateQueries(['live-user-profile']);
    }
  };
};

// Hook for real-time status indicators
export const useRealTimeStatus = () => {
  const queryClient = useQueryClient();
  
  const getQueryStatus = (queryKey) => {
    const query = queryClient.getQueryState(queryKey);
    return {
      isLoading: query?.status === 'loading',
      isError: query?.status === 'error',
      isStale: query ? Date.now() - query.dataUpdatedAt > (query.staleTime || 0) : true,
      lastUpdate: query?.dataUpdatedAt,
      error: query?.error,
    };
  };

  return {
    dashboardStatus: getQueryStatus(['dashboard-stats']),
    ordersStatus: getQueryStatus(['live-orders']),
    suppliersStatus: getQueryStatus(['live-suppliers']),
    communityStatus: getQueryStatus(['live-community-feed']),
    
    // Overall health check
    isHealthy: () => {
      const queries = queryClient.getQueryCache().getAll();
      const errorQueries = queries.filter(q => q.state.status === 'error');
      return errorQueries.length === 0;
    }
  };
};

export default {
  useDashboardStats,
  useLiveOrders,
  useLiveGroupBuys,
  useLiveSuppliers,
  useLiveCommunityFeed,
  useLiveCivilScores,
  useLiveUserProfile,
  useLiveMarketInsights,
  useLiveLocationStats,
  useLiveNotifications,
  useLiveCategoryData,
  useRefreshData,
  useRealTimeStatus,
};
