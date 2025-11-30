import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

function Perfil() {
  const navigate = useNavigate();
  const { user, loading, updateProfile, changePassword } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    ciudad: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        email: user.email || '',
        telefono: user.telefono || '',
        ciudad: user.ciudad || '',
      });
    }
  }, [user]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePassword = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    setError(null);
    setSuccess(null);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setSuccess('Perfil actualizado exitosamente');
        setEditMode(false);
      } else {
        setError(result.error || 'Error al actualizar perfil');
      }
    } catch (err) {
      setError(err.message || 'Error al actualizar perfil');
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    setChangingPassword(true);
    try {
      const result = await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      if (result.success) {
        setSuccess('Contraseña actualizada exitosamente');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setError(result.error || 'Error al cambiar contraseña');
      }
    } catch (err) {
      setError(err.message || 'Error al cambiar contraseña');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <section className="perfil-page py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-7">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4 p-lg-5">
                  <div className="alert alert-warning" role="alert">
                    <h2 className="h6 mb-2">No hay una sesión activa</h2>
                    <p className="mb-3">
                      Inicia sesión para sincronizar tu perfil o crea una cuenta gratuita.
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="perfil-page py-5 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-9">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4 p-lg-5">
                <h1 className="h3 fw-bold text-danger mb-3">Perfil de Usuario</h1>
                <p className="text-muted mb-4">
                  Revisa tus datos personales y actualiza tu información cuando sea necesario.
                </p>

                {error && <ErrorAlert message={error} />}
                {success && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {success}
                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                  </div>
                )}

                {!editMode ? (
                  <div className="vstack gap-4">
                    <div>
                      <h2 className="h6 text-uppercase text-secondary mb-2">Datos personales</h2>
                      <p className="mb-1">
                        <strong>Nombre:</strong> {formData.nombre}
                      </p>
                      <p className="mb-0">
                        <strong>Email:</strong> {formData.email}
                      </p>
                    </div>
                    <div>
                      <h2 className="h6 text-uppercase text-secondary mb-2">Contacto</h2>
                      <p className="mb-1">
                        <strong>Teléfono:</strong> {formData.telefono || 'No especificado'}
                      </p>
                      <p className="mb-0">
                        <strong>Ciudad:</strong> {formData.ciudad || 'No especificada'}
                      </p>
                    </div>
                    <div>
                      <button
                        className="btn btn-primary"
                        onClick={() => setEditMode(true)}
                      >
                        Editar Perfil
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-3">
                      <label className="form-label">Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChangeInput}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChangeInput}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Teléfono</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChangeInput}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Ciudad</label>
                      <input
                        type="text"
                        className="form-control"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleChangeInput}
                      />
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-primary"
                        onClick={handleUpdateProfile}
                      >
                        Guardar Cambios
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setEditMode(false)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-lg-5">
                <h2 className="h5 fw-bold text-danger mb-4">Cambiar Contraseña</h2>
                <form onSubmit={handleChangePasswordSubmit}>
                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">
                      Contraseña Actual
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handleChangePassword}
                      disabled={changingPassword}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handleChangePassword}
                      disabled={changingPassword}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handleChangePassword}
                      disabled={changingPassword}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-danger"
                    disabled={changingPassword}
                  >
                    {changingPassword ? 'Actualizando...' : 'Actualizar Contraseña'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Perfil;