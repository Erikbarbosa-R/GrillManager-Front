import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './style.css'
import { initializeDefaultData } from './utils/dataManager'

// Inicializa dados padrão se necessário
initializeDefaultData();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
