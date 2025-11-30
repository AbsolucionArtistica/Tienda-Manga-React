import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('No estás autenticado. Por favor inicia sesión.');
        setLoading(false);
        return;
      }

      // Decodificar token para debug
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const decoded = JSON.parse(atob(tokenParts[1]));
          console.log('Token decodificado:', decoded);
        }
      } catch (e) {
        console.log('No se pudo decodificar token:', e);
      }
      
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Resultado completo del backend:', result);
      console.log('Tipo de ordenes:', typeof result.ordenes);
      console.log('Array ordenes?:', Array.isArray(result.ordenes));
      
      let ordenesData = result.ordenes || result.data || result || [];
      console.log('OrdensData antes de map:', ordenesData);
      
      // Si es un array directamente
      if (Array.isArray(ordenesData)) {
        console.log('Parseando ordenes...');
        ordenesData = ordenesData.map(orden => {
          console.log('Procesando orden:', orden);
          return {
            ...orden,
            items: typeof orden.items === 'string' ? JSON.parse(orden.items) : orden.items,
            direccion: typeof orden.direccion === 'string' ? JSON.parse(orden.direccion) : orden.direccion
          };
        });
      }
      
      console.log('OrdensData final:', ordenesData);
      setOrdenes(Array.isArray(ordenesData) ? ordenesData : []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar órdenes');
      console.error('Error cargando órdenes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (orden) => {
    setSelectedOrder(orden);
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
    return (
      <section className="ordenes-page py-5">
        <div className="container text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p>Cargando órdenes...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="ordenes-page py-5">
      <div className="container">
        <h1 className="mb-4">Mis Órdenes</h1>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

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
                      {new Date(orden.createdAt).toLocaleDateString('es-ES')}
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
                        onClick={() => handleViewDetails(orden)}
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
                        {new Date(selectedOrder.createdAt).toLocaleDateString('es-ES')}
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
                      {selectedOrder.direccion && (
                        <>
                          <p>{selectedOrder.direccion.calle}</p>
                          <p>{selectedOrder.direccion.ciudad}</p>
                          <p>{selectedOrder.direccion.codigoPostal}</p>
                          <p>{selectedOrder.direccion.pais}</p>
                        </>
                      )}
                    </div>
                  </div>
                  {selectedOrder.items && selectedOrder.items.length > 0 && (
                    <>
                      <h6>Productos</h6>
                      <div className="table-responsive">
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>Cantidad</th>
                              <th>Producto ID</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedOrder.items.map((item, idx) => (
                              <tr key={idx}>
                                <td>{item.cantidad}</td>
                                <td>{item.productoId}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Cerrar
                  </button>
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
