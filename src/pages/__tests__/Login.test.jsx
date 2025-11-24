import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Login from '../Login';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderLogin = () =>
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

  it('muestra mensajes de error cuando faltan campos obligatorios', async () => {
    renderLogin();

    await userEvent.type(screen.getByLabelText(/Contraseña/i), '123456');
    await userEvent.click(screen.getByRole('button', { name: /Entrar a mi cuenta/i }));

    expect(screen.getByText('Debes ingresar un correo registrado.')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('guarda el usuario activo y navega al perfil después de un login válido', async () => {
    const usuario = {
      nombre: 'Sakura',
      email: 'sakura@cl.com',
      password: 'abc123',
      telefono: '999',
      ciudad: 'Santiago',
    };
    localStorage.setItem('usuarios', JSON.stringify([usuario]));
    vi.useFakeTimers();

    renderLogin();

    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
      target: { value: usuario.email },
    });
    fireEvent.change(screen.getByLabelText(/^Contraseña$/i), {
      target: { value: usuario.password },
    });
    fireEvent.click(screen.getByRole('button', { name: /Entrar a mi cuenta/i }));

    expect(screen.getByText('Ingreso correcto. Redirigiendo a tu perfil...')).toBeInTheDocument();

    await vi.runOnlyPendingTimersAsync();

    expect(mockNavigate).toHaveBeenCalledWith('/perfil');
    expect(JSON.parse(localStorage.getItem('usuarioActivo')).email).toBe(usuario.email);
  });
});
