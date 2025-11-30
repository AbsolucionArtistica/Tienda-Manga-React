import api from './api'

const authService = {
  // Registro de nuevo usuario
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error en registro' }
    }
  },

  // Login de usuario
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error en login' }
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  // Verificar si hay sesión activa
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken')
  },

  // Verificar si el usuario es admin
  isAdmin: () => {
    const user = authService.getCurrentUser()
    return user?.role === 'admin' || user?.isAdmin === true
  },

  // Actualizar perfil
  updateProfile: async (userId, userData) => {
    try {
      const response = await api.put(`/auth/profile/${userId}`, userData)
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error actualizando perfil' }
    }
  },

  // Cambiar contraseña
  changePassword: async (userId, currentPassword, newPassword) => {
    try {
      const response = await api.post(`/auth/change-password/${userId}`, {
        currentPassword,
        newPassword
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error cambiando contraseña' }
    }
  },

  // Verificar token válido
  checkAuth: async () => {
    try {
      const response = await api.get('/auth/verify')
      return response.data
    } catch (error) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      return null
    }
  }
}

export default authService
