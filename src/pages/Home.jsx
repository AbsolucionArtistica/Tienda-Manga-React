import { Link } from 'react-router-dom'
import Carrusel from '../components/Carrusel'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <div>
      {/* Hero Banner */}
      <header className="text-white text-center py-5 main-color">
        <div className="container">
          <h1 className="display-4 fw-bold mb-3">Bienvenido a MangoManga</h1>
          <p className="lead mb-4">Descubre miles de mangas de calidad al mejor precio</p>
          
          {isAuthenticated ? (
            <div className="d-flex gap-2 justify-content-center">
              <Link to="/tienda" className="btn btn-light btn-lg">Ir a la Tienda</Link>
              <Link to="/orders" className="btn btn-outline-light btn-lg">Mis Órdenes</Link>
            </div>
          ) : (
            <div className="d-flex gap-2 justify-content-center">
              <Link to="/tienda" className="btn btn-light btn-lg">Explorar</Link>
              <Link to="/login" className="btn btn-outline-light btn-lg">Iniciar Sesión</Link>
            </div>
          )}
        </div>
      </header>

      {/* Carrusel de Destacados */}
      <Carrusel />

      {/* Sección de Categorías */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">Categorías</h2>
          <div className="row g-3">
            {[
              { name: 'Shonen', desc: 'Acción y aventura' },
              { name: 'Seinen', desc: 'Maduro e intenso' },
              { name: 'Shoujo', desc: 'Romance y drama' },
              { name: 'Otros', desc: 'Géneros variados' }
            ].map((cat, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <Link
                  to={`/tienda?categoria=${cat.name}`}
                  className="text-decoration-none"
                >
                  <div className="card h-100 shadow-sm border-0 text-center p-4 hover-lift">
                    <h5 className="card-title">{cat.name}</h5>
                    <p className="card-text text-muted small">{cat.desc}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Características */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">¿Por qué elegirnos?</h2>
          <div className="row g-4">
            {[
              {
                title: 'Envío Rápido',
                desc: 'Despacho en 24-48 horas en todo el país'
              },
              {
                title: 'Compra Segura',
                desc: 'Transacciones protegidas con encriptación'
              },
              {
                title: 'Devoluciones',
                desc: '30 días para devolver si no estás satisfecho'
              },
              {
                title: 'Soporte 24/7',
                desc: 'Atención al cliente siempre disponible'
              }
            ].map((feat, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <div className="text-center">
                  <h5>{feat.title}</h5>
                  <p className="text-muted small">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-5 bg-danger text-white text-center">
        <div className="container">
          <h2 className="mb-3">¿Listo para empezar?</h2>
          <p className="lead mb-4">
            Explora nuestro catálogo completo y encontra tu próximo manga favorito
          </p>
          <Link to="/tienda" className="btn btn-light btn-lg">Ir a la Tienda</Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <h3 className="mb-3">Suscríbete a nuestro newsletter</h3>
              <p className="text-muted mb-3">
                Recibe notificaciones sobre nuevos lanzamientos y ofertas exclusivas
              </p>
              <form className="d-flex gap-2">
                <input
                  type="email"
                  className="form-control"
                  placeholder="tu@email.com"
                  required
                />
                <button type="submit" className="btn btn-danger">Enviar</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      <style>{`
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(191, 4, 38, 0.2) !important;
        }
      `}</style>
    </div>
  )
}

export default Home