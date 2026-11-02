import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import Home from './pages/Home'
import RoueAyurvedique from './pages/RoueAyurvedique'
import MonDosha from './pages/MonDosha'
import Produits from './pages/Produits'
import Coaching from './pages/Coaching'
import Contact from './pages/Contact'
import Confidentialite from './pages/Confidentialite'
import NotFound from './pages/NotFound'

/**
 * Routes du site. Chaque page est rendue dans la mise en page commune
 * (en-tête collant, contenu principal, pied de page).
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="roue-ayurvedique" element={<RoueAyurvedique />} />
        <Route path="mon-dosha" element={<MonDosha />} />
        <Route path="produits" element={<Produits />} />
        <Route path="coaching" element={<Coaching />} />
        <Route path="contact" element={<Contact />} />
        <Route path="confidentialite" element={<Confidentialite />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
