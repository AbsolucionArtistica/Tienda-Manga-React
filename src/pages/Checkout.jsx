import { useCarrito } from '../context/CarritoContext'
import { formatearPrecio } from '../data/mangas'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Checkout = () => {
  const { carrito, precioTotal, cantidadTotal, vaciarCarrito } = useCarrito()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', email: '', direccion: '', tarjeta: '', expiracion: '', cvv: '' })
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState(false)

  const manejarCambio = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const manejarSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setExito(false)

    // Validar carrito
    if (carrito.length === 0) {
      setError('Tu carrito está vacío')
      return
    }

    // Validar formulario
    if (!form.nombre.trim() || !form.email.trim() || !form.direccion.trim()) {
      setError('Por favor completa todos los campos requeridos')
      return
    }

    setEnviando(true)
    try {
      // Preparar datos de la orden según lo que espera el backend
      // Solo enviar productoId y cantidad (el backend obtiene los demás datos)
      const orderData = {
        items: carrito.map(item => ({
          productoId: String(item.id),
          cantidad: item.cantidad
        })),
        direccion: {
          calle: form.direccion.trim(),
          ciudad: 'Santiago',
          codigoPostal: '00000',
          pais: 'Chile'
        }
      }

      // Enviar orden al backend
      const token = localStorage.getItem('authToken')
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        setExito(true)
        setForm({ nombre: '', email: '', direccion: '', tarjeta: '', expiracion: '', cvv: '' })
        vaciarCarrito()
        
        setTimeout(() => {
          navigate('/ordenes')
        }, 2000)
      } else {
        throw new Error(result.mensaje || result.mensajes?.join(', ') || 'Error al procesar la orden')
      }
    } catch (err) {
      setError(err.message || 'Error al procesar la orden')
      console.error('Error creando orden:', err)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Checkout</h2>
      
      {exito && (
        <div className="alert alert-success" role="alert">
          ¡Orden creada exitosamente! Redirigiendo a tus órdenes...
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row">
        <div className="col-md-6">
          <h5>Productos</h5>
          {carrito.length === 0 ? (
            <p className="text-muted">Tu carrito está vacío.</p>
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
              <input 
                name="nombre" 
                value={form.nombre} 
                onChange={manejarCambio} 
                className="form-control" 
                disabled={enviando}
                required 
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Email</label>
              <input 
                name="email" 
                type="email" 
                value={form.email} 
                onChange={manejarCambio} 
                className="form-control" 
                disabled={enviando}
                required 
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Dirección</label>
              <input 
                name="direccion" 
                value={form.direccion} 
                onChange={manejarCambio} 
                className="form-control" 
                disabled={enviando}
                required 
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Número de tarjeta</label>
              <input 
                name="tarjeta" 
                value={form.tarjeta} 
                onChange={manejarCambio} 
                className="form-control" 
                disabled={enviando}
                placeholder="1234 5678 9012 3456"
                required 
              />
            </div>
            <div className="row">
              <div className="col-6 mb-2">
                <label className="form-label">Expiración</label>
                <input 
                  name="expiracion" 
                  value={form.expiracion} 
                  onChange={manejarCambio} 
                  className="form-control" 
                  placeholder="MM/AA" 
                  disabled={enviando}
                  required 
                />
              </div>
              <div className="col-6 mb-2">
                <label className="form-label">CVV</label>
                <input 
                  name="cvv" 
                  value={form.cvv} 
                  onChange={manejarCambio} 
                  className="form-control" 
                  placeholder="123"
                  disabled={enviando}
                  required 
                />
              </div>
            </div>
            <button 
              className="btn btn-primary mt-2 w-100" 
              type="submit"
              disabled={enviando || carrito.length === 0}
            >
              {enviando ? 'Procesando...' : `Pagar ${formatearPrecio(precioTotal)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Checkout
