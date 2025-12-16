export const esEmailValido = (valor = '') => {
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailValido.test(valor.trim());
};

export const esTarjetaValida = (valor = '') => {
  const limpia = valor.replace(/\s+/g, '');
  return /^\d{16}$/.test(limpia);
};

export const esExpiracionValida = (valor = '') => {
  return /^(0[1-9]|1[0-2])\/\d{2}$/.test(valor);
};

export const esCvvValido = (valor = '') => /^\d{3}$/.test(valor);
