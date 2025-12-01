const API_URL = 'http://localhost:5000/api';
let token = '';

async function runVerification() {
  console.log('Starting Backend Verification (using fetch)...');

  // Helper for JSON requests
  const post = async (url, data, auth = false) => {
    const headers = { 'Content-Type': 'application/json' };
    if (auth) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    return res.json();
  };

  const get = async (url, auth = false) => {
    const headers = {};
    if (auth) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(url, { headers });
    return res.json();
  };

  // 1. Register
  try {
    const email = `test${Date.now()}@example.com`;
    console.log(`\n1. Testing Registration with ${email}...`);
    const regRes = await post(`${API_URL}/auth/register`, {
      nombre: 'Test User',
      email: email,
      password: 'password123'
    });
    console.log('Register Response:', regRes.success ? 'Success' : regRes);
  } catch (error) {
    console.error('❌ Registration Failed:', error.message);
  }

  // 2. Login
  try {
    const loginEmail = `login${Date.now()}@example.com`;
    await post(`${API_URL}/auth/register`, {
      nombre: 'Login User',
      email: loginEmail,
      password: 'password123'
    });

    console.log(`\n2. Testing Login with ${loginEmail}...`);
    const loginRes = await post(`${API_URL}/auth/login`, {
      email: loginEmail,
      password: 'password123'
    });

    if (loginRes.success) {
      console.log('✅ Login Successful');
      token = loginRes.token;
    } else {
      console.error('❌ Login Failed:', loginRes);
      return;
    }
  } catch (error) {
    console.error('❌ Login Error:', error.message);
    return;
  }

  // 3. Get Products
  try {
    console.log('\n3. Testing Get Products...');
    const prodRes = await get(`${API_URL}/products`, true);
    // Backend might return { success: true, data: [...] } or just [...]
    const products = prodRes.data || prodRes;
    console.log(`✅ Get Products Successful. Found ${products.length || 0} products.`);
  } catch (error) {
    console.error('❌ Get Products Failed:', error.message);
  }

  // 4. Create Order
  try {
    console.log('\n4. Testing Create Order...');
    const orderData = {
      items: [
        { productoId: 1, cantidad: 1 }
      ],
      direccion: {
        calle: 'Test St 123',
        ciudad: 'Santiago',
        codigoPostal: '12345',
        pais: 'Chile'
      }
    };
    const orderRes = await post(`${API_URL}/orders`, orderData, true);
    console.log('Create Order Response:', orderRes.success ? 'Success' : orderRes);
  } catch (error) {
    console.error('❌ Create Order Failed:', error.message);
  }

  console.log('\nVerification Complete.');
}

runVerification();
