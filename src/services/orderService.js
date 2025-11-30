import api from './api'

const orderService = {
  // Crear una nueva orden
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error creando orden' }
    }
  },

  // Obtener mis órdenes
  getMyOrders: async (page = 1, limit = 10) => {
    try {
      const response = await api.get('/orders/my-orders', {
        params: { page, limit }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error obteniendo órdenes' }
    }
  },

  // Obtener detalle de una orden
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Orden no encontrada' }
    }
  },

  // Cancelar una orden
  cancelOrder: async (orderId) => {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error cancelando orden' }
    }
  },

  // Actualizar estado de orden (admin)
  updateOrderStatus: async (orderId, status, trackingNumber = null) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, {
        status,
        trackingNumber
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error actualizando orden' }
    }
  },

  // Obtener todas las órdenes (admin)
  getAllOrders: async (page = 1, limit = 20, status = null) => {
    try {
      const params = { page, limit }
      if (status) params.status = status
      const response = await api.get('/orders', { params })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error obteniendo órdenes' }
    }
  },

  // Obtener estadísticas de órdenes (admin)
  getOrderStats: async () => {
    try {
      const response = await api.get('/orders/stats')
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error obteniendo estadísticas' }
    }
  }
}

export default orderService
