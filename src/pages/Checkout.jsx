import { useCarrito } from '../context/CarritoContext'
import { formatearPrecio } from '../data/mangas'
import { useState } from 'react'

const Checkout = () => {
  const { carrito, precioTotal, cantidadTotal, vaciarCarrito } = useCarrito()
  const [form, setForm] = useState({ nombre: '', email: '', direccion: '', tarjeta: '', expiracion: '', cvv: '' })

  const manejarCambio = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const manejarSubmit = (e) => {
    e.preventDefault()
    // Aquí normalmente validas y envías a un backend/TPV
    alert(`Gracias ${form.nombre}!\nPedido: ${cantidadTotal} productos.\nTotal: ${formatearPrecio(precioTotal)}`)
    vaciarCarrito()
  }

  return (
    <div className="container py-4">
      <h2>Checkout</h2>
      <div className="row">
        <div className="col-md-6">
          <h5>Productos</h5>
          {carrito.length === 0 ? (
            <p>Tu carrito está vacío.</p>
          ) : (
            <ul className="list-group">
              {carrito.map(item => (
                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{item.nombre}</strong>
                    <div className="text-muted small">{item.cantidad} × {formatearPrecio(item.precio)}</div>
                  </div>
                  <div>{formatearPrecio(item.precio * item.cantidad)}</div>
                </li>
              ))}
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <strong>Total</strong>
                <strong className="text-danger">{formatearPrecio(precioTotal)}</strong>
              </li>
            </ul>
          )}
        </div>

        <div className="col-md-6">
          <h5>Datos de pago</h5>
          <form onSubmit={manejarSubmit}>
            <div className="mb-2">
              <label className="form-label">Nombre completo</label>
              <input name="nombre" value={form.nombre} onChange={manejarCambio} className="form-control" required />
            </div>
            <div className="mb-2">
              <label className="form-label">Email</label>
              <input name="email" type="email" value={form.email} onChange={manejarCambio} className="form-control" required />
            </div>
            <div className="mb-2">
              <label className="form-label">Dirección</label>
              <input name="direccion" value={form.direccion} onChange={manejarCambio} className="form-control" required />
            </div>
            <div className="mb-2">
              <label className="form-label">Número de tarjeta</label>
              <input name="tarjeta" value={form.tarjeta} onChange={manejarCambio} className="form-control" required />
            </div>
            <div className="row">
              <div className="col-6 mb-2">
                <label className="form-label">Expiración</label>
                <input name="expiracion" value={form.expiracion} onChange={manejarCambio} className="form-control" placeholder="MM/AA" required />
              </div>
              <div className="col-6 mb-2">
                <label className="form-label">CVV</label>
                <input name="cvv" value={form.cvv} onChange={manejarCambio} className="form-control" required />
              </div>
            </div>
            <button className="btn btn-primary mt-2" type="submit">Pagar {formatearPrecio(precioTotal)}</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Checkout
