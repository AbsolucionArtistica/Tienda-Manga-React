import { useState } from 'react';
import { Link } from 'react-router-dom';

function Registro() {
  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmarPassword: '',
    telefono: '',
    ciudad: '',
  });

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setFormulario((previo) => ({ ...previo, [name]: value }));
  };

  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');

  const manejarSubmit = (evento) => {
    evento.preventDefault();

    const nuevosErrores = {};

    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = 'Indica tu nombre para personalizar tu perfil.';
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(formulario.email.trim())) {
      nuevosErrores.email = 'Proporciona un correo válido, ej: usuario@mangomanga.cl';
    }

    if (formulario.password.length < 6) {
      nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (formulario.password !== formulario.confirmarPassword) {
      nuevosErrores.confirmarPassword = 'Las contraseñas deben coincidir exactamente.';
    }

    if (formulario.telefono && formulario.telefono.length < 8) {
      nuevosErrores.telefono = 'Ingresa un teléfono de contacto válido.';
    }

    if (!formulario.ciudad.trim()) {
      nuevosErrores.ciudad = 'Necesitamos una ciudad para estimar tiempos de envío.';
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      setMensaje('');
      return;
    }

    const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const existeEmail = usuariosGuardados.some(
      (usuario) => usuario.email.toLowerCase() === formulario.email.trim().toLowerCase()
    );

    if (existeEmail) {
      setErrores({ email: 'Este correo ya está registrado, intenta iniciar sesión.' });
      setMensaje('');
      return;
    }

    const nuevoUsuario = {
      nombre: formulario.nombre.trim(),
      email: formulario.email.trim(),
      password: formulario.password,
      telefono: formulario.telefono.trim(),
      ciudad: formulario.ciudad.trim(),
      actualizadoEl: new Date().toLocaleString(),
      notificaciones: 'activas por defecto',
    };

    const usuariosActualizados = [...usuariosGuardados, nuevoUsuario];
    localStorage.setItem('usuarios', JSON.stringify(usuariosActualizados));
    localStorage.setItem('usuarioActivo', JSON.stringify(nuevoUsuario));

    setMensaje('Cuenta creada con éxito. Ya puedes revisar tu perfil.');
    setErrores({});
    setFormulario({
      nombre: '',
      email: '',
      password: '',
      confirmarPassword: '',
      telefono: '',
      ciudad: '',
    });
  };

  return (
    <section className="login-page py-5">
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-lg-6">
            <div className="login-copy bg-light text-dark p-4 p-lg-5 rounded-4 shadow-sm">
              <h1 className="display-5 fw-bold mb-3">Crea tu cuenta</h1>
              <p className="lead mb-4">
                Registrarte en MangoManga te permite guardar pedidos, recibir ofertas exclusivas y
                personalizar tus preferencias de lectura para futuras recomendaciones.
              </p>
              <ul className="list-unstyled mb-0">
                <li className="d-flex align-items-start gap-2 mb-3">
                  <span className="login-icon">★</span>
                  <span>Accede a preventas y lanzamientos con disponibilidad limitada.</span>
                </li>
                <li className="d-flex align-items-start gap-2 mb-3">
                  <span className="login-icon">★</span>
                  <span>Recibe recordatorios de continuidad de colecciones según tus gustos.</span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <span className="login-icon">★</span>
                  <span>Crea listas de seguimiento y wishlist compartidas con amigos.</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-5 ms-lg-auto">
            <div className="card login-card border-0 shadow-sm">
              <div className="card-body p-4 p-lg-5">
                <h2 className="text-center text-danger fw-semibold mb-4">Registro de usuario</h2>
                {mensaje && (
                  <div className="alert alert-success" role="alert">
                    {mensaje}
                  </div>
                )}
                <form onSubmit={manejarSubmit} className="login-form" noValidate>
                  <div className="mb-3">
                    <label htmlFor="registroNombre" className="form-label text-muted">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="registroNombre"
                      name="nombre"
                      value={formulario.nombre}
                      onChange={manejarCambio}
                      placeholder="Ej: Hikaru Nakamura"
                    />
                    {errores.nombre && (
                      <div className="form-text text-danger">{errores.nombre}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="registroEmail" className="form-label text-muted">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="registroEmail"
                      name="email"
                      value={formulario.email}
                      onChange={manejarCambio}
                      placeholder="usuario@mangomanga.cl"
                    />
                    {errores.email && <div className="form-text text-danger">{errores.email}</div>}
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="registroPassword" className="form-label text-muted">
                        Contraseña
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        id="registroPassword"
                        name="password"
                        value={formulario.password}
                        onChange={manejarCambio}
                        placeholder="••••••••"
                      />
                      {errores.password && (
                        <div className="form-text text-danger">{errores.password}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="registroConfirmar" className="form-label text-muted">
                        Confirmar contraseña
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        id="registroConfirmar"
                        name="confirmarPassword"
                        value={formulario.confirmarPassword}
                        onChange={manejarCambio}
                        placeholder="••••••••"
                      />
                      {errores.confirmarPassword && (
                        <div className="form-text text-danger">{errores.confirmarPassword}</div>
                      )}
                    </div>
                  </div>
                  <div className="row g-3 mt-1">
                    <div className="col-md-6">
                      <label htmlFor="registroTelefono" className="form-label text-muted">
                        Teléfono de contacto
                      </label>
                      <input
                        type="tel"
                        className="form-control form-control-lg"
                        id="registroTelefono"
                        name="telefono"
                        value={formulario.telefono}
                        onChange={manejarCambio}
                        placeholder="Ej: +56 9 1234 5678"
                      />
                      {errores.telefono && (
                        <div className="form-text text-danger">{errores.telefono}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="registroCiudad" className="form-label text-muted">
                        Ciudad de envío
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="registroCiudad"
                        name="ciudad"
                        value={formulario.ciudad}
                        onChange={manejarCambio}
                        placeholder="Ej: Santiago"
                      />
                      {errores.ciudad && (
                        <div className="form-text text-danger">{errores.ciudad}</div>
                      )}
                    </div>
                  </div>
                  <button type="submit" className="btn btn-danger w-100 btn-lg mt-4">
                    Crear cuenta
                  </button>
                </form>
                <div className="text-center mt-4">
                  <p className="mb-2 text-muted">¿Ya tienes una cuenta activa?</p>
                  <Link to="/login" className="btn btn-outline-danger btn-sm px-4">
                    Ir a iniciar sesión
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Registro;
