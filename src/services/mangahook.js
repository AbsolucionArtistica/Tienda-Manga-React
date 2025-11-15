/**
 * Servicio para integración con API de MangaHook
 * Proporciona funciones para buscar y obtener información de mangas
 * API: https://mangahook-api.vercel.app
 */

const API_BASE_URL = import.meta.env.VITE_MANGAHOOK_API_URL || 'https://mangahook-api.vercel.app/api'

/**
 * Obtiene detalles completos de un manga por ID
 * @param {string|number} id - ID del manga (ej: "manga-oa952283")
 * @returns {Promise<Object>} Datos completos del manga
 */
export const obtenerMangaPorId = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/manga/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`)
    }

    const data = await response.json()
    
    // Transformar la respuesta de la API al formato que espera la app
    return {
      id: id,
      nombre: data.name || data.title,
      autor: data.author,
      descripcion: data.genres ? data.genres.join(', ') : 'Sin descripción',
      imagen: data.imageUrl,
      precio: 12990, // Precio por defecto (la API no incluye precio)
      stock: 10, // Stock por defecto
      editorial: data.status || 'Desconocida',
      rating: 4.5 // Rating por defecto
    }
  } catch (error) {
    console.error('Error obteniendo manga de MangaHook:', error)
    throw error
  }
}

/**
 * Busca mangas por título
 * @param {string} query - Término de búsqueda
 * @param {number} page - Número de página (opcional)
 * @returns {Promise<Array>} Lista de mangas encontrados
 */
export const buscarMangaPorTitulo = async (query, page = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/search/${encodeURIComponent(query)}?page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`)
    }

    const data = await response.json()
    
    // Transformar resultados de búsqueda al formato de la app
    if (data.mangaList && data.mangaList.length > 0) {
      return data.mangaList.map(manga => ({
        id: manga.id,
        nombre: manga.title,
        imagen: manga.image,
        descripcion: 'Manga encontrado',
        precio: 12990,
        stock: 10,
        rating: 4.5
      }))
    }
    
    return []
  } catch (error) {
    console.error('Error buscando manga en MangaHook:', error)
    throw error
  }
}

/**
 * Obtiene la lista general de mangas
 * @param {Object} opciones - Opciones de filtrado (page, category, type, state)
 * @returns {Promise<Array>} Lista de mangas
 */
export const obtenerMangas = async (opciones = {}) => {
  try {
    const params = new URLSearchParams()
    
    if (opciones.page) params.append('page', opciones.page)
    if (opciones.category) params.append('category', opciones.category)
    if (opciones.type) params.append('type', opciones.type)
    if (opciones.state) params.append('state', opciones.state)
    
    const response = await fetch(`${API_BASE_URL}/mangaList?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`)
    }

    const data = await response.json()
    
    // Transformar resultados al formato de la app
    if (data.mangaList && data.mangaList.length > 0) {
      return data.mangaList.map(manga => ({
        id: manga.id,
        nombre: manga.title,
        imagen: manga.image,
        descripcion: manga.description || 'Manga disponible',
        precio: 12990,
        stock: 10,
        rating: 4.5
      }))
    }
    
    return []
  } catch (error) {
    console.error('Error obteniendo mangas de MangaHook:', error)
    throw error
  }
}
