/**
 * CHECKLIST DE VERIFICACIÓN INTERACTIVO
 * Herramienta para verificar que todo está correctamente configurado
 * 
 * Uso en consola:
 * import { runFullCheckup } from './verificationChecklist.js'
 * await runFullCheckup()
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const checks = []

function log(title, message, status = 'INFO') {
  const colors = {
    PASS: '#22c55e',
    FAIL: '#ef4444',
    WARN: '#eab308',
    INFO: '#3b82f6'
  }
  
  console.log(`%c[${status}] ${title}`, `color: ${colors[status]}; font-weight: bold`, message)
  checks.push({ title, message, status })
}

/**
 * Ejecutar verificación completa
 */
export async function runFullCheckup() {
  console.clear()
  console.log('%c╔════════════════════════════════════════════════════════════╗', 'color: #3b82f6')
  console.log('%c║  VERIFICACIÓN COMPLETA - Frontend MySQL/Sequelize        ║', 'color: #3b82f6')
  console.log('%c╚════════════════════════════════════════════════════════════╝', 'color: #3b82f6')
  console.log('')

  checks.length = 0

  // ========================================================================
  // SECCIÓN 1: CONFIGURACIÓN
  // ========================================================================
  console.log('%c📋 SECCIÓN 1: CONFIGURACIÓN', 'font-size: 14px; font-weight: bold; color: #3b82f6')
  console.log('')

  // Check 1.1: VITE_API_URL
  const apiUrl = import.meta.env.VITE_API_URL
  if (apiUrl) {
    log('API URL', `${apiUrl}`, 'PASS')
  } else {
    log('API URL', 'No configurada, usando default', 'WARN')
  }

  // Check 1.2: App Name
  const appName = import.meta.env.VITE_APP_NAME
  log('App Name', appName || 'MangoManga', 'PASS')

  // Check 1.3: Environment
  const env = import.meta.env.MODE
  log('Environment', `${env} mode`, 'PASS')

  console.log('')

  // ========================================================================
  // SECCIÓN 2: CONEXIÓN A BACKEND
  // ========================================================================
  console.log('%c🌐 SECCIÓN 2: CONEXIÓN A BACKEND', 'font-size: 14px; font-weight: bold; color: #3b82f6')
  console.log('')

  // Check 2.1: Disponibilidad del servidor
  let serverOnline = false
  try {
    const response = await fetch(`${API_URL}/products`, { timeout: 5000 })
    serverOnline = response.ok
    log('Servidor Backend', `${API_URL} (${response.status})`, 'PASS')
  } catch (error) {
    log('Servidor Backend', `No disponible: ${error.message}`, 'FAIL')
  }

  if (!serverOnline) {
    console.log('%c⚠️ El backend no está disponible. Algunos checks se saltarán.', 'color: #eab308')
    console.log('')
  }

  // Check 2.2: CORS
  if (serverOnline) {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'OPTIONS',
        headers: { 'Access-Control-Request-Method': 'GET' }
      })
      log('CORS', 'Habilitado correctamente', 'PASS')
    } catch (error) {
      log('CORS', 'Puede no estar configurado', 'WARN')
    }
  }

  console.log('')

  // ========================================================================
  // SECCIÓN 3: DATOS DEL BACKEND
  // ========================================================================
  console.log('%c📊 SECCIÓN 3: DATOS DEL BACKEND', 'font-size: 14px; font-weight: bold; color: #3b82f6')
  console.log('')

  if (serverOnline) {
    try {
      const response = await fetch(`${API_URL}/products`)
      const products = await response.json()
      
      if (Array.isArray(products) && products.length > 0) {
        log('Productos', `${products.length} productos en base de datos`, 'PASS')
        
        // Verificar estructura
        const firstProduct = products[0]
        const requiredFields = ['id', 'nombre', 'precio']
        const hasFields = requiredFields.every(f => f in firstProduct)
        
        if (hasFields) {
          log('Estructura de Productos', 'Correcta', 'PASS')
        } else {
          log('Estructura de Productos', 'Campos faltantes', 'WARN')
        }
      } else {
        log('Productos', 'Ninguno en base de datos', 'WARN')
      }
    } catch (error) {
      log('Productos', `Error: ${error.message}`, 'FAIL')
    }
  }

  console.log('')

  // ========================================================================
  // SECCIÓN 4: AUTENTICACIÓN
  // ========================================================================
  console.log('%c🔐 SECCIÓN 4: AUTENTICACIÓN', 'font-size: 14px; font-weight: bold; color: #3b82f6')
  console.log('')

  // Check 4.1: Token en localStorage
  const token = localStorage.getItem('authToken')
  if (token) {
    log('Token', 'Encontrado en localStorage', 'PASS')
    log('Token (primeros 20 chars)', token.substring(0, 20) + '...', 'INFO')
  } else {
    log('Token', 'No hay sesión activa', 'INFO')
  }

  // Check 4.2: Usuario en localStorage
  const user = localStorage.getItem('user')
  if (user) {
    try {
      const userData = JSON.parse(user)
      log('Usuario', `${userData.nombre || userData.email}`, 'PASS')
    } catch {
      log('Usuario', 'Datos corruptos', 'WARN')
    }
  } else {
    log('Usuario', 'Sin autenticar', 'INFO')
  }

  // Check 4.3: Test de endpoint protegido
  if (serverOnline) {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const response = await fetch(`${API_URL}/auth/check`, { headers })
      
      if (response.status === 401) {
        log('Endpoint /auth/check', 'Autenticación requerida (correcto)', 'PASS')
      } else if (response.ok) {
        log('Endpoint /auth/check', 'Usuario autenticado', 'PASS')
      } else {
        log('Endpoint /auth/check', `Status ${response.status}`, 'WARN')
      }
    } catch (error) {
      log('Endpoint /auth/check', error.message, 'WARN')
    }
  }

  console.log('')

  // ========================================================================
  // SECCIÓN 5: CARRITO
  // ========================================================================
  console.log('%c🛒 SECCIÓN 5: CARRITO', 'font-size: 14px; font-weight: bold; color: #3b82f6')
  console.log('')

  const cart = localStorage.getItem('carrito')
  if (cart) {
    try {
      const cartData = JSON.parse(cart)
      log('Carrito', `${cartData.items?.length || 0} items`, 'PASS')
    } catch {
      log('Carrito', 'Datos corruptos', 'WARN')
    }
  } else {
    log('Carrito', 'Vacío', 'INFO')
  }

  console.log('')

  // ========================================================================
  // SECCIÓN 6: NAVEGADOR
  // ========================================================================
  console.log('%c🌍 SECCIÓN 6: NAVEGADOR', 'font-size: 14px; font-weight: bold; color: #3b82f6')
  console.log('')

  // Check 6.1: localStorage
  try {
    localStorage.setItem('__test', 'test')
    localStorage.removeItem('__test')
    log('localStorage', 'Habilitado', 'PASS')
  } catch {
    log('localStorage', 'Deshabilitado', 'FAIL')
  }

  // Check 6.2: Cookies
  log('Cookies', navigator.cookieEnabled ? 'Habilitadas' : 'Deshabilitadas', 
    navigator.cookieEnabled ? 'PASS' : 'WARN')

  // Check 6.3: Versión
  log('User Agent', navigator.userAgent.substring(0, 50) + '...', 'INFO')

  console.log('')

  // ========================================================================
  // RESUMEN
  // ========================================================================
  console.log('%c╔════════════════════════════════════════════════════════════╗', 'color: #3b82f6')
  console.log('%c║  RESUMEN                                                   ║', 'color: #3b82f6')
  console.log('%c╚════════════════════════════════════════════════════════════╝', 'color: #3b82f6')
  console.log('')

  const passed = checks.filter(c => c.status === 'PASS').length
  const failed = checks.filter(c => c.status === 'FAIL').length
  const warnings = checks.filter(c => c.status === 'WARN').length

  console.log(`%c✅ Verificaciones exitosas: ${passed}`, 'color: #22c55e; font-weight: bold')
  console.log(`%c⚠️  Advertencias: ${warnings}`, warnings > 0 ? 'color: #eab308; font-weight: bold' : 'color: #22c55e')
  console.log(`%c❌ Errores: ${failed}`, failed > 0 ? 'color: #ef4444; font-weight: bold' : 'color: #22c55e')

  console.log('')
  
  if (serverOnline && failed === 0) {
    console.log('%c🎉 TODO ESTÁ LISTO PARA USAR', 'font-size: 14px; font-weight: bold; color: #22c55e')
  } else if (failed > 0) {
    console.log('%c⚠️  REQUIERE ATENCIÓN', 'font-size: 14px; font-weight: bold; color: #ef4444')
  } else {
    console.log('%cℹ️  Verificación completada', 'font-size: 14px; font-weight: bold; color: #3b82f6')
  }

  console.log('')
  console.table(checks)

  return {
    passed,
    failed,
    warnings,
    checks,
    isReady: failed === 0 && serverOnline
  }
}

/**
 * Probar endpoint específico
 */
export async function testEndpoint(path, method = 'GET', data = null) {
  const url = `${API_URL}${path}`
  const token = localStorage.getItem('authToken')
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  try {
    const response = await fetch(url, options)
    const result = {
      status: response.status,
      ok: response.ok,
      headers: Object.fromEntries(response.headers)
    }

    try {
      result.body = await response.json()
    } catch {
      result.body = await response.text()
    }

    console.log(`%c[${result.status}] ${method} ${path}`, 
      result.ok ? 'color: #22c55e; font-weight: bold' : 'color: #ef4444; font-weight: bold')
    console.log(result.body)

    return result
  } catch (error) {
    console.error(`Error en ${method} ${path}:`, error)
    return null
  }
}

/**
 * Exportar resultados
 */
export function exportResults(results) {
  const json = JSON.stringify(results, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `verificacion-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// Mostrar ayuda en consola
console.log('%c📚 Funciones disponibles:', 'font-weight: bold; color: #3b82f6')
console.log('await runFullCheckup()          - Verificación completa')
console.log('testEndpoint(\'/path\')          - Probar endpoint')
console.log('testEndpoint(\'/path\', \'POST\', data) - POST a endpoint')
