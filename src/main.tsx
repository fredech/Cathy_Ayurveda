import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Élément #root introuvable dans index.html')
}

const tree = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Les pages sont pré-rendues au build : on hydrate le HTML existant.
// Si le fichier est ouvert sans HTML pré-rendu, on monte normalement.
if (container.hasChildNodes()) {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}
