const ErrorAlert = ({ message, onClose, variant = 'danger' }) => {
  if (!message) return null

  return (
    <div className={`alert alert-${variant} alert-dismissible fade show`} role="alert">
      <strong>Error:</strong> {message}
      {onClose && (
        <button 
          type="button" 
          className="btn-close" 
          onClick={onClose}
          aria-label="Cerrar"
        ></button>
      )}
    </div>
  )
}

export default ErrorAlert
