const LoadingSpinner = ({ message = 'Cargando...', size = 'lg' }) => {
  const sizeClasses = {
    sm: 'width: 1.5rem; height: 1.5rem;',
    md: 'width: 2rem; height: 2rem;',
    lg: 'width: 3rem; height: 3rem;'
  }

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="text-center">
        <div className="spinner-border text-danger" role="status" style={sizeClasses[size]}>
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-muted">{message}</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
