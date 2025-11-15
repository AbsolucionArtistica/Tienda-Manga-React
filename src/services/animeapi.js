/**
 * Servicio para integración con API de Jikan (MyAnimeList)
 * Proporciona funciones para buscar y obtener información de mangas
 * API: https://jikan.moe/
 */

const API_BASE_URL = 'https://api.jikan.moe/v4'

/**
 * Busca mangas por título
 * @param {string} query - Término de búsqueda
 * @returns {Promise<Array>} Lista de mangas encontrados
 */
export const buscarMangasPorTitulo = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/manga?query=${encodeURIComponent(query)}&limit=10`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`)
    }

    const data = await response.json()
    
    // Transformar respuesta de Jikan al formato de la app
    if (data.data && data.data.length > 0) {
      return data.data.map(manga => ({
        id: manga.mal_id,
        nombre: manga.title,
        imagen: manga.images?.jpg?.image_url || 'https://via.placeholder.com/300x400?text=Manga',
        descripcion: manga.synopsis || 'Sin descripción',
        precio: 12990,
        stock: 10,
        autor: manga.authors?.[0]?.name || 'Desconocido',
        rating: manga.score || 4.5
      }))
    }
    
    return []
  } catch (error) {
    console.error('Error buscando manga en Jikan:', error)
    throw error
  }
}

/**
 * Obtiene detalles de un manga por ID
 * @param {number} id - ID del manga en MAL (MyAnimeList)
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
    const manga = data.data

    // Transformar a formato de la app
    return {
      id: manga.mal_id,
      nombre: manga.title,
      imagen: manga.images?.jpg?.image_url || 'https://via.placeholder.com/300x400?text=Manga',
      descripcion: manga.synopsis || 'Sin descripción',
      precio: 12990,
      stock: 10,
      autor: manga.authors?.[0]?.name || 'Desconocido',
      editorial: manga.publishers?.[0]?.name || 'Desconocida',
      rating: manga.score || 4.5,
      status: manga.status,
      genres: manga.genres?.map(g => g.name).join(', ') || ''
    }
  } catch (error) {
    console.error('Error obteniendo manga de Jikan:', error)
    throw error
  }
}

/**
 * Obtiene mangas populares
 * @returns {Promise<Array>} Lista de mangas populares
 */
export const obtenerMangasPopulares = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/manga?order_by=score&sort=desc&limit=25`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`)
    }

    const data = await response.json()

    // Transformar respuesta al formato de la app
    if (data.data && data.data.length > 0) {
      return data.data.map(manga => ({
        id: manga.mal_id,
        nombre: manga.title,
        imagen: manga.images?.jpg?.image_url || 'https://via.placeholder.com/300x400?text=Manga',
        descripcion: manga.synopsis || 'Manga popular',
        precio: 12990,
        stock: 10,
        autor: manga.authors?.[0]?.name || 'Desconocido',
        rating: manga.score || 4.5
      }))
    }

    return []
  } catch (error) {
    console.error('Error obteniendo mangas populares de Jikan:', error)
    throw error
  }
}
