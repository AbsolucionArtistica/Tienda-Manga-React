import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import ordersService from '../services/ordersService';

function OrderHistory() {
  const navigate = useNavigate();
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const cargarOrdenes = async () => {
    try {
      setLoading(true);
      const response = await ordersService.getAll();
      setOrdenes(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar órdenes');
      console.error('Error cargando órdenes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      const response = await ordersService.getById(orderId);
      setSelectedOrder(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar detalles de la orden');
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pendiente: 'bg-warning',
      confirmada: 'bg-info',
      enviada: 'bg-primary',
      entregada: 'bg-success',
      cancelada: 'bg-danger',
    };
    return statusClasses[status?.toLowerCase()] || 'bg-secondary';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="ordenes-page py-5">
      <div className="container">
        <h1 className="mb-4">Mis Órdenes</h1>

        {error && <ErrorAlert message={error} />}

        {ordenes.length === 0 ? (
          <div className="alert alert-info">
            <p>No tienes órdenes aún.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/tienda')}
            >
              Ir a la tienda
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID Orden</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ordenes.map((orden) => (
                  <tr key={orden.id}>
                    <td>#{orden.id}</td>
                    <td>
                      {new Date(orden.fechaCreacion).toLocaleDateString('es-ES')}
                    </td>
                    <td>${orden.total?.toLocaleString('es-ES') || 0}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(orden.estado)}`}>
                        {orden.estado || 'Desconocido'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleViewDetails(orden.id)}
                      >
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedOrder && (
          <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Detalles de la Orden #{selectedOrder.id}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedOrder(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <h6>Información General</h6>
                      <p>
                        <strong>Fecha:</strong>{' '}
                        {new Date(selectedOrder.fechaCreacion).toLocaleDateString('es-ES')}
                      </p>
                      <p>
                        <strong>Estado:</strong>{' '}
                        <span className={`badge ${getStatusBadge(selectedOrder.estado)}`}>
                          {selectedOrder.estado}
                        </span>
                      </p>
                      <p>
                        <strong>Total:</strong> ${selectedOrder.total?.toLocaleString('es-ES')}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h6>Dirección de Envío</h6>
                      <p>{selectedOrder.direccionEnvio || 'No especificada'}</p>
                      <p>{selectedOrder.ciudad || ''}</p>
                    </div>
                  </div>
                  {selectedOrder.items && selectedOrder.items.length > 0 && (
                    <>
                      <h6>Productos</h6>
                      <div className="table-responsive">
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>Producto</th>
                              <th>Cantidad</th>
                              <th>Precio</th>
                              <th>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedOrder.items.map((item, idx) => (
                              <tr key={idx}>
                                <td>{item.nombre}</td>
                                <td>{item.cantidad}</td>
                                <td>${item.precio?.toLocaleString('es-ES')}</td>
                                <td>
                                  ${(item.cantidad * item.precio).toLocaleString('es-ES')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default OrderHistory;
