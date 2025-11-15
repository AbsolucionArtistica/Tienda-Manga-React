import { useState, useEffect } from 'react'
import { obtenerMangas, categorias, formatearPrecio } from '../data/mangas'
import { buscarMangasPorTitulo, obtenerMangasPopulares } from '../services/animeapi'
import { useCarrito } from '../context/CarritoContext'
import { Link } from 'react-router-dom'

const Tienda = () => {
  // Estado para manejar los productos y filtros
  const [productos, setProductos] = useState([])
  const [productosFiltrados, setProductosFiltrados] = useState([])
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')
  const [terminoBusqueda, setTerminoBusqueda] = useState('')
  const [paginaActual, setPaginaActual] = useState(1)
  const [cargando, setCargando] = useState(true)

  // Hook del carrito
  const { agregarAlCarrito } = useCarrito()

  const productosPorPagina = 12

  // Simular carga de datos desde el archivo externo
  useEffect(() => {
    const cargarProductos = async () => {
      setCargando(true)
      try {
        // Intentar obtener de la API
        try {
          const mangasAPI = await obtenerMangasPopulares()
          if (mangasAPI && mangasAPI.length > 0) {
            setProductos(mangasAPI)
            setProductosFiltrados(mangasAPI)
            return
          }
        } catch (errorAPI) {
          console.warn('No se pudo obtener de la API, usando datos locales:', errorAPI)
        }

        // Fallback: datos locales
        const mangasObtenidos = await obtenerMangas()
        setProductos(mangasObtenidos)
        setProductosFiltrados(mangasObtenidos)
      } catch (error) {
        console.error('Error al cargar los mangas:', error)
      } finally {
        setCargando(false)
      }
    }

    cargarProductos()
  }, [])

  // Filtrar productos por categoría y búsqueda
  useEffect(() => {
    const filtrar = async () => {
      let productosFiltrados = productos

      // Si hay término de búsqueda, intentar buscar en la API
      if (terminoBusqueda) {
        try {
          const resultadosBusqueda = await buscarMangasPorTitulo(terminoBusqueda)
          if (resultadosBusqueda && resultadosBusqueda.length > 0) {
            productosFiltrados = resultadosBusqueda
          } else {
            // Si la API no devuelve resultados, filtrar locales
            productosFiltrados = productos.filter(producto =>
              producto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
              producto.autor.toLowerCase().includes(terminoBusqueda.toLowerCase())
            )
          }
        } catch (error) {
          console.warn('Error en búsqueda de API, usando filtro local:', error)
          // Filtrar localmente si la API falla
          productosFiltrados = productos.filter(producto =>
            producto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
            producto.autor.toLowerCase().includes(terminoBusqueda.toLowerCase())
          )
        }
      } else {
        // Filtrar por categoría si no hay búsqueda
        if (categoriaActiva !== 'Todos') {
          productosFiltrados = productosFiltrados.filter(
            producto => producto.categoria === categoriaActiva
          )
        }
      }

      setProductosFiltrados(productosFiltrados)
      setPaginaActual(1)
    }

    filtrar()
  }, [productos, categoriaActiva, terminoBusqueda])

  // Calcular productos para la página actual
  const indiceInicio = (paginaActual - 1) * productosPorPagina
  const indiceFin = indiceInicio + productosPorPagina
  const productosActuales = productosFiltrados.slice(indiceInicio, indiceFin)
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina)

  // Funciones de manejo
  const manejarCambioCategoria = (categoria) => {
    setCategoriaActiva(categoria)
  }

  const manejarBusqueda = (e) => {
    setTerminoBusqueda(e.target.value)
  }

  const manejarCambioPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const manejarAgregarAlCarrito = (e, producto) => {
    e.preventDefault()
    agregarAlCarrito(producto)

    const button = e.currentTarget
    const originalHTML = button.innerHTML

    // Crear <i> con clases sin inyectar string HTML
    const icon = document.createElement('i')
    icon.className = 'fas fa-check me-1'

    // Actualizar botón de forma segura
    button.textContent = '¡Agregado!'
    button.prepend(icon)
    button.disabled = true

    setTimeout(() => {
      button.innerHTML = originalHTML
      button.disabled = producto.stock === 0
    }, 1500)
  }

  const renderizarEstrellasRating = (rating) => {
    const estrellas = []
    const estrellasCompletas = Math.floor(rating)
    const tieneMediaEstrella = rating % 1 !== 0

    for (let i = 0; i < estrellasCompletas; i++) {
      estrellas.push(<span key={i} className="text-warning">★</span>)
    }

    if (tieneMediaEstrella) {
      estrellas.push(<span key="half" className="text-warning">☆</span>)
    }

    const estrellasVacias = 5 - Math.ceil(rating)
    for (let i = 0; i < estrellasVacias; i++) {
      estrellas.push(<span key={`empty-${i}`} className="text-muted">☆</span>)
    }

    return estrellas
  }

  if (cargando) {
    return (
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-danger" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando productos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid py-4">
      {/* Header de la tienda */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="text-center mb-4">
            <h1 className="display-4 fw-bold text-dark">
              <span className="text-danger">Manga</span> Store
            </h1>
            <p className="lead text-muted">Descubre tu próximo manga favorito</p>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="row mb-4">
        <div className="col-md-8">
          {/* Categorías */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            {categorias.map(categoria => (
              <button
                key={categoria}
                className={`btn ${categoriaActiva === categoria ? 'btn-danger' : 'btn-outline-danger'}`}
                onClick={() => manejarCambioCategoria(categoria)}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>
        <div className="col-md-4">
          {/* Búsqueda */}
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar manga o autor..."
              value={terminoBusqueda}
              onChange={manejarBusqueda}
            />
            <span className="input-group-text">
              <i className="fas fa-search"></i>
            </span>
          </div>
        </div>
      </div>

      {/* Información de resultados */}
      <div className="row mb-3">
        <div className="col-12">
          <p className="text-muted">
            Mostrando {productosActuales.length} de {productosFiltrados.length} productos
            {categoriaActiva !== 'Todos' && ` en la categoría "${categoriaActiva}"`}
            {terminoBusqueda && ` que coinciden con "${terminoBusqueda}"`}
          </p>
        </div>
      </div>

      {/* Grid de productos */}
      <div className="row">
        {productosActuales.length === 0 ? (
          <div className="col-12 text-center py-5">
            <div className="text-muted">
              <i className="fas fa-search fa-3x mb-3"></i>
              <h4>No se encontraron productos</h4>
              <p>Intenta con otros términos de búsqueda o categoría</p>
            </div>
          </div>
        ) : (
          productosActuales.map(producto => (
            <div key={producto.id} className="col-12 col-sm-6 col-md-3 mb-3">
              <div className="card h-100 shadow-sm border-0">
                <Link to={`/producto/${producto.id}`}>
                  <img
                    src={producto.imagen}
                    className="card-img-top"
                    alt={producto.nombre}
                    style={{ height: 260, objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=Manga' }}
                  />
                </Link>
                <div className="card-body d-flex flex-column">
                  <Link to={`/producto/${producto.id}`} className="text-decoration-none">
                    <h6 className="card-title mb-1">{producto.nombre}</h6>
                  </Link>
                  <p className="text-muted small mb-2">{producto.autor}</p>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="text-danger fw-bold">{formatearPrecio(producto.precio)}</span>
                    <Link to={`/producto/${producto.id}`} className="btn btn-sm btn-outline-danger">
                      Ver
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="row mt-4">
          <div className="col-12">
            <nav aria-label="Paginación de productos">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => manejarCambioPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                </li>
                
                {[...Array(totalPaginas)].map((_, index) => {
                  const numeroPagina = index + 1
                  return (
                    <li key={numeroPagina} className={`page-item ${paginaActual === numeroPagina ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => manejarCambioPagina(numeroPagina)}
                      >
                        {numeroPagina}
                      </button>
                    </li>
                  )
                })}
                
                <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => manejarCambioPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tienda