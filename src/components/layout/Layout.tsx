import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

/** Remet la page en haut lors d'un changement de route (sans casser le focus). */
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'auto' })
  }, [pathname])

  return null
}

export function Layout() {
  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-button-bg focus:px-5 focus:py-3 focus:text-sm focus:text-button-text focus:no-underline"
      >
        Aller au contenu principal
      </a>
      <ScrollToTop />
      <Header />
      <main id="contenu" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
