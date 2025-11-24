import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import Carrusel from '../Carrusel';

let dataPopulares = [];
const mockObtenerMangas = vi.fn(() => Promise.resolve([]));
const mockObtenerMangasPopulares = vi.fn(() => Promise.resolve(dataPopulares));

vi.mock('../../data/mangas', () => ({
  obtenerMangas: () => mockObtenerMangas(),
  formatearPrecio: (precio) => `$${precio}`,
}));

vi.mock('../../services/animeapi', () => ({
  obtenerMangasPopulares: () => mockObtenerMangasPopulares(),
}));

describe('Carrusel', () => {
  const renderCarrusel = () =>
    render(
      <MemoryRouter>
        <Carrusel itemsPerSlide={2} />
      </MemoryRouter>
    );

  it('muestra mensaje cuando no hay mangas disponibles', async () => {
    dataPopulares = [];
    renderCarrusel();

    expect(await screen.findByText('No hay mangas disponibles')).toBeInTheDocument();
  });

  it('cambia de slide al presionar el botón siguiente', async () => {
    dataPopulares = [
      {
        id: 1,
        nombre: 'Alpha',
        autor: 'A',
        precio: 1000,
        imagen: 'https://example.com/a.jpg',
        stock: 1,
      },
      {
        id: 2,
        nombre: 'Beta',
        autor: 'B',
        precio: 1000,
        imagen: 'https://example.com/b.jpg',
        stock: 1,
      },
      {
        id: 3,
        nombre: 'Gamma',
        autor: 'C',
        precio: 1000,
        imagen: 'https://example.com/c.jpg',
        stock: 1,
      },
    ];

    renderCarrusel();

    expect(await screen.findByText('Alpha')).toBeVisible();
    const gammaCard = await screen.findByText('Gamma');
    expect(gammaCard).not.toBeVisible();

    await userEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    expect(gammaCard).toBeVisible();
  });
});
