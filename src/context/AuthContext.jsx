import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verificar sesión al cargar
  useEffect(() => {
    const initAuth = () => {
      const savedToken = localStorage.getItem('authToken')
      const savedUser = localStorage.getItem('user')
      
      if (savedToken && savedUser) {
        setToken(savedToken)
        try {
          setUser(JSON.parse(savedUser))
        } catch (error) {
          console.error('Error parsing user:', error)
          localStorage.removeItem('user')
          localStorage.removeItem('authToken')
        }
      }
      
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const response = await authService.login(email, password)
      setToken(response.token)
      setUser(response.user)
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message || 'Error en login' }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    try {
      const response = await authService.register(userData)
      setToken(response.token)
      setUser(response.user)
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message || 'Error en registro' }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setToken(null)
  }

  const updateProfile = async (userData) => {
    try {
      const response = await authService.updateProfile(user.id, userData)
      setUser(response.user)
      localStorage.setItem('user', JSON.stringify(response.user))
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message || 'Error actualizando perfil' }
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await authService.changePassword(user.id, currentPassword, newPassword)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message || 'Error cambiando contraseña' }
    }
  }

  const isAdmin = () => {
    return user?.role === 'admin' || user?.isAdmin === true
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
