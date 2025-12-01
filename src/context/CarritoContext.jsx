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

export const CarritoProvider = ({ children }) => {
  // Inicializar carrito desde localStorage
  const [carrito, dispatch] = useReducer(carritoReducer, [], () => {
    const localData = localStorage.getItem('carrito')
    return localData ? JSON.parse(localData) : []
  })

  const [isOpen, setIsOpen] = useState(false)

  // Guardar en localStorage cada vez que cambia el carrito
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito))
  }, [carrito])

  // Acciones
  const agregarAlCarrito = (producto) => {
    dispatch({ type: 'AGREGAR_PRODUCTO', payload: producto })
    setIsOpen(true)
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

  // Cálculos
  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0)
  const precioTotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)

  // Funciones para controlar la apertura del carrito lateral
  const abrirCarrito = () => setIsOpen(true)
  const cerrarCarrito = () => setIsOpen(false)
  const toggleCarrito = () => setIsOpen(v => !v)

  const value = {
    carrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    cantidadTotal,
    precioTotal,
    isOpen,
    abrirCarrito,
    cerrarCarrito,
    toggleCarrito
  }

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

export default CarritoContext
