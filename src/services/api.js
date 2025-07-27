// API Services for VendorHub
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
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

// Orders API
export const ordersAPI = {
  // Create a new order
  createOrder: async (orderData) => {
    return apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Get all orders
  getOrders: async () => {
    return apiCall('/orders');
  },

  // Get order by ID
  getOrder: async (id) => {
    return apiCall(`/orders/${id}`);
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    return apiCall(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// Group Buys API
export const groupBuyAPI = {
  // Get all group buys
  getGroupBuys: async () => {
    return apiCall('/groupbuys');
  },

  // Join a group buy
  joinGroupBuy: async (id, userId) => {
    return apiCall(`/groupbuys/${id}/join`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  // Create a new group buy
  createGroupBuy: async (groupBuyData) => {
    return apiCall('/groupbuys', {
      method: 'POST',
      body: JSON.stringify(groupBuyData),
    });
  },
};

// Suppliers API
export const suppliersAPI = {
  // Get all suppliers
  getSuppliers: async () => {
    return apiCall('/suppliers');
  },

  // Get supplier by ID
  getSupplier: async (id) => {
    return apiCall(`/suppliers/${id}`);
  },

  // Search suppliers
  searchSuppliers: async (query) => {
    return apiCall(`/suppliers/search?q=${encodeURIComponent(query)}`);
  },
};

// Reviews API
export const reviewsAPI = {
  // Create a new review
  createReview: async (reviewData) => {
    return apiCall('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  // Get all reviews
  getReviews: async () => {
    return apiCall('/reviews');
  },

  // Get reviews for a specific target (supplier/vendor)
  getReviewsForTarget: async (targetId) => {
    return apiCall(`/reviews/target/${targetId}`);
  },
};

// Civil Score API
export const civilScoreAPI = {
  // Get civil score for a user
  getCivilScore: async (userId) => {
    return apiCall(`/users/${userId}/civil-score`);
  },

  // Update civil score
  updateCivilScore: async (userId, scoreData) => {
    return apiCall(`/users/${userId}/civil-score`, {
      method: 'PUT',
      body: JSON.stringify(scoreData),
    });
  },
};

// Users API
export const usersAPI = {
  // Get all users
  getUsers: async () => {
    return apiCall('/users');
  },

  // Get user by ID
  getUser: async (id) => {
    return apiCall(`/users/${id}`);
  },

  // Update user profile
  updateUser: async (id, userData) => {
    return apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
};

// Health check API
export const healthAPI = {
  // Get server health status
  getHealth: async () => {
    return apiCall('/health');
  },

  // Test API connection
  testConnection: async () => {
    return apiCall('/test');
  },
};

export default {
  ordersAPI,
  groupBuyAPI,
  suppliersAPI,
  reviewsAPI,
  civilScoreAPI,
  usersAPI,
  healthAPI,
};
