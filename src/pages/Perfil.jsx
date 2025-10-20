import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Perfil() {
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [alertasPerfil, setAlertasPerfil] = useState([]);

  useEffect(() => {
    const datosGuardados = localStorage.getItem('usuarioActivo');
    if (datosGuardados) {
      try {
        const usuario = JSON.parse(datosGuardados);
        setUsuarioActivo(usuario);
        const alertas = [];
        if (!usuario.telefono) {
          alertas.push('Agrega un teléfono de contacto para coordinar entregas express.');
        }
        if (!usuario.ciudad) {
          alertas.push('Define tu ciudad principal para calcular plazos de despacho.');
        }
        setAlertasPerfil(alertas);
      } catch (error) {
        console.error('No fue posible leer los datos del usuario activo:', error);
        setUsuarioActivo(null);
        setAlertasPerfil([
          'Los datos almacenados están dañados. Vuelve a iniciar sesión o registra una cuenta nuevamente.',
        ]);
      }
    } else {
      setAlertasPerfil([]);
    }
  }, []);

  return (
    <section className="perfil-page py-5 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-7">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4 p-lg-5">
                <h1 className="h3 fw-bold text-danger mb-3">Perfil de usuario</h1>
                <p className="text-muted mb-4">
                  Revisa tus datos personales, direcciones asociadas y preferencias de compra. Esta
                  sección se actualiza automáticamente al realizar cambios desde el formulario de
                  registro o edición del perfil.
                </p>
                {alertasPerfil.length > 0 && (
                  <div className="alert alert-info" role="alert">
                    <p className="mb-2 fw-semibold">Recomendaciones rápidas:</p>
                    <ul className="mb-0 ps-3">
                      {alertasPerfil.map((mensaje, indice) => (
                        <li key={indice}>{mensaje}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {usuarioActivo ? (
                  <div className="vstack gap-3">
                    <div>
                      <h2 className="h6 text-uppercase text-secondary mb-1">Datos personales</h2>
                      <p className="mb-0 fw-semibold">{usuarioActivo.nombre}</p>
                      <p className="mb-0 text-muted">{usuarioActivo.email}</p>
                    </div>
                    <div>
                      <h2 className="h6 text-uppercase text-secondary mb-1">Contacto</h2>
                      <p className="mb-0">
                        {usuarioActivo.telefono || 'Teléfono pendiente de completar'}
                      </p>
                      <p className="mb-0 text-muted">
                        Ciudad preferida de despacho: {usuarioActivo.ciudad || 'Sin definir'}
                      </p>
                    </div>
                    <div>
                      <h2 className="h6 text-uppercase text-secondary mb-1">Preferencias</h2>
                      <p className="mb-0 text-muted">
                        Última actualización: {usuarioActivo.actualizadoEl || 'sin registro'}
                      </p>
                      <p className="mb-0 text-muted">
                        Notificaciones: {usuarioActivo.notificaciones || 'activas por defecto'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-warning" role="alert">
                    <h2 className="h6 mb-2">No hay una sesión activa</h2>
                    <p className="mb-3">
                      Inicia sesión para sincronizar tu perfil o crea una cuenta gratuita en caso de
                      que aún no estés registrado.
                    </p>
                    <div className="d-flex gap-2">
                      <Link to="/login" className="btn btn-danger btn-sm">
                        Ir a iniciar sesión
                      </Link>
                      <Link to="/registro" className="btn btn-outline-danger btn-sm">
                        Crear una cuenta
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h2 className="h6 text-uppercase text-secondary mb-3">Consejos de seguridad</h2>
                <ul className="list-unstyled mb-0 text-muted small">
                  <li className="mb-2">
                    • Actualiza tu contraseña cada tres meses para mayor resguardo.
                  </li>
                  <li className="mb-2">
                    • Habilita la verificación en dos pasos desde la sección ajustes.
                  </li>
                  <li className="mb-0">
                    • Revisa tu historial de compras para identificar movimientos extraños.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Perfil;
