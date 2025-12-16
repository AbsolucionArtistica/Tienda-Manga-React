import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { formatearPrecio, obtenerMangas } from '../data/mangas';
import { obtenerMangaPorId } from '../services/animeapi';
import { getMangaById } from '../services/mangaService';

const Producto = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const { agregarAlCarrito } = useCarrito();

  useEffect(() => {
    let mounted = true;

    const cargar = async () => {
      setCargando(true);
      try {
        // 1) Intentar obtener del backend (mangas creados desde el panel admin)
        try {
          const mangaBackend = await getMangaById(id);
          if (mangaBackend && mounted) {
            setProducto({
              id: mangaBackend.id,
              nombre: mangaBackend.titulo,
              autor: mangaBackend.autor,
              editorial: mangaBackend.editorial,
              precio: mangaBackend.precio,
              stock: mangaBackend.stock,
              descripcion: mangaBackend.editorial || 'Sin descripción',
              imagen: mangaBackend.imagenUrl || 'https://via.placeholder.com/400x550?text=Manga',
            });
            return;
          }
        } catch (errorBackend) {
          console.warn('No se pudo obtener del backend, probando API:', errorBackend);
        }

        // 2) Intentar obtener de la API pública
        try {
          const mangaAPI = await obtenerMangaPorId(id);
          if (mangaAPI && mounted) {
            setProducto(mangaAPI);
            return;
          }
        } catch (errorAPI) {
          console.warn('No se pudo obtener de la API, usando datos locales:', errorAPI);
        }

        // 3) Fallback: obtener de datos locales
        const listado = await obtenerMangas();
        if (!mounted) return;
        const encontrado = listado.find((p) => String(p.id) === String(id)) || null;
        setProducto(encontrado);
      } catch (err) {
        console.error('Error cargando mangas:', err);
        if (mounted) setProducto(null);
      } finally {
        if (mounted) setCargando(false);
      }
    };

    cargar();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (cargando) return <div className="container py-5 text-center">Cargando...</div>;

  if (!producto) {
    return (
      <div className="container py-5 text-center">
        <h3>Producto no encontrado</h3>
        <Link to="/tienda" className="btn btn-primary mt-3">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <main className="container py-5">
      <div className="row">
        <div className="col-md-5">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="img-fluid rounded shadow-sm"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x550?text=Manga';
            }}
          />
        </div>
        <div className="col-md-7">
          <h2>{producto.nombre}</h2>
          <p className="text-muted">Autor: {producto.autor}</p>
          {producto.editorial && <p className="text-muted">Editorial: {producto.editorial}</p>}
          <h4 className="text-danger">{formatearPrecio(producto.precio)}</h4>
          <p>{producto.descripcion}</p>
          <div className="d-flex gap-2 mt-3">
            <button
              className="btn btn-danger"
              onClick={() => agregarAlCarrito(producto)}
              disabled={producto.stock === 0}
            >
              {producto.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
            </button>
            <Link to="/tienda" className="btn btn-outline-secondary">
              Volver
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Producto;
