import { createContext, useContext, useReducer, useEffect, useState } from 'react'

// Crear el contexto
const CarritoContext = createContext()

// Reducer para manejar las acciones del carrito
const carritoReducer = (state, action) => {
  switch (action.type) {
    case 'AGREGAR_PRODUCTO':
      const productoExistente = state.find(item => item.id === action.payload.id)
      
      if (productoExistente) {
        // Si el producto ya existe, incrementar cantidad
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      } else {
        // Si es nuevo, agregarlo con cantidad 1
        return [...state, { ...action.payload, cantidad: 1 }]
      }

    case 'ELIMINAR_PRODUCTO':
      return state.filter(item => item.id !== action.payload)

    case 'ACTUALIZAR_CANTIDAD':
      if (action.payload.cantidad <= 0) {
        return state.filter(item => item.id !== action.payload.id)
      }
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, cantidad: action.payload.cantidad }
          : item
      )

    case 'VACIAR_CARRITO':
      return []

    case 'CARGAR_CARRITO':
      return action.payload

    default:
      return state
  }
}

// Provider del contexto
export const CarritoProvider = ({ children }) => {
  const [carrito, dispatch] = useReducer(carritoReducer, [])
  const [isOpen, setIsOpen] = useState(false)

  // Cargar carrito desde localStorage al inicio
  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito')
    if (carritoGuardado) {
      dispatch({ type: 'CARGAR_CARRITO', payload: JSON.parse(carritoGuardado) })
    }
  }, [])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito))
  }, [carrito])

  // Funciones helper
  const agregarAlCarrito = (producto) => {
    dispatch({ type: 'AGREGAR_PRODUCTO', payload: producto })
  }

  const eliminarDelCarrito = (id) => {
    dispatch({ type: 'ELIMINAR_PRODUCTO', payload: id })
  }

  const actualizarCantidad = (id, cantidad) => {
    dispatch({ type: 'ACTUALIZAR_CANTIDAD', payload: { id, cantidad } })
  }

  const vaciarCarrito = () => {
    dispatch({ type: 'VACIAR_CARRITO' })
  }

  // Calcular totales
  const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0)
  const precioTotal = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0)

  const value = {
    carrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    cantidadTotal,
    precioTotal
  }

  // funciones para controlar la apertura del carrito lateral
  const abrirCarrito = () => setIsOpen(true)
  const cerrarCarrito = () => setIsOpen(false)
  const toggleCarrito = () => setIsOpen(v => !v)

  value.isOpen = isOpen
  value.abrirCarrito = abrirCarrito
  value.cerrarCarrito = cerrarCarrito
  value.toggleCarrito = toggleCarrito

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  )
}

// Hook personalizado para usar el contexto
export const useCarrito = () => {
  const context = useContext(CarritoContext)
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de un CarritoProvider')
  }
  return context
}