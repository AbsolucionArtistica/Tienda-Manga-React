# Tienda Manga - Frontend React

E-commerce de manga construido con React + Vite, conectado a backend Node.js/Express con MySQL/Sequelize.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Luego abre la consola (F12) y ejecuta:
```javascript
await runFullCheckup()
```

Ver más en `QUICK_START.md`

## 📁 Estructura

```
src/
├── components/      # Componentes React
├── pages/          # Páginas principales
├── services/       # Servicios HTTP (api.js, authService, etc.)
├── context/        # Context API (Auth, Cart, Notification)
├── hooks/          # Custom hooks
├── utils/          # Utilidades y testing
└── styles/         # CSS
```

## 🔧 Características

- ✅ Autenticación con JWT
- ✅ Catálogo de productos con filtros
- ✅ Carrito de compras
- ✅ Sistema de órdenes
- ✅ Panel de administrador
- ✅ Perfil de usuario
- ✅ Responsive design

## 📦 Dependencias

- React 19.1.1
- Vite 7.1.7
- react-router-dom 7.9.3
- axios 1.7.0
- react-toastify 10.0.0

## 🌐 Configuración

Archivo `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=MangoManga
```

El backend debe estar corriendo en `http://localhost:5000`

## 🛠️ Testing Automático

Desde la consola del navegador:

```javascript
// Verificación completa
await runFullCheckup()

// Probar endpoint específico
await testEndpoint('/products')
```

## 📝 Cambios Recientes

**Migración MongoDB → MySQL/Sequelize**
- Backend actualizado a MySQL
- Frontend compatible sin cambios
- Todos los endpoints funcional iguales
- Ver QUICK_START.md para detalles

## 📞 Soporte

Ver `QUICK_START.md` para troubleshooting y guías de uso.
