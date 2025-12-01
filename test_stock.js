// import fetch from 'node-fetch'; // Native fetch used in Node 18+

async function testStock() {
  try {
    // 0. Register
    console.log('Registering...');
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Test User',
        email: 'fix_user_2@example.com',
        password: 'password123',
        ciudad: 'Santiago',
        telefono: '123456789'
      })
    });
    const regData = await regRes.json();
    console.log('Registration Response:', JSON.stringify(regData, null, 2));

    // 1. Login
    console.log('Logging in...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'fix_user_2@example.com', password: 'password123' })
    });
    const loginData = await loginRes.json();

    if (!loginData.success) {
      throw new Error('Login failed: ' + loginData.mensaje);
    }
    const token = loginData.token;
    console.log('Login successful. Token obtained.');

    // 1.5 Verify Token
    console.log('Verifying token...');
    const verifyRes = await fetch('http://localhost:5000/api/auth/verify', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const verifyData = await verifyRes.json();
    if (verifyData.success) {
      console.log('✅ Token verification successful:', verifyData.user.email);
    } else {
      console.error('❌ Token verification failed:', verifyData.mensaje);
    }

    // 2. Create Order with excessive quantity
    console.log('Attempting to create order with quantity 1000...');
    const orderRes = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        items: [{ productoId: 1, cantidad: 1000 }],
        direccion: { calle: 'Test St', ciudad: 'Test City', codigoPostal: '12345', pais: 'Test Country' }
      })
    });

    const orderData = await orderRes.json();
    console.log('Order Response Status:', orderRes.status);
    console.log('Order Response Body:', orderData);

    if (orderRes.status === 400 && orderData.success === false) {
      console.log('✅ TEST PASSED: Order rejected due to insufficient stock.');
    } else {
      console.log('❌ TEST FAILED: Order was not rejected as expected.');
    }

  } catch (error) {
    console.error('Test Error:', error);
  }
}

testStock();
