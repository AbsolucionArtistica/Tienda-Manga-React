import api from './api'
import { mangasData } from '../data/mangas' // Fallback local

const productService = {
  // Obtener todos los productos con filtros y paginación
  getProducts: async (page = 1, limit = 12, category = null, search = null) => {
    try {
      const params = { page, limit }
      if (category && category !== 'Todos') params.category = category
      if (search) params.search = search

      const response = await api.get('/products', { params })
      return response.data
    } catch (error) {
      // Si falla la API, usar datos locales
      console.warn('Usando datos locales de mangas')
      let products = [...mangasData]
      
      if (category && category !== 'Todos') {
        products = products.filter(p => p.categoria === category)
      }
      
      if (search) {
        products = products.filter(p =>
          p.nombre.toLowerCase().includes(search.toLowerCase()) ||
          p.autor.toLowerCase().includes(search.toLowerCase())
        )
      }

      const start = (page - 1) * limit
      const end = start + limit
      
      return {
        data: products.slice(start, end),
        total: products.length,
        page,
        limit,
        pages: Math.ceil(products.length / limit)
      }
    }
  },

  // Obtener un producto específico
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`)
      return response.data
    } catch (error) {
      // Fallback: buscar en datos locales
      const product = mangasData.find(p => String(p.id) === String(id))
      if (product) return { data: product }
      throw error.response?.data || { message: 'Producto no encontrado' }
    }
  },

  // Obtener productos por categoría
  getByCategory: async (category) => {
    try {
      const response = await api.get(`/products/category/${category}`)
      return response.data
    } catch (error) {
      const products = mangasData.filter(p => p.categoria === category)
      return { data: products }
    }
  },

  // Buscar productos
  searchProducts: async (query) => {
    try {
      const response = await api.get('/products/search', { params: { q: query } })
      return response.data
    } catch (error) {
      const products = mangasData.filter(p =>
        p.nombre.toLowerCase().includes(query.toLowerCase()) ||
        p.autor.toLowerCase().includes(query.toLowerCase())
      )
      return { data: products }
    }
  },

  // Obtener productos relacionados
  getRelatedProducts: async (productId, category) => {
    try {
      const response = await api.get(`/products/${productId}/related`)
      return response.data
    } catch (error) {
      const related = mangasData
        .filter(p => p.categoria === category && p.id !== productId)
        .slice(0, 4)
      return { data: related }
    }
  }
}

export default productService
