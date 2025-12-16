import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerService } from '../services/authService';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await registerService(username, password, email, direccion, telefono);
      navigate('/login');
    } catch (err) {
      setError('Error al registrar usuario: ' + err.message);
    }
  };

  return (
    <main className="login-page d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-lg overflow-hidden border-0 login-card">
              <div className="row g-0">
                {/* Sección Izquierda - Bienvenida */}
                <div className="col-md-6 bg-dark text-white p-5 d-flex flex-column justify-content-center">
                  <h2 className="fw-bold mb-4">Únete a MangoManga</h2>
                  <p className="text-white-50 mb-4">
                    Crea tu cuenta hoy y comienza a disfrutar de todos los beneficios de nuestra
                    comunidad otaku.
                  </p>

                  <ul className="list-unstyled text-white-50">
                    <li className="mb-3 d-flex align-items-start">
                      <i className="fas fa-check-circle text-danger me-3 mt-1"></i>
                      <span>Acceso exclusivo a preventas y ediciones limitadas.</span>
                    </li>
                    <li className="mb-3 d-flex align-items-start">
                      <i className="fas fa-check-circle text-danger me-3 mt-1"></i>
                      <span>Guarda tus mangas favoritos y recibe notificaciones de stock.</span>
                    </li>
                    <li className="mb-3 d-flex align-items-start">
                      <i className="fas fa-check-circle text-danger me-3 mt-1"></i>
                      <span>Historial de compras y seguimiento de pedidos en tiempo real.</span>
                    </li>
                  </ul>
                </div>

                {/* Sección Derecha - Formulario */}
                <div className="col-md-6 p-5 text-white" style={{ backgroundColor: '#151515' }}>
                  <div className="text-center mb-4">
                    <h3 className="text-danger fw-bold">Crear cuenta</h3>
                  </div>

                  {error && <div className="alert alert-danger">{error}</div>}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label text-white-50 small">Nombre de usuario</label>
                      <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Elige un nombre de usuario"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-white-50 small">Correo Electrónico</label>
                      <input
                        type="email"
                        className="form-control bg-dark text-white border-secondary"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ejemplo@correo.com"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-white-50 small">Dirección</label>
                      <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        placeholder="Tu dirección completa"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-white-50 small">Teléfono</label>
                      <input
                        type="tel"
                        className="form-control bg-dark text-white border-secondary"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="+56 9 1234 5678"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-white-50 small">Contraseña</label>
                      <input
                        type="password"
                        className="form-control bg-dark text-white border-secondary"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-white-50 small">Confirmar Contraseña</label>
                      <input
                        type="password"
                        className="form-control bg-dark text-white border-secondary"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repite tu contraseña"
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-danger w-100 py-2 fw-bold mb-4">
                      Registrarse
                    </button>

                    <div className="text-center">
                      <span className="text-white-50 small">¿Ya tienes una cuenta?</span>
                      <div className="mt-2">
                        <Link to="/login" className="btn btn-outline-secondary btn-sm">
                          Iniciar sesión
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
