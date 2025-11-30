const SuccessAlert = ({ message, onClose }) => {
  if (!message) return null

  return (
    <div className="alert alert-success alert-dismissible fade show" role="alert">
      <strong>Éxito:</strong> {message}
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

export default SuccessAlert
