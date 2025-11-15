import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { obtenerMangas, formatearPrecio } from '../data/mangas'
import { buscarMangaPorTitulo } from '../services/mangahook'
import { useCarrito } from '../context/CarritoContext'

const Producto = () => {
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const { agregarAlCarrito } = useCarrito()

  useEffect(() => {
    let mounted = true

    const cargar = async () => {
      setCargando(true)
      try {
        const listado = await obtenerMangas()
        if (!mounted) return
        const encontrado = listado.find(p => String(p.id) === String(id)) || null
        setProducto(encontrado)

        // Intentar enriquecer los datos con la API externa (Manga Hook)
        // Si la API no está configurada o falla, se usará el producto local.
        try {
          if (encontrado) {
            const remote = await buscarMangaPorTitulo(encontrado.nombre)
            if (remote && mounted) {
              setProducto(prev => ({
                ...prev,
                imagen: remote.image || prev.imagen,
                descripcion: remote.description || prev.descripcion
              }))
            }
          }
        } catch (err) {
          // No impedir que la página cargue si falla la integración
          console.warn('No se pudo enriquecer con MangaHook:', err)
        }
      } catch (err) {
        console.error('Error cargando mangas:', err)
        if (mounted) setProducto(null)
      } finally {
        if (mounted) setCargando(false)
      }
    }

    cargar()
    return () => { mounted = false }
  }, [id])

  if (cargando) return <div className="container py-5 text-center">Cargando...</div>

  if (!producto) {
    return (
      <div className="container py-5 text-center">
        <h3>Producto no encontrado</h3>
        <Link to="/tienda" className="btn btn-primary mt-3">Volver a la tienda</Link>
      </div>
    )
  }

  return (
    <main className="container py-5">
      <div className="row">
        <div className="col-md-5">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="img-fluid rounded shadow-sm"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/400x550?text=Manga' }}
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
            <Link to="/tienda" className="btn btn-outline-secondary">Volver</Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Producto