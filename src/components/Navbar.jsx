import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cantidadTotal, abrirCarrito } = useCarrito();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          MangoManga
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/tienda' ? 'active' : ''}`}
                to="/tienda"
              >
                Tienda
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="pages/contacto.html">
                Contacto
              </a>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className="nav-link btn btn-link position-relative text-white"
                onClick={() => abrirCarrito()}
                style={{ textDecoration: 'none' }}
              >
                <i className="fas fa-shopping-cart"></i>
                {cantidadTotal > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cantidadTotal}
                  </span>
                )}
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link btn btn-link p-0 ${
                  location.pathname === '/login' ? 'active' : ''
                }`}
                onClick={() => navigate('/login')}
                aria-label="Ir a iniciar sesión"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-person-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                  <path
                    fillRule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
