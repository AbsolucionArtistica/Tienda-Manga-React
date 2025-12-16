import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { formatearPrecio, obtenerMangas } from '../data/mangas';
import {
  buscarMangasPorTitulo,
  obtenerMangasPopulares,
  obtenerMangasPorGenero,
} from '../services/animeapi';
import { getAllMangas } from '../services/mangaService';

const generosAPI = [
  { id: 'todos', nombre: 'Todos', jikanId: null },
  { id: 'action', nombre: 'Acción', jikanId: 1 },
  { id: 'adventure', nombre: 'Aventura', jikanId: 2 },
  { id: 'comedy', nombre: 'Comedia', jikanId: 4 },
  { id: 'drama', nombre: 'Drama', jikanId: 8 },
  { id: 'fantasy', nombre: 'Fantasía', jikanId: 10 },
  { id: 'horror', nombre: 'Horror', jikanId: 14 },
  { id: 'romance', nombre: 'Romance', jikanId: 22 },
  { id: 'scifi', nombre: 'Sci-Fi', jikanId: 24 },
  { id: 'shoujo', nombre: 'Shoujo', jikanId: 25 },
  { id: 'shounen', nombre: 'Shounen', jikanId: 27 },
  { id: 'slice', nombre: 'Slice of Life', jikanId: 36 },
];

const Tienda = () => {
  const { agregarAlCarrito } = useCarrito();
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('todos');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [cargando, setCargando] = useState(true);
  const productosPorPagina = 8;

  useEffect(() => {
    const cargarProductos = async () => {
      setCargando(true);
      let mangasBackend = [];
      let mangasApi = [];

      try {
        // 1. Intentar cargar del Backend
        try {
          const data = await getAllMangas();
          if (data && data.length > 0) {
            mangasBackend = data.map((m) => ({
              id: m.id,
              nombre: m.titulo,
              autor: m.autor,
              precio: m.precio,
              stock: m.stock,
              imagen: m.imagenUrl || 'https://via.placeholder.com/300x400?text=Manga',
              descripcion: m.editorial || 'Sin descripción',
              rating: 5,
              generos: ['Shounen'], // Por defecto para productos locales
            }));
          }
        } catch (errorBackend) {
          console.warn('Backend no disponible o vacío:', errorBackend);
        }

        // 2. Cargar de la API (siempre, para complementar)
        try {
          mangasApi = await obtenerMangasPopulares();
        } catch (errorApi) {
          console.error('Error API:', errorApi);
          // Si falla API y no hay backend, usar local
          if (mangasBackend.length === 0) {
            const dataLocal = obtenerMangas();
            mangasApi = dataLocal;
          }
        }

        // 3. Combinar (Backend primero)
        const combinados = [...mangasBackend, ...mangasApi];

        // Eliminar duplicados por ID si los hubiera (aunque IDs de backend y API deberían ser distintos)
        const unicos = combinados.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);

        setProductos(unicos);
        setProductosFiltrados(unicos);
      } catch (error) {
        console.error('Error general al cargar productos:', error);
      } finally {
        setCargando(false);
      }
    };
    cargarProductos();
  }, []);

  useEffect(() => {
    const filtrar = async () => {
      let productosFiltrados = productos;

      if (terminoBusqueda) {
        try {
          const resultadosBusqueda = await buscarMangasPorTitulo(terminoBusqueda);
          if (resultadosBusqueda && resultadosBusqueda.length > 0) {
            productosFiltrados = resultadosBusqueda;
          } else {
            productosFiltrados = productos.filter(
              (producto) =>
                producto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
                producto.autor.toLowerCase().includes(terminoBusqueda.toLowerCase())
            );
          }
        } catch (error) {
          productosFiltrados = productos.filter(
            (producto) =>
              producto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
              producto.autor.toLowerCase().includes(terminoBusqueda.toLowerCase())
          );
        }
      } else {
        if (categoriaActiva !== 'todos') {
          const generoSeleccionado = generosAPI.find((g) => g.id === categoriaActiva);
          if (generoSeleccionado && generoSeleccionado.jikanId) {
            try {
              productosFiltrados = await obtenerMangasPorGenero(generoSeleccionado.jikanId);
            } catch (error) {
              productosFiltrados = productos.filter((producto) =>
                producto.generos?.some((g) =>
                  g.toLowerCase().includes(generoSeleccionado.nombre.toLowerCase())
                )
              );
            }
          }
        }
      }

      setProductosFiltrados(productosFiltrados);
      setPaginaActual(1);
    };

    filtrar();
  }, [productos, categoriaActiva, terminoBusqueda]);

  const indiceInicio = (paginaActual - 1) * productosPorPagina;
  const indiceFin = indiceInicio + productosPorPagina;
  const productosActuales = productosFiltrados.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  const manejarCambioCategoria = (categoria) => {
    setCategoriaActiva(categoria);
  };

  const manejarBusqueda = (e) => {
    setTerminoBusqueda(e.target.value);
  };

  const manejarCambioPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const manejarAgregarAlCarrito = (e, producto) => {
    e.preventDefault();
    agregarAlCarrito(producto);

    const button = e.currentTarget;
    const originalHTML = button.innerHTML;

    const icon = document.createElement('i');
    icon.className = 'fas fa-check me-1';

    button.textContent = '¡Agregado!';
    button.prepend(icon);
    button.disabled = true;

    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.disabled = producto.stock === 0;
    }, 1500);
  };

  if (cargando) {
    return (
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div
            className="spinner-border text-danger"
            role="status"
            style={{ width: '3rem', height: '3rem' }}
          >
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container-fluid py-4" role="main">
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

      <div className="row mb-4">
        <div className="col-md-8">
          <div className="d-flex flex-wrap gap-2 mb-3">
            {generosAPI.map((genero) => (
              <button
                key={genero.id}
                className={`btn ${
                  categoriaActiva === genero.id ? 'btn-danger' : 'btn-outline-danger'
                }`}
                onClick={() => manejarCambioCategoria(genero.id)}
              >
                {genero.nombre}
              </button>
            ))}
          </div>
        </div>
        <div className="col-md-4">
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

      <div className="row mb-3">
        <div className="col-12">
          <p className="text-muted">
            Mostrando {productosActuales.length} de {productosFiltrados.length} productos
            {categoriaActiva !== 'todos' &&
              ` en la categoría "${generosAPI.find((g) => g.id === categoriaActiva)?.nombre}"`}
            {terminoBusqueda && ` que coinciden con "${terminoBusqueda}"`}
          </p>
        </div>
      </div>

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
          productosActuales.map((producto) => (
            <div key={producto.id} className="col-12 col-sm-6 col-md-3 mb-3">
              <div className="card h-100 shadow-sm border-0">
                <Link to={`/producto/${producto.id}`}>
                  <img
                    src={producto.imagen}
                    className="card-img-top"
                    alt={producto.nombre}
                    style={{ height: 260, objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x400?text=Manga';
                    }}
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
                  const numeroPagina = index + 1;
                  return (
                    <li
                      key={numeroPagina}
                      className={`page-item ${paginaActual === numeroPagina ? 'active' : ''}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => manejarCambioPagina(numeroPagina)}
                      >
                        {numeroPagina}
                      </button>
                    </li>
                  );
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
    </main>
  );
};

export default Tienda;
