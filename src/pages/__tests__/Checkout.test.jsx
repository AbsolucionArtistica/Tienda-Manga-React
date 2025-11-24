import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Checkout from '../Checkout';

const mockVaciarCarrito = vi.fn();
let mockContextValue;

vi.mock('../../context/CarritoContext', () => ({
  useCarrito: () => mockContextValue,
}));

describe('Checkout', () => {
  beforeEach(() => {
    mockContextValue = {
      carrito: [{ id: 1, nombre: 'Manga Demo', precio: 10000, cantidad: 1 }],
      precioTotal: 10000,
      cantidadTotal: 1,
      vaciarCarrito: mockVaciarCarrito,
    };
    mockVaciarCarrito.mockReset();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    window.alert.mockRestore();
  });

  const completarCamposBasicos = async () => {
    await userEvent.type(screen.getByLabelText(/Nombre completo/i), 'Juan Tester');
    await userEvent.type(screen.getByLabelText(/Email/i), 'juan@test.com');
    await userEvent.type(screen.getByLabelText(/Dirección/i), 'Calle 123');
  };

  it('muestra errores cuando la tarjeta no cumple el largo requerido', async () => {
    render(<Checkout />);
    await completarCamposBasicos();
    await userEvent.type(screen.getByLabelText(/Número de tarjeta/i), '1234');
    await userEvent.type(screen.getByLabelText(/Expiración/i), '12/30');
    await userEvent.type(screen.getByLabelText(/CVV/i), '123');

    await userEvent.click(screen.getByRole('button', { name: /Pagar/i }));

    expect(screen.getByText('La tarjeta debe tener 16 dígitos.')).toBeInTheDocument();
    expect(mockVaciarCarrito).not.toHaveBeenCalled();
  });

  it('envía el formulario cuando los datos son válidos y limpia el carrito', async () => {
    render(<Checkout />);
    await completarCamposBasicos();
    await userEvent.type(screen.getByLabelText(/Número de tarjeta/i), '1234123412341234');
    await userEvent.type(screen.getByLabelText(/Expiración/i), '12/30');
    await userEvent.type(screen.getByLabelText(/CVV/i), '123');

    await userEvent.click(screen.getByRole('button', { name: /Pagar/i }));

    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Gracias Juan Tester'));
    expect(mockVaciarCarrito).toHaveBeenCalledTimes(1);
  });
});
