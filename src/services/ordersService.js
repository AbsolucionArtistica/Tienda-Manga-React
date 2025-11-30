import api from './api';

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
