import axios from 'axios';

const testLogin = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@tienda.com',
      password: 'admin123'
    });
    console.log('Login exitoso:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error en login:', error.response.status, error.response.data);
    } else {
      console.error('Error de conexión:', error.message);
    }
  }
};

testLogin();
