import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { CarritoProvider, useCarrito } from '../CarritoContext';

const producto = { id: 1, nombre: 'Manga', precio: 5000 };

const TestHarness = () => {
  const { agregarAlCarrito, vaciarCarrito, cantidadTotal, carrito } = useCarrito();
  return (
    <div>
      <span data-testid="cantidad">{cantidadTotal}</span>
      <span data-testid="items">{carrito.length}</span>
      <button onClick={() => agregarAlCarrito(producto)}>Agregar</button>
      <button onClick={vaciarCarrito}>Vaciar</button>
    </div>
  );
};

describe('CarritoContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('incrementa la cantidad total al agregar un producto', async () => {
    render(
      <CarritoProvider>
        <TestHarness />
      </CarritoProvider>
    );

    expect(screen.getByTestId('cantidad').textContent).toBe('0');
    await userEvent.click(screen.getByText('Agregar'));

    expect(screen.getByTestId('cantidad').textContent).toBe('1');
  });

  it('vacía el carrito y resetea la lista de productos', async () => {
    render(
      <CarritoProvider>
        <TestHarness />
      </CarritoProvider>
    );

    await userEvent.click(screen.getByText('Agregar'));
    expect(screen.getByTestId('items').textContent).toBe('1');

    await userEvent.click(screen.getByText('Vaciar'));
    expect(screen.getByTestId('items').textContent).toBe('0');
    expect(screen.getByTestId('cantidad').textContent).toBe('0');
  });
});
