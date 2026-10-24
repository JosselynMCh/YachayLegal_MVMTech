import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Inicialización de internacionalización (debe importarse antes del App)
import './i18n/i18n'
import App from './app/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
