import { formatearPrecio } from '../../src/data/mangas.js';
import {
  esCvvValido,
  esEmailValido,
  esExpiracionValida,
  esTarjetaValida,
} from '../../src/utils/validators.js';

describe('validadores básicos', () => {
  it('valida correos con formato correcto', () => {
    expect(esEmailValido('user@example.com')).toBeTrue();
    expect(esEmailValido('userexample.com')).toBeFalse();
  });

  it('valida número de tarjeta de 16 dígitos', () => {
    expect(esTarjetaValida('4111111111111111')).toBeTrue();
    expect(esTarjetaValida('1234 567')).toBeFalse();
  });

  it('valida expiración con formato MM/AA', () => {
    expect(esExpiracionValida('12/29')).toBeTrue();
    expect(esExpiracionValida('00/25')).toBeFalse();
  });

  it('valida CVV de 3 dígitos', () => {
    expect(esCvvValido('123')).toBeTrue();
    expect(esCvvValido('12a')).toBeFalse();
  });
});

describe('utilidades de formato', () => {
  it('formatea precios en CLP', () => {
    expect(formatearPrecio(9990)).toContain('$');
  });
});
