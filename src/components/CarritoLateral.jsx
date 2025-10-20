import { useCarrito } from '../context/CarritoContext'
import { formatearPrecio } from '../data/mangas'

const CarritoLateral = () => {
  const { 
    carrito, 
    cantidadTotal, 
    precioTotal, 
    actualizarCantidad, 
    eliminarDelCarrito, 
    vaciarCarrito,
    isOpen,
    toggleCarrito,
    cerrarCarrito
  } = useCarrito()

  const finalizarCompra = () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío')
      return
    }
    
    // Aquí puedes implementar la lógica de checkout
    alert(`Compra finalizada!\nTotal: ${formatearPrecio(precioTotal)}\nProductos: ${cantidadTotal}`)
    vaciarCarrito()
    setIsOpen(false)
  }

  return (
    <>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1055 }}
          onClick={cerrarCarrito}
        />
      )}

      {/* Panel lateral del carrito */}
      {isOpen && (
        <div
          className={`position-fixed top-0 end-0 h-100 bg-white shadow-lg transition-transform`}
          style={{
            width: '400px',
            zIndex: 1060,
            transition: 'transform 0.3s ease-in-out'
          }}
        >
        {/* Header del carrito */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5 className="mb-0">
            <i className="fas fa-shopping-cart me-2"></i>
            Carrito ({cantidadTotal})
          </h5>
          <button 
            className="btn btn-outline-secondary btn-sm"
            onClick={toggleCarrito}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Contenido del carrito */}
        <div className="flex-grow-1 overflow-auto" style={{ height: 'calc(100vh - 140px)' }}>
          {carrito.length === 0 ? (
            <div className="text-center p-4">
              <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
              <h6 className="text-muted">Tu carrito está vacío</h6>
              <p className="text-muted small">Agrega algunos productos para comenzar</p>
            </div>
          ) : (
            <div className="p-3">
              {carrito.map(item => (
                <div key={item.id} className="d-flex align-items-center mb-3 p-2 border rounded">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="rounded"
                    style={{ width: '50px', height: '60px', objectFit: 'cover' }}
                    onError={(e) => {
            // usar la función del contexto para cerrar el carrito lateral
            cerrarCarrito()
                    }}
                  />
                  <div className="flex-grow-1 ms-3">
                    <h6 className="mb-1 small">{item.nombre}</h6>
                    <p className="mb-1 text-muted small">{formatearPrecio(item.precio)}</p>
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        style={{ width: '30px', height: '30px' }}
                        onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                      >
                        -
                      </button>
                      <span className="mx-2 small">{item.cantidad}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        style={{ width: '30px', height: '30px' }}
                        onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                      >
                        +
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm ms-2"
                        onClick={() => eliminarDelCarrito(item.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer del carrito */}
        {carrito.length > 0 && (
          <div className="border-top p-3 bg-light">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-bold">Total:</span>
              <span className="h5 mb-0 text-danger fw-bold">
                {formatearPrecio(precioTotal)}
              </span>
            </div>
            <div className="d-grid gap-2">
              <button
                className="btn btn-danger"
                onClick={finalizarCompra}
              >
                <i className="fas fa-credit-card me-2"></i>
                Finalizar Compra
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={vaciarCarrito}
              >
                <i className="fas fa-trash me-2"></i>
                Vaciar Carrito
              </button>
            </div>
          </div>
        )}
        </div>
      )}
    </>
  )
}

export default CarritoLateral