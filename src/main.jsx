import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'

// Scripts de testing disponibles en desarrollo
if (import.meta.env.DEV) {
  // eslint-disable-next-line no-unused-vars
  import('./utils/testEndpoints.js')
  // eslint-disable-next-line no-unused-vars
  import('./utils/verificationChecklist.js')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
