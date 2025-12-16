import { Link } from 'react-router-dom';
import Carrusel from '../components/Carrusel';

function Home() {
  return (
    <main>
      <header className="text-white text-center py-5 main-color">
        <div className="container">
          <h1 className="display-4">Bienvenido a MangoManga</h1>
          <p className="lead">Los mejores mangas al mejor precio</p>
          <Link to="/tienda" className="btn btn-light mt-3">
            Ver productos
          </Link>
        </div>
      </header>

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4 align-items-center">
            <article className="col-lg-6">
              <h2 className="h4 mb-3">Nuevos lanzamientos cada semana</h2>
              <p className="text-muted">
                Explora colecciones curadas y preventas exclusivas para la comunidad.
              </p>
            </article>
            <article className="col-lg-6">
              <div className="ratio ratio-16x9 shadow-sm">
                <iframe
                  src="https://www.youtube.com/embed/mQvteoFiMlg"
                  title="Video de presentación"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section aria-label="Destacados" className="pb-5">
        <Carrusel />
      </section>
    </main>
  );
}

export default Home;
