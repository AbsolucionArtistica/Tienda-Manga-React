import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import productsService from '../services/productsService';

function Admin() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen: '',
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const response = await productsService.getAll();
      setProductos(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar productos');
      console.error('Error cargando productos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (producto) => {
    setEditingId(producto.id);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      stock: producto.stock || 0,
      imagen: producto.imagen || '',
    });
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await productsService.update(editingId, formData);
        setError(null);
      } else {
        await productsService.create(formData);
        setError(null);
      }
      cargarProductos();
      setEditingId(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        imagen: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar producto');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro que deseas eliminar este producto?')) {
      try {
        await productsService.delete(id);
        cargarProductos();
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al eliminar producto');
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      imagen: '',
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="admin-page py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-md-8">
            <h1>Panel de Administración</h1>
          </div>
        </div>

        {error && <ErrorAlert message={error} />}

        <div className="row mb-4">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header bg-dark text-white">
                {editingId ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </div>
              <div className="card-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">
                      Nombre
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Nombre del producto"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">
                      Descripción
                    </label>
                    <textarea
                      className="form-control"
                      id="descripcion"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Descripción del producto"
                    ></textarea>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="precio" className="form-label">
                          Precio
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="precio"
                          name="precio"
                          value={formData.precio}
                          onChange={handleChange}
                          step="0.01"
                          placeholder="Precio"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="stock" className="form-label">
                          Stock
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="stock"
                          name="stock"
                          value={formData.stock}
                          onChange={handleChange}
                          placeholder="Stock disponible"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="imagen" className="form-label">
                      URL de Imagen
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      id="imagen"
                      name="imagen"
                      value={formData.imagen}
                      onChange={handleChange}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSave}
                    >
                      {editingId ? 'Actualizar' : 'Crear'}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleCancel}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header bg-dark text-white">
                <h5 className="mb-0">Productos ({productos.length})</h5>
              </div>
              <div className="card-body">
                {productos.length === 0 ? (
                  <p className="text-muted">No hay productos registrados</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Precio</th>
                          <th>Stock</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productos.map((producto) => (
                          <tr key={producto.id}>
                            <td>#{producto.id}</td>
                            <td>{producto.nombre}</td>
                            <td>${producto.precio?.toLocaleString('es-ES')}</td>
                            <td>
                              <span
                                className={`badge ${
                                  producto.stock > 0 ? 'bg-success' : 'bg-danger'
                                }`}
                              >
                                {producto.stock || 0}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-warning me-2"
                                onClick={() => handleEdit(producto)}
                              >
                                Editar
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(producto.id)}
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Admin;
