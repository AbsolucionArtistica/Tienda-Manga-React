import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { cantidadTotal, abrirCarrito } = useCarrito();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          MangoManga
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/tienda' ? 'active' : ''}`} to="/tienda">
                Tienda
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contacto">
                Contacto
              </Link>
            </li>

            {user && user.role === 'ADMIN' && (
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`} to="/admin/mangas">
                  Admin
                </Link>
              </li>
            )}

            <li className="nav-item ms-2">
              <button
                type="button"
                className="nav-link btn btn-link position-relative text-white p-0"
                onClick={abrirCarrito}
              >
                <i className="fas fa-shopping-cart fa-lg"></i>
                {cantidadTotal > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.6rem'}}>
                    {cantidadTotal}
                  </span>
                )}
              </button>
            </li>

            <li className="nav-item ms-3">
              {user ? (
                <div className="dropdown">
                  <button
                    className="nav-link btn btn-link text-white p-0"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fas fa-user-circle fa-lg"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><Link className="dropdown-item fw-bold" to="/perfil">Hola, {user.username}</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Cerrar Sesión</button></li>
                  </ul>
                </div>
              ) : (
                <Link className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`} to="/login">
                  <i className="fas fa-user-circle fa-lg"></i>
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
