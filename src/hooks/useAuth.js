import { useAuth } from '../context/AuthContext'

export const useAuthRequired = () => {
  const { isAuthenticated, user } = useAuth()
  
  return {
    isAuthenticated,
    user,
    requireAuth: () => !isAuthenticated
  }
}

export const useAdminRequired = () => {
  const { isAuthenticated, isAdmin } = useAuth()
  
  return {
    isAuthenticated,
    isAdmin: isAdmin(),
    requireAdmin: () => !isAuthenticated || !isAdmin()
  }
}
