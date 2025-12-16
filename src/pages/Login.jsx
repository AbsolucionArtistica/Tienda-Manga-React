import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginService } from '../services/authService';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    if (!username.trim()) {
      setError('Debes ingresar un correo registrado.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    // Fallback local (modo examen/tests sin backend)
    const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const existe = usuariosGuardados.find(
      (u) => u.email?.toLowerCase() === username.trim().toLowerCase()
    );
    if (existe && existe.password === password) {
      const usuarioActivo = {
        username: existe.nombre || existe.username || username,
        email: existe.email,
        telefono: existe.telefono,
        direccion: existe.direccion,
        role: existe.role || 'CLIENTE',
        token: existe.token || null,
      };
      localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActivo));
      localStorage.setItem('user', JSON.stringify(usuarioActivo));
      setMensaje('Ingreso correcto. Redirigiendo a tu perfil...');
      setTimeout(() => navigate('/perfil'), 800);
      if (login) {
        login(usuarioActivo);
      }
      return;
    }

    try {
      const data = await loginService(username, password);
      const payload = {
        ...data,
        username: data.username || username,
      };
      localStorage.setItem('usuarioActivo', JSON.stringify(payload));
      if (login) {
        login(payload);
      }
      navigate('/tienda');
    } catch (err) {
      console.error(err);
      setError('Usuario o contraseña incorrectos');
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
                  <h2 className="fw-bold mb-4">Bienvenido de vuelta</h2>
                  <p className="text-white-50 mb-4">
                    Accede a tu cuenta para continuar explorando catálogos exclusivos, guardar tus
                    colecciones y recibir alertas tempranas de lanzamientos.
                  </p>

                  <ul className="list-unstyled text-white-50">
                    <li className="mb-3 d-flex align-items-start">
                      <i className="fas fa-star text-warning me-3 mt-1"></i>
                      <span>
                        Sincroniza tus pedidos y listas de lectura en cualquier dispositivo.
                      </span>
                    </li>
                    <li className="mb-3 d-flex align-items-start">
                      <i className="fas fa-star text-warning me-3 mt-1"></i>
                      <span>
                        Activa recordatorios de reposición para tomos difíciles de conseguir.
                      </span>
                    </li>
                    <li className="mb-3 d-flex align-items-start">
                      <i className="fas fa-star text-warning me-3 mt-1"></i>
                      <span>Accede a preventas privadas y cajas sorpresa temáticas.</span>
                    </li>
                  </ul>
                </div>

                {/* Sección Derecha - Formulario */}
                <div className="col-md-6 p-5 text-white" style={{ backgroundColor: '#151515' }}>
                  <div className="text-center mb-4">
                    <h3 className="text-danger fw-bold">Iniciar sesión</h3>
                  </div>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  {mensaje && (
                    <div className="alert alert-success" role="alert">
                      {mensaje}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                      <label className="form-label text-white-50 small" htmlFor="login-email">
                        Correo electrónico
                      </label>
                      <input
                        type="text"
                        id="login-email"
                        className="form-control bg-dark text-white border-secondary"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="usuario@mangomanga.cl"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <label className="form-label text-white-50 small" htmlFor="login-password">
                          Contraseña
                        </label>
                        <a href="#" className="text-danger small text-decoration-none">
                          ¿Olvidaste tu clave?
                        </a>
                      </div>
                      <input
                        type="password"
                        id="login-password"
                        className="form-control bg-dark text-white border-secondary"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    </div>

                    <div className="mb-4 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input bg-dark border-secondary"
                        id="remember"
                      />
                      <label className="form-check-label text-white-50 small" htmlFor="remember">
                        Mantener sesión activa en este equipo
                      </label>
                    </div>

                    <button type="submit" className="btn btn-danger w-100 py-2 fw-bold mb-4">
                      Entrar a mi cuenta
                    </button>

                    <div className="text-center mb-4">
                      <span className="text-white-50 small">¿Aún no te unes a MangoManga?</span>
                      <div className="mt-2">
                        <Link to="/register" className="btn btn-outline-secondary btn-sm">
                          Crear cuenta nueva
                        </Link>
                      </div>
                    </div>

                    <div
                      className="p-3 rounded border border-secondary border-opacity-25"
                      style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                    >
                      <p className="mb-1 small text-white-50">Consejo rápido:</p>
                      <p className="mb-0 small text-white-50" style={{ fontSize: '0.8rem' }}>
                        Asegura tu cuenta activando la verificación en dos pasos desde tu panel de
                        usuario.
                      </p>
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

export default Login;
