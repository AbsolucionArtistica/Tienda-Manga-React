import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para añadir token a cada request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const ordersService = {
  getAll: () => {
    return api.get('/ordenes');
  },

  getById: (id) => {
    return api.get(`/ordenes/${id}`);
  },

  create: (orderData) => {
    return api.post('/ordenes', orderData);
  },

  updateStatus: (id, statusData) => {
    return api.put(`/ordenes/${id}`, statusData);
  },
};

export default ordersService;
