import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import Registro from '../Registro';

describe('Registro', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('crea un usuario cuando el formulario es válido', async () => {
    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/Nombre completo/i), 'Shinji Test');
    await userEvent.type(screen.getByLabelText(/Correo electrónico/i), 'shinji@test.com');
    await userEvent.type(screen.getByLabelText(/^Contraseña$/i), 'secret1');
    await userEvent.type(screen.getByLabelText(/Confirmar contraseña/i), 'secret1');
    await userEvent.type(screen.getByLabelText(/Teléfono de contacto/i), '98765432');
    await userEvent.type(screen.getByLabelText(/Ciudad de envío/i), 'Santiago');

    await userEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }));

    expect(
      screen.getByText('Cuenta creada con éxito. Ya puedes revisar tu perfil.')
    ).toBeInTheDocument();
    const usuarios = JSON.parse(localStorage.getItem('usuarios'));
    expect(usuarios).toHaveLength(1);
    expect(usuarios[0].email).toBe('shinji@test.com');
  });
});
