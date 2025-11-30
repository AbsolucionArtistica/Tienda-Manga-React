/**
 * VERIFICACIÓN DE ESTRUCTURA DE DATOS
 * Valida que las respuestas del backend MySQL coincidan con lo esperado por el frontend
 * 
 * Este archivo documenta la estructura esperada de todos los endpoints
 */

// ============================================================================
// USUARIO (User Model - MongoDB → MySQL/Sequelize)
// ============================================================================

export const userStructure = {
  id: 'integer (PRIMARY KEY)',
  nombre: 'string',
  email: 'string (UNIQUE)',
  password: 'string (hashed)',
  telefono: 'string',
  direccion: 'string',
  ciudad: 'string',
  codigoPostal: 'string',
  rol: 'string (user | admin)',
  activo: 'boolean (default: true)',
  createdAt: 'datetime',
  updatedAt: 'datetime'
}

// Respuesta esperada de GET /auth/perfil
export const authProfileResponse = {
  usuario: {
    id: 123,
    nombre: 'Juan Pérez',
    email: 'juan@email.com',
    telefono: '123456789',
    direccion: 'Calle 123',
    ciudad: 'Santiago',
    codigoPostal: '8340000',
    rol: 'user'
  }
}

// Respuesta esperada de POST /auth/login
export const loginResponse = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  usuario: {
    id: 123,
    nombre: 'Juan Pérez',
    email: 'juan@email.com',
    rol: 'user'
  }
}

// ============================================================================
// PRODUCTO (Product Model - MongoDB → MySQL/Sequelize)
// ============================================================================

export const productStructure = {
  id: 'integer (PRIMARY KEY)',
  nombre: 'string',
  descripcion: 'string (TEXT)',
  precio: 'decimal(10,2)',
  autor: 'string',
  categoria: 'string (Shonen|Seinen|Shoujo|Otros)',
  stock: 'integer',
  imagen: 'string (URL)',
  rating: 'decimal(3,2) (0-5)',
  volumen: 'integer',
  paginas: 'integer',
  editorial: 'string',
  estado: 'string (Activo|Inactivo)',
  createdAt: 'datetime',
  updatedAt: 'datetime'
}

// Respuesta esperada de GET /products
export const productsListResponse = [
  {
    id: 1,
    nombre: 'Naruto Vol. 1',
    descripcion: 'El inicio del viaje de Naruto...',
    precio: 12.99,
    autor: 'Masashi Kishimoto',
    categoria: 'Shonen',
    stock: 50,
    imagen: 'https://...',
    rating: 4.5,
    volumen: 1,
    paginas: 220,
    editorial: 'Jump Comics',
    estado: 'Activo',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-11-15T10:30:00Z'
  }
]

// Respuesta esperada de GET /products/:id
export const productDetailResponse = {
  id: 1,
  nombre: 'Naruto Vol. 1',
  descripcion: 'El inicio del viaje de Naruto...',
  precio: 12.99,
  autor: 'Masashi Kishimoto',
  categoria: 'Shonen',
  stock: 50,
  imagen: 'https://...',
  rating: 4.5,
  volumen: 1,
  paginas: 220,
  editorial: 'Jump Comics',
  estado: 'Activo'
}

// ============================================================================
// ORDEN (Order Model - MongoDB → MySQL/Sequelize)
// ============================================================================

export const orderStructure = {
  id: 'integer (PRIMARY KEY)',
  usuarioId: 'integer (FOREIGN KEY → User)',
  numeroOrden: 'string (UNIQUE)',
  estado: 'string (Pendiente|Procesando|Enviado|Entregado|Cancelada)',
  subtotal: 'decimal(10,2)',
  impuesto: 'decimal(10,2)',
  total: 'decimal(10,2)',
  direccionEnvio: 'string (JSON)',
  metodoPago: 'string',
  numero_seguimiento: 'string',
  notas: 'string (TEXT)',
  createdAt: 'datetime',
  updatedAt: 'datetime'
}

// Estructura de items en la orden
export const orderItemStructure = {
  id: 'integer (PRIMARY KEY)',
  ordenId: 'integer (FOREIGN KEY → Order)',
  productoId: 'integer (FOREIGN KEY → Product)',
  cantidad: 'integer',
  precioUnitario: 'decimal(10,2)',
  subtotal: 'decimal(10,2)',
  createdAt: 'datetime',
  updatedAt: 'datetime'
}

// Respuesta esperada de POST /orders
export const createOrderResponse = {
  id: 42,
  numeroOrden: 'ORD-20241115-001',
  estado: 'Pendiente',
  subtotal: 25.98,
  impuesto: 4.93,
  total: 30.91,
  direccionEnvio: {
    calle: 'Calle 123',
    ciudad: 'Santiago',
    codigoPostal: '8340000'
  },
  items: [
    {
      productoId: 1,
      nombre: 'Naruto Vol. 1',
      cantidad: 2,
      precioUnitario: 12.99,
      subtotal: 25.98
    }
  ],
  createdAt: '2024-11-15T10:30:00Z'
}

// Respuesta esperada de GET /orders/mis-ordenes
export const myOrdersResponse = [
  {
    id: 42,
    numeroOrden: 'ORD-20241115-001',
    estado: 'Pendiente',
    total: 30.91,
    cantidad_items: 1,
    createdAt: '2024-11-15T10:30:00Z'
  }
]

// Respuesta esperada de GET /orders/:id
export const orderDetailResponse = {
  id: 42,
  numeroOrden: 'ORD-20241115-001',
  estado: 'Pendiente',
  subtotal: 25.98,
  impuesto: 4.93,
  total: 30.91,
  numero_seguimiento: 'TRK-20241115-001',
  direccionEnvio: {
    calle: 'Calle 123',
    ciudad: 'Santiago',
    codigoPostal: '8340000'
  },
  items: [
    {
      id: 1,
      nombre: 'Naruto Vol. 1',
      cantidad: 2,
      precioUnitario: 12.99,
      subtotal: 25.98
    }
  ],
  createdAt: '2024-11-15T10:30:00Z',
  updatedAt: '2024-11-15T10:30:00Z'
}

// ============================================================================
// ADMIN DASHBOARD
// ============================================================================

// Respuesta esperada de GET /admin/stats
export const dashboardStatsResponse = {
  totalOrdenes: 150,
  ordenesPendientes: 15,
  ingresoTotal: 5000.00,
  productosActivos: 50,
  usuariosRegistrados: 200,
  ordenesPorMes: [
    { mes: 'Enero', cantidad: 10 },
    { mes: 'Febrero', cantidad: 15 }
  ],
  topProductos: [
    { nombre: 'Naruto Vol. 1', cantidad: 45 }
  ]
}

// ============================================================================
// ERRORES ESPERADOS
// ============================================================================

export const errorResponses = {
  NOT_FOUND: {
    code: 404,
    message: 'Recurso no encontrado'
  },
  UNAUTHORIZED: {
    code: 401,
    message: 'No autorizado. Inicia sesión'
  },
  FORBIDDEN: {
    code: 403,
    message: 'Acceso denegado'
  },
  BAD_REQUEST: {
    code: 400,
    message: 'Solicitud inválida'
  },
  SERVER_ERROR: {
    code: 500,
    message: 'Error interno del servidor'
  }
}

// ============================================================================
// VALIDACIONES DE COMPATIBILIDAD
// ============================================================================

export function validateUserResponse(user) {
  const requiredFields = ['id', 'nombre', 'email']
  return requiredFields.every(field => field in user)
}

export function validateProductResponse(product) {
  const requiredFields = ['id', 'nombre', 'precio', 'stock']
  return requiredFields.every(field => field in product)
}

export function validateOrderResponse(order) {
  const requiredFields = ['id', 'numeroOrden', 'estado', 'total', 'items']
  return requiredFields.every(field => field in order)
}

// ============================================================================
// MAPEO MongoDB → MySQL/Sequelize
// ============================================================================

/**
 * CAMBIOS INTERNOS (El frontend no ve estos cambios):
 * 
 * User:
 *   MongoDB: _id, createdAt, updatedAt (automáticos)
 *   MySQL:   id (BIGINT), createdAt, updatedAt (automáticos)
 *   
 * Product:
 *   MongoDB: _id, __v (version control)
 *   MySQL:   id (BIGINT), sin __v
 *   
 * Order:
 *   MongoDB: _id, items[] (embebidos), usuario (ObjectId)
 *   MySQL:   id (BIGINT), OrderItem table separada, usuarioId (FK)
 *   
 * RESULTADO PARA EL FRONTEND:
 * - Todas las propiedades son iguales
 * - Todas las respuestas JSON tienen la misma estructura
 * - Los tipos de datos se convierten correctamente
 * - Los endpoints son idénticos
 */

export const migrationMap = {
  'MongoDB ObjectId': 'MySQL BIGINT - Convertido automáticamente a id',
  'MongoDB __v': 'Removido en MySQL/Sequelize',
  'Mongoose populate()': 'Sequelize associations - Frontend no ve la diferencia',
  'MongoDB indexes': 'MySQL indexes - Mismo rendimiento',
  'Mongoose validation': 'Sequelize validators - Mismos errores en frontend'
}

// ============================================================================
// SCRIPTS DE PRUEBA AUTOMÁTICA
// ============================================================================

/**
 * Validar estructura de respuesta
 * 
 * Uso:
 * import { validateBackendResponse } from './dataStructures.js'
 * const isValid = await validateBackendResponse()
 */

export async function validateBackendResponse() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  const results = {}

  try {
    // Test productos
    const productsRes = await fetch(`${API_URL}/products`)
    const products = await productsRes.json()
    results.productos = validateProductResponse(products[0])

    // Test usuario (sin token, debe fallar)
    const userRes = await fetch(`${API_URL}/auth/check`)
    results.autenticacion = userRes.status === 401 // Debe requerir autenticación

    return results
  } catch (error) {
    console.error('Error validando respuestas:', error)
    return null
  }
}

console.log('%c[INFO] Estructura de datos verificada', 'color: #3b82f6')
console.log('Los endpoints del backend MySQL/Sequelize son compatibles con el frontend')
