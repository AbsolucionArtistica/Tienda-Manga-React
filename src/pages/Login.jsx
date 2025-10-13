import { Link } from 'react-router-dom';

function Login() {
  return (
    <section className="login-page py-5">
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-lg-6">
            <div className="login-copy text-white p-4 p-lg-5 rounded-4 shadow-sm">
              <h1 className="display-5 fw-bold mb-3">Bienvenido de vuelta</h1>
              <p className="lead mb-4">
                Accede a tu cuenta para continuar explorando catálogos exclusivos, guardar tus
                colecciones y recibir alertas tempranas de lanzamientos.
              </p>
              <ul className="list-unstyled mb-0">
                <li className="d-flex align-items-start gap-2 mb-3">
                  <span className="login-icon">★</span>
                  <span>Sincroniza tus pedidos y listas de lectura en cualquier dispositivo.</span>
                </li>
                <li className="d-flex align-items-start gap-2 mb-3">
                  <span className="login-icon">★</span>
                  <span>Activa recordatorios de reposición para tomos difíciles de conseguir.</span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <span className="login-icon">★</span>
                  <span>Accede a preventas privadas y cajas sorpresa temáticas.</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-5 ms-lg-auto">
            <div className="card login-card border-0 shadow-sm">
              <div className="card-body p-4 p-lg-5">
                <h2 className="text-center text-danger fw-semibold mb-4">Iniciar sesión</h2>
                <form className="login-form">
                  <div className="mb-3">
                    <label htmlFor="loginEmail" className="form-label text-muted">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="loginEmail"
                      placeholder="usuario@mangomanga.cl"
                    />
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <label htmlFor="loginPassword" className="form-label text-muted">
                        Contraseña
                      </label>
                      <a className="text-decoration-none text-danger small" href="#">
                        ¿Olvidaste tu clave?
                      </a>
                    </div>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="loginPassword"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="form-check mb-4">
                    <input className="form-check-input" type="checkbox" id="loginRemember" />
                    <label className="form-check-label text-muted" htmlFor="loginRemember">
                      Mantener sesión activa en este equipo
                    </label>
                  </div>
                  <button type="submit" className="btn btn-danger w-100 btn-lg">
                    Entrar a mi cuenta
                  </button>
                </form>
                <div className="text-center mt-4">
                  <p className="mb-2 text-muted">¿Aún no te unes a MangoManga?</p>
                  <Link to="/registro" className="btn btn-outline-danger btn-sm px-4">
                    Crear cuenta nueva
                  </Link>
                </div>
                <div className="login-policy mt-4 p-3 rounded">
                  <p className="small text-muted mb-1">Consejo rápido:</p>
                  <p className="small text-muted mb-0">
                    Asegura tu cuenta activando la verificación en dos pasos desde tu panel de
                    usuario. Solo requiere una app de autenticación y reduce drásticamente intentos
                    de acceso indebido.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
