import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding token to request:', token);
    } else {
      console.log('No token found in localStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`API Response [${response.config.method.toUpperCase()}] ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (usernameOrEmail, password) => {
    try {
      console.log('Login attempt with:', usernameOrEmail);
      
      // Determine if input is email or username
      const isEmail = usernameOrEmail.includes('@');
      const loginData = isEmail 
        ? { email: usernameOrEmail, password } 
        : { username: usernameOrEmail, password };
      
      const response = await api.post('/auth/login', loginData);
      
      if (response.data.success) {
        console.log('Login successful:', response.data);
        localStorage.setItem('token', response.data.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        // Dispatch custom event to notify about auth state change
        window.dispatchEvent(new Event('auth-change'));
      } else {
        console.error('Login failed with success false:', response.data);
      }
      return response.data;
    } catch (error) {
      console.error('Login error details:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  register: async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', { username, email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Dispatch custom event to notify about auth state change
    window.dispatchEvent(new Event('auth-change'));
  },

  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      console.log('Current user from localStorage:', user);
      return user;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      // If there's an error, clear localStorage to avoid future errors
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = authService.getCurrentUser();
    return !!(token && user);
  },

  isAdmin: () => {
    const user = authService.getCurrentUser();
    console.log('isAdmin check:', user);
    return user ? user.is_admin : false;
  }
};

// Posts services
export const postService = {
  getPosts: async (params = {}) => {
    try {
      const response = await api.get('/posts', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch posts' };
    }
  },

  getAllPosts: async (params = {}) => {
    try {
      const response = await api.get('/posts/admin/all', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch all posts' };
    }
  },

  getPost: async (id) => {
    try {
      const response = await api.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch post' };
    }
  },

  createPost: async (postData) => {
    try {
      const response = await api.post('/posts', postData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create post' };
    }
  },

  updatePost: async (id, postData) => {
    try {
      const response = await api.put(`/posts/${id}`, postData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update post' };
    }
  },

  deletePost: async (id) => {
    try {
      const response = await api.delete(`/posts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete post' };
    }
  },

  addComment: async (postId, content) => {
    try {
      const response = await api.post(`/posts/${postId}/comments`, { 
        content, 
        post_id: postId 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add comment' };
    }
  }
};

// Categories services
export const categoryService = {
  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch categories' };
    }
  },

  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create category' };
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update category' };
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete category' };
    }
  }
};

// User services
export const userService = {
  getCurrentUserInfo: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user information' };
    }
  },

  updateUserInfo: async (userData) => {
    try {
      const response = await api.put('/users/me', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update user information' };
    }
  },

  getUsers: async (params = {}) => {
    try {
      const response = await api.get('/users', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },

  toggleAdminStatus: async (userId) => {
    try {
      const response = await api.put(`/users/${userId}/admin`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to toggle admin status' };
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete user' };
    }
  }
};

// Message services
export const messageService = {
  sendMessage: async (messageData) => {
    try {
      console.log("Sending to API:", messageData);
      const response = await api.post('/messages', messageData);
      console.log("API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Message send error details:", error);
      if (error.response) {
        return error.response.data || { success: false, message: 'Failed to send message' };
      } else {
        return { success: false, message: 'Failed to send message' };
      }
    }
  },

  getMessages: async () => {
    try {
      const response = await api.get('/messages');
      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  },

  deleteMessage: async (id) => {
    try {
      const response = await api.delete(`/messages/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete message' };
    }
  }
};

export default api; 