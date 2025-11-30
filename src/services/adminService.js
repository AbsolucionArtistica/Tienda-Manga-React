import api from './api'

const adminService = {
  // Crear nuevo producto
  createProduct: async (productData) => {
    try {
      const response = await api.post('/admin/products', productData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error creando producto' }
    }
  },

  // Actualizar producto
  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/admin/products/${productId}`, productData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error actualizando producto' }
    }
  },

  // Eliminar producto
  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/admin/products/${productId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error eliminando producto' }
    }
  },

  // Obtener estadísticas del dashboard
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard/stats')
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error obteniendo estadísticas' }
    }
  },

  // Obtener órdenes para admin
  getOrdersForAdmin: async (page = 1, limit = 20, status = null) => {
    try {
      const params = { page, limit }
      if (status) params.status = status
      const response = await api.get('/admin/orders', { params })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error obteniendo órdenes' }
    }
  },

  // Obtener todos los usuarios (admin)
  getAllUsers: async (page = 1, limit = 20) => {
    try {
      const response = await api.get('/admin/users', { params: { page, limit } })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error obteniendo usuarios' }
    }
  },

  // Obtener resumen de ventas
  getSalesReport: async (startDate, endDate) => {
    try {
      const response = await api.get('/admin/reports/sales', {
        params: { startDate, endDate }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error obteniendo reporte' }
    }
  }
}

export default adminService
