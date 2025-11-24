import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CarritoLateral from '../CarritoLateral';

const mockNavigate = vi.fn();
let mockContextValue;

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../context/CarritoContext', () => ({
  useCarrito: () => mockContextValue,
}));

describe('CarritoLateral', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockContextValue = {
      carrito: [
        {
          id: 1,
          nombre: 'Demo',
          precio: 1000,
          cantidad: 1,
          imagen: 'https://example.com/demo.jpg',
        },
      ],
      cantidadTotal: 1,
      precioTotal: 1000,
      actualizarCantidad: vi.fn(),
      eliminarDelCarrito: vi.fn(),
      vaciarCarrito: vi.fn(),
      isOpen: true,
      toggleCarrito: vi.fn(),
      cerrarCarrito: vi.fn(),
    };
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    window.alert.mockRestore();
  });

  const renderCarrito = () =>
    render(
      <MemoryRouter>
        <CarritoLateral />
      </MemoryRouter>
    );

  it('navega a checkout cuando hay productos y se finaliza la compra', async () => {
    renderCarrito();
    await userEvent.click(screen.getByRole('button', { name: /Finalizar compra/i }));

    expect(mockContextValue.cerrarCarrito).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/checkout');
  });

  it('actualiza la cantidad cuando se presiona el botón de incremento', async () => {
    renderCarrito();

    const incrementButton = screen.getAllByRole('button', { name: '+' })[0];
    await userEvent.click(incrementButton);

    expect(mockContextValue.actualizarCantidad).toHaveBeenCalledWith(1, 2);
  });
});
