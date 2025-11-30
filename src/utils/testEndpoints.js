import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * Script de verificación de endpoints
 * Ejecuta pruebas básicas para validar que el backend está corriendo correctamente
 * 
 * Uso en consola del navegador:
 * import { testBackendConnection } from './testEndpoints.js'
 * await testBackendConnection()
 */

const testResults = []

function log(test, status, message) {
  const result = { test, status, message, timestamp: new Date().toISOString() }
  testResults.push(result)
  
  const color = status === 'PASS' ? '#22c55e' : status === 'WARN' ? '#eab308' : '#ef4444'
  console.log(`%c[${status}] ${test}`, `color: ${color}; font-weight: bold`, message)
}

export async function testBackendConnection() {
  console.clear()
  console.log('%c=== PRUEBA DE CONEXIÓN BACKEND ===', 'font-size: 16px; font-weight: bold; color: #2563eb')
  console.log(`Conectando a: ${API_URL}`)
  console.log('')

  testResults.length = 0

  // Test 1: Conexión básica
  try {
    const response = await axios.get(`${API_URL}/products`, { timeout: 5000 })
    log('Conexión básica', 'PASS', `Recibidos ${response.data.length || 0} productos`)
  } catch (error) {
    log('Conexión básica', 'FAIL', error.message)
    console.log('%cNo se puede conectar al backend. Verifica que esté corriendo en puerto 5000', 'color: red')
    return
  }

  // Test 2: GET /products
  try {
    const response = await axios.get(`${API_URL}/products`)
    log('GET /products', 'PASS', `${response.data.length} productos recibidos`)
  } catch (error) {
    log('GET /products', 'FAIL', error.message)
  }

  // Test 3: GET /products con filtro
  try {
    const response = await axios.get(`${API_URL}/products?categoria=Shonen`)
    log('GET /products?categoria', 'PASS', `${response.data.length} productos filtrados`)
  } catch (error) {
    log('GET /products?categoria', 'WARN', 'Filtro no disponible: ' + error.message)
  }

  // Test 4: GET /auth/check (debe fallar sin token)
  try {
    await axios.get(`${API_URL}/auth/check`)
    log('GET /auth/check', 'WARN', 'Debería requerir autenticación')
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      log('GET /auth/check', 'PASS', 'Autenticación requerida (correcto)')
    } else {
      log('GET /auth/check', 'WARN', error.message)
    }
  }

  // Test 5: Validación de estructura de productos
  try {
    const response = await axios.get(`${API_URL}/products`)
    if (response.data.length > 0) {
      const producto = response.data[0]
      const requiredFields = ['id', 'nombre', 'precio', 'descripcion']
      const hasRequiredFields = requiredFields.every(field => field in producto)
      
      if (hasRequiredFields) {
        log('Estructura de datos', 'PASS', 'Productos tienen campos requeridos')
      } else {
        log('Estructura de datos', 'WARN', `Faltan campos. Recibidos: ${Object.keys(producto).join(', ')}`)
      }
    }
  } catch (error) {
    log('Estructura de datos', 'FAIL', error.message)
  }

  // Test 6: CORS
  try {
    const response = await axios.options(`${API_URL}/products`)
    log('CORS', 'PASS', 'CORS habilitado correctamente')
  } catch (error) {
    if (error.message.includes('CORS')) {
      log('CORS', 'FAIL', 'CORS no configurado en el backend')
    } else {
      log('CORS', 'WARN', error.message)
    }
  }

  // Test 7: JWT token (si existe)
  try {
    const token = localStorage.getItem('authToken')
    if (token) {
      const response = await axios.get(`${API_URL}/auth/check`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      log('Autenticación JWT', 'PASS', `Token válido para usuario: ${response.data.usuario?.nombre || 'desconocido'}`)
    } else {
      log('Autenticación JWT', 'WARN', 'No hay token en localStorage')
    }
  } catch (error) {
    log('Autenticación JWT', 'WARN', 'Token inválido o expirado: ' + error.message)
  }

  // Resumen
  console.log('')
  console.log('%c=== RESUMEN ===', 'font-size: 14px; font-weight: bold; color: #2563eb')
  const passed = testResults.filter(r => r.status === 'PASS').length
  const failed = testResults.filter(r => r.status === 'FAIL').length
  const warnings = testResults.filter(r => r.status === 'WARN').length
  
  console.log(`%cPruebas exitosas: ${passed}`, 'color: #22c55e; font-weight: bold')
  console.log(`%cPruebas fallidas: ${failed}`, failed > 0 ? 'color: #ef4444; font-weight: bold' : 'color: #22c55e')
  console.log(`%cAdvertencias: ${warnings}`, warnings > 0 ? 'color: #eab308; font-weight: bold' : 'color: #22c55e')
  
  console.log('')
  console.log('%cResultados detallados:', 'font-weight: bold')
  console.table(testResults)

  return testResults
}

/**
 * Test específico para login
 */
export async function testLogin(email, password) {
  try {
    console.log(`%c[TEST] Probando login con ${email}`, 'color: #2563eb; font-weight: bold')
    const response = await axios.post(`${API_URL}/auth/login`, { email, password })
    console.log('%c[PASS] Login exitoso', 'color: #22c55e; font-weight: bold')
    console.log('Token:', response.data.token)
    console.log('Usuario:', response.data.usuario)
    return response.data
  } catch (error) {
    console.log('%c[FAIL] Login falló', 'color: #ef4444; font-weight: bold')
    console.log('Error:', error.response?.data || error.message)
    return null
  }
}

/**
 * Test específico para registrar usuario
 */
export async function testRegister(userData) {
  try {
    console.log(`%c[TEST] Probando registro`, 'color: #2563eb; font-weight: bold')
    const response = await axios.post(`${API_URL}/auth/register`, userData)
    console.log('%c[PASS] Registro exitoso', 'color: #22c55e; font-weight: bold')
    console.log('Usuario creado:', response.data.usuario)
    return response.data
  } catch (error) {
    console.log('%c[FAIL] Registro falló', 'color: #ef4444; font-weight: bold')
    console.log('Error:', error.response?.data || error.message)
    return null
  }
}

console.log('%c[INFO] Scripts de testing disponibles en consola:', 'color: #3b82f6')
console.log('1. await testBackendConnection() - Prueba general')
console.log('2. await testLogin("user@email.com", "password") - Test de login')
console.log('3. await testRegister({nombre, email, password}) - Test de registro')
