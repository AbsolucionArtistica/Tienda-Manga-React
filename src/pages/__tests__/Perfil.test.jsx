import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import Perfil from '../Perfil';

describe('Perfil', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderPerfil = () =>
    render(
      <MemoryRouter>
        <Perfil />
      </MemoryRouter>
    );

  it('muestra alerta cuando no hay una sesión activa', () => {
    renderPerfil();

    expect(screen.getByText(/No hay una sesión activa/i)).toBeInTheDocument();
  });

  it('muestra los datos del usuario almacenado', async () => {
    const usuario = {
      nombre: 'Kenshin',
      email: 'kenshin@dojo.cl',
      telefono: '123',
      ciudad: 'Kioto',
      actualizadoEl: 'ayer',
    };
    localStorage.setItem('usuarioActivo', JSON.stringify(usuario));

    renderPerfil();

    expect(await screen.findByText(usuario.nombre)).toBeInTheDocument();
    expect(screen.getByText(usuario.email)).toBeInTheDocument();
  });
});
