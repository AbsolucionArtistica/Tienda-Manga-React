import React from 'react'
import { renderToString } from 'react-dom/server'
import App from '../src/App.jsx'

try {
  const output = renderToString(React.createElement(App))
  if (typeof output === 'string' && output.length > 0) {
    console.log('✓ Prueba de renderizado de App: EXITOSA')
    process.exit(0)
  } else {
    console.error('✗ Prueba de renderizado de App: FALLIDA - salida vacía')
    process.exit(1)
  }
} catch (err) {
  console.error('✗ Prueba de renderizado de App: FALLIDA - error durante el renderizado')
  console.error(err)
  process.exit(1)
}
