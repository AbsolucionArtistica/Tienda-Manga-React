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

const productsService = {
  getAll: (params = {}) => {
    return api.get('/productos', { params });
  },

  getById: (id) => {
    return api.get(`/productos/${id}`);
  },

  create: (productData) => {
    return api.post('/productos', productData);
  },

  update: (id, productData) => {
    return api.put(`/productos/${id}`, productData);
  },

  delete: (id) => {
    return api.delete(`/productos/${id}`);
  },
};

export default productsService;
