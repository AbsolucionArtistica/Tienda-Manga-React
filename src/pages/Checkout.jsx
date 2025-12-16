import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';
import { formatearPrecio } from '../data/mangas';
import { createOrder } from '../services/orderService';
import { esCvvValido, esExpiracionValida, esTarjetaValida } from '../utils/validators';

const Checkout = () => {
  const { carrito, precioTotal, cantidadTotal, vaciarCarrito } = useCarrito();
  const { user } = useAuth();
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    direccion: '',
    tarjeta: '',
    expiracion: '',
    cvv: '',
  });
  const [errores, setErrores] = useState({});

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    if (!esTarjetaValida(form.tarjeta)) {
      nuevosErrores.tarjeta = 'La tarjeta debe tener 16 dígitos.';
    }

    if (!esExpiracionValida(form.expiracion)) {
      nuevosErrores.expiracion = 'Usa el formato MM/AA y un mes válido.';
    }

    if (!esCvvValido(form.cvv)) {
      nuevosErrores.cvv = 'El CVV debe tener 3 dígitos.';
    }

    if (carrito.length === 0) {
      nuevosErrores.carrito = 'No puedes pagar sin productos en el carrito.';
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    const token = user?.token || localStorage.getItem('token');
    const payloadItems = carrito.map((item) => ({ id: item.id, cantidad: item.cantidad }));

    // Si no hay token (modo sin backend), confirma igual para que el flujo de pruebas siga
    if (!token) {
      alert(
        `Gracias ${form.nombre}!\nPedido: ${cantidadTotal} productos.\nTotal: ${formatearPrecio(
          precioTotal
        )}`
      );
      vaciarCarrito();
      return;
    }

    setErrores({});
    createOrder(token, payloadItems)
      .then(() => {
        alert(
          `Gracias ${form.nombre}!\nPedido: ${cantidadTotal} productos.\nTotal: ${formatearPrecio(
            precioTotal
          )}`
        );
        vaciarCarrito();
      })
      .catch(() => {
        setErrores({ carrito: 'No se pudo registrar la orden. Intenta nuevamente.' });
      });
  };

  return (
    <main className="container py-4">
      <h2>Checkout</h2>
      <div className="row">
        <div className="col-md-6">
          <h5>Productos</h5>
          {carrito.length === 0 ? (
            <p className="text-danger">Tu carrito está vacío.</p>
          ) : (
            <ul className="list-group">
              {carrito.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{item.nombre}</strong>
                    <div className="text-muted small">
                      {item.cantidad} × {formatearPrecio(item.precio)}
                    </div>
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
          <form onSubmit={manejarSubmit} noValidate>
            <div className="mb-2">
              <label className="form-label" htmlFor="checkout-nombre">
                Nombre completo
              </label>
              <input
                id="checkout-nombre"
                name="nombre"
                value={form.nombre}
                onChange={manejarCambio}
                className="form-control"
                required
              />
            </div>
            <div className="mb-2">
              <label className="form-label" htmlFor="checkout-email">
                Email
              </label>
              <input
                id="checkout-email"
                name="email"
                type="email"
                value={form.email}
                onChange={manejarCambio}
                className="form-control"
                required
              />
            </div>
            <div className="mb-2">
              <label className="form-label" htmlFor="checkout-direccion">
                Dirección
              </label>
              <input
                id="checkout-direccion"
                name="direccion"
                value={form.direccion}
                onChange={manejarCambio}
                className="form-control"
                required
              />
            </div>
            <div className="mb-2">
              <label className="form-label" htmlFor="checkout-tarjeta">
                Número de tarjeta
              </label>
              <input
                id="checkout-tarjeta"
                name="tarjeta"
                value={form.tarjeta}
                onChange={manejarCambio}
                className={`form-control ${errores.tarjeta ? 'is-invalid' : ''}`}
                maxLength={19}
                placeholder="1234123412341234"
                required
              />
              {errores.tarjeta && <div className="invalid-feedback">{errores.tarjeta}</div>}
            </div>
            <div className="row">
              <div className="col-6 mb-2">
                <label className="form-label" htmlFor="checkout-expiracion">
                  Expiración
                </label>
                <input
                  id="checkout-expiracion"
                  name="expiracion"
                  value={form.expiracion}
                  onChange={manejarCambio}
                  className={`form-control ${errores.expiracion ? 'is-invalid' : ''}`}
                  placeholder="MM/AA"
                  required
                />
                {errores.expiracion && <div className="invalid-feedback">{errores.expiracion}</div>}
              </div>
              <div className="col-6 mb-2">
                <label className="form-label" htmlFor="checkout-cvv">
                  CVV
                </label>
                <input
                  id="checkout-cvv"
                  name="cvv"
                  value={form.cvv}
                  onChange={manejarCambio}
                  className={`form-control ${errores.cvv ? 'is-invalid' : ''}`}
                  maxLength={3}
                  required
                />
                {errores.cvv && <div className="invalid-feedback">{errores.cvv}</div>}
              </div>
            </div>
            {errores.carrito && <p className="text-danger small mb-2">{errores.carrito}</p>}
            <button className="btn btn-primary mt-2" type="submit">
              Pagar {formatearPrecio(precioTotal)}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
