import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register/', userData),
  login: (credentials) => api.post('/auth/token/', credentials),
  profile: () => api.get('/auth/profile/'),
  refreshToken: (refresh) => api.post('/auth/token/refresh/', { refresh }),
};

// Board endpoints
export const boardAPI = {
  list: () => api.get('/boards/'),
  create: (boardData) => api.post('/boards/', boardData),
  get: (id) => api.get(`/boards/${id}/`),
  update: (id, boardData) => api.put(`/boards/${id}/`, boardData),
  delete: (id) => api.delete(`/boards/${id}/`),
  getUsers: (boardId) => api.get(`/boards/${boardId}/users/`),
};

// List endpoints
export const listAPI = {
  create: (listData) => api.post('/lists/', listData),
  update: (id, listData) => api.put(`/lists/${id}/`, listData),
  delete: (id) => api.delete(`/lists/${id}/`),
};

// Task endpoints
export const taskAPI = {
  create: (taskData) => api.post('/tasks/', taskData),
  update: (id, taskData) => api.put(`/tasks/${id}/`, taskData),
  delete: (id) => api.delete(`/tasks/${id}/`),
};

export default api;