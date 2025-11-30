import { Link } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import { formatearPrecio } from '../data/mangas'
import { useNotification } from '../hooks/useNotification'

const ProductCard = ({ product }) => {
  const { agregarAlCarrito } = useCarrito()
  const { success } = useNotification()

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (product.stock === 0) return
    agregarAlCarrito(product)
    success(`${product.nombre} agregado al carrito`)
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className="text-warning">
          ★
        </span>
      )
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-warning">
          ☆
        </span>
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-muted">
          ☆
        </span>
      )
    }

    return stars
  }

  return (
    <div className="card h-100 shadow-sm border-0 product-card">
      <Link to={`/producto/${product.id}`} className="text-decoration-none">
        <div style={{ height: '280px', overflow: 'hidden' }}>
          <img
            src={product.imagen}
            className="card-img-top"
            alt={product.nombre}
            style={{
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x400?text=Manga'
            }}
          />
        </div>
      </Link>

      <div className="card-body d-flex flex-column">
        <Link to={`/producto/${product.id}`} className="text-decoration-none">
          <h6 className="card-title mb-1 text-dark">{product.nombre}</h6>
        </Link>

        <p className="text-muted small mb-1">{product.autor}</p>

        {product.rating && (
          <div className="small mb-2">
            {renderStars(product.rating)}
            <span className="text-muted ms-1">({product.rating.toFixed(1)})</span>
          </div>
        )}

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-danger fw-bold h5 mb-0">
              {formatearPrecio(product.precio)}
            </span>
            {product.stock > 0 && product.stock < 5 && (
              <span className="badge bg-warning text-dark">
                {product.stock} disponibles
              </span>
            )}
          </div>

          <div className="d-grid gap-2">
            <button
              className="btn btn-sm btn-danger"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <i className="fas fa-shopping-cart me-1"></i>
              {product.stock === 0 ? 'Agotado' : 'Agregar'}
            </button>
            <Link
              to={`/producto/${product.id}`}
              className="btn btn-sm btn-outline-secondary"
            >
              Ver detalles
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
