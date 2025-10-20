import { useState, useEffect } from 'react'
import { useRef } from 'react'
import { obtenerMangas, formatearPrecio } from '../data/mangas'
import { Link } from 'react-router-dom'

const Carrusel = ({ itemsPerSlide = 4 }) => {
  const [mangas, setMangas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [indiceActivo, setIndiceActivo] = useState(0)

  useEffect(() => {
    let mounted = true
    const cargar = async () => {
      setCargando(true)
      try {
        const data = await obtenerMangas()
        if (mounted) setMangas(data)
      } catch (e) {
        console.error(e)
      } finally {
        if (mounted) setCargando(false)
      }
    }
    cargar()
    return () => { mounted = false }
  }, [])

  const chunk = (arr, size) => {
    const res = []
    for (let i = 0; i < arr.length; i += size) {
      res.push(arr.slice(i, i + size))
    }
    return res
  }

  const slides = chunk(mangas, itemsPerSlide)
  const total = slides.length || 1

  const carouselRef = useRef(null)
  const activeSlideRef = useRef(null)

  const actualizarAltura = () => {
    try {
      const cont = carouselRef.current
      const slide = activeSlideRef.current
      if (cont && slide) {
        const h = slide.getBoundingClientRect().height
        cont.style.height = `${h}px`
      }
    } catch (e) {
      // noop
    }
  }
  const prev = () => setIndiceActivo((v) => (v - 1 + total) % total)
  const next = () => setIndiceActivo((v) => (v + 1) % total)

  useEffect(() => {
    // actualizar altura cuando cambie el slide activo o cuando mangas cambien
    actualizarAltura()
    const onResize = () => actualizarAltura()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [indiceActivo, mangas])

  if (cargando) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-danger" role="status" style={{width: '2.5rem', height: '2.5rem'}}>
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  if (mangas.length === 0) {
    return (
      <div className="text-center py-4 text-muted">No hay mangas disponibles</div>
    )
  }

  return (
    <section className="container py-4" style={{ minHeight: '460px', paddingBottom: '3rem' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Destacados</h4>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={prev} aria-label="Anterior">
            <span aria-hidden>‹</span>
          </button>
          <button className="btn btn-outline-secondary" onClick={next} aria-label="Siguiente">
            <span aria-hidden>›</span>
          </button>
        </div>
      </div>

      <div className="carousel" ref={carouselRef}>
        {slides.map((slide, idx) => (
          <div
            key={idx}
            ref={idx === indiceActivo ? activeSlideRef : null}
            className={`carousel-item ${idx === indiceActivo ? 'active' : ''}`}
            style={{ display: idx === indiceActivo ? 'block' : 'none', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
          >
            <div className="row">
              {slide.map(producto => (
                <div key={producto.id} className="col-12 col-sm-6 col-md-3 mb-3">
                  <div className="card h-100 shadow-sm border-0">
                    <img
                      src={producto.imagen}
                      className="card-img-top"
                      alt={producto.nombre}
                      style={{ height: 260, objectFit: 'cover' }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400/cccccc/666666?text=Manga' }}
                      onLoad={actualizarAltura}
                    />
                    <div className="card-body d-flex flex-column">
                      <h6 className="card-title mb-1">{producto.nombre}</h6>
                      <p className="text-muted small mb-2">{producto.autor}</p>
                      <div className="mt-auto d-flex justify-content-between align-items-center">
                        <span className="text-danger fw-bold">{formatearPrecio(producto.precio)}</span>
                        <Link
                          to={`/producto/${producto.id}`}
                          className={`btn btn-sm ${producto.stock === 0 ? 'btn-secondary disabled' : 'btn-outline-danger'}`}
                        >
                          {producto.stock === 0 ? 'Agotado' : 'Ver'}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {total > 1 && (
        <div className="text-center mt-2">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`btn btn-sm me-1 ${i === indiceActivo ? 'btn-danger' : 'btn-outline-secondary'}`}
              onClick={() => setIndiceActivo(i)}
              aria-label={`Ir a slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default Carrusel
