const API_URL = 'http://localhost:8080/api/orders';

export const getMyOrders = async (token) => {
  const response = await fetch(`${API_URL}/my-orders`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener los pedidos');
  }

  return await response.json();
};

export const createOrder = async (token, items) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items }),
  });

  if (!response.ok) {
    throw new Error('Error al crear la orden');
  }

  return await response.json();
};
