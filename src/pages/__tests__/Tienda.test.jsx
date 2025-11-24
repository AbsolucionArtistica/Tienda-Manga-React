import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CarritoProvider } from '../../context/CarritoContext';
import Tienda from '../Tienda';

let productosMock = [
  {
    id: 1,
    nombre: 'One Piece',
    autor: 'Oda',
    precio: 1000,
    imagen: 'https://example.com/one.jpg',
    stock: 5,
  },
  {
    id: 2,
    nombre: 'Naruto',
    autor: 'Kishimoto',
    precio: 1200,
    imagen: 'https://example.com/two.jpg',
    stock: 5,
  },
];

const mockObtenerMangas = vi.fn(() => Promise.resolve(productosMock));
const mockFormatearPrecio = (precio) => `$${precio}`;
const mockBuscarMangasPorTitulo = vi.fn(() => Promise.resolve([]));
const mockObtenerMangasPopulares = vi.fn(() => Promise.resolve(productosMock));
const mockObtenerMangasPorGenero = vi.fn(() => Promise.resolve(productosMock));

vi.mock('../../data/mangas', () => ({
  obtenerMangas: () => mockObtenerMangas(),
  categorias: [],
  formatearPrecio: (precio) => mockFormatearPrecio(precio),
}));

vi.mock('../../services/animeapi', () => ({
  buscarMangasPorTitulo: (...args) => mockBuscarMangasPorTitulo(...args),
  obtenerMangasPopulares: () => mockObtenerMangasPopulares(),
  obtenerMangasPorGenero: (...args) => mockObtenerMangasPorGenero(...args),
}));

describe('Tienda', () => {
  beforeEach(() => {
    mockBuscarMangasPorTitulo.mockClear();
  });

  const renderTienda = () =>
    render(
      <MemoryRouter>
        <CarritoProvider>
          <Tienda />
        </CarritoProvider>
      </MemoryRouter>
    );

  it('renderiza los productos luego de cargar los datos', async () => {
    renderTienda();

    expect(await screen.findByText('One Piece')).toBeInTheDocument();
    expect(screen.getByText('Naruto')).toBeInTheDocument();
  });

  it('filtra los productos cuando se escribe en la barra de búsqueda', async () => {
    renderTienda();

    await screen.findByText('One Piece');
    await userEvent.type(screen.getByPlaceholderText(/Buscar manga/i), 'producto inexistente');

    await waitFor(() => {
      expect(screen.getByText('No se encontraron productos')).toBeInTheDocument();
    });
    expect(mockBuscarMangasPorTitulo).toHaveBeenCalled();
  });
});
