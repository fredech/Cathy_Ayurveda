import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { headerNav, site } from '../../lib/data'
import { Button } from '../ui/Button'
import { ThemeToggle } from './ThemeToggle'

function Logo() {
  return (
    <NavLink
      to="/"
      className="group flex items-center gap-3 no-underline"
      aria-label={`${site.brand.name} — retour à l'accueil`}
    >
      <span aria-hidden="true" className="logo-mark size-11 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg tracking-tight text-text">{site.brand.logoText}</span>
        <span className="mt-0.5 text-2xs tracking-[0.16em] text-text-muted uppercase">
          {site.brand.logoSub}
        </span>
      </span>
    </NavLink>
  )
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  /**
   * Chemin pour lequel le menu mobile a été ouvert. Le menu se referme donc
   * tout seul après un changement de page, sans effet ni état synchronisé.
   */
  const [openPath, setOpenPath] = useState<string | null>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const open = openPath === location.pathname

  // Léger surlignage du bandeau au défilement.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Fermeture au clavier (Échap) et piège simple du focus dans le panneau.
  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenPath(null)
        toggleRef.current?.focus()
      }
      if (event.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open])

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'relative inline-flex min-h-11 items-center rounded-full px-3 text-sm no-underline transition-colors duration-200',
      isActive ? 'text-accent-text font-medium' : 'text-text-muted hover:text-text',
    ].join(' ')

  return (
    <header
      className={[
        'no-print sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300',
        scrolled
          ? 'border-line bg-bg/88 backdrop-blur-md supports-[backdrop-filter]:bg-bg/75'
          : 'border-transparent bg-bg/70 backdrop-blur-sm',
      ].join(' ')}
    >
      <div className="container-page flex h-[var(--spacing-header)] items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {headerNav
              .filter((item) => item.path !== '/')
              .map((item) => (
                <li key={item.id}>
                  <NavLink to={item.path} className={navLinkClass} end={item.path === '/'}>
                    {item.navLabel ?? item.label}
                  </NavLink>
                </li>
              ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button to="/contact" variant="primary" size="md" className="hidden sm:inline-flex">
            Réserver une consultation
          </Button>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpenPath(open ? null : location.pathname)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="inline-flex size-11 items-center justify-center rounded-full border border-line text-text lg:hidden"
          >
            <span className="sr-only">{open ? 'Fermer le menu' : 'Ouvrir le menu'}</span>
            <span aria-hidden="true" className="flex flex-col gap-1.5">
              <span
                className={[
                  'block h-px w-5 bg-current transition-transform duration-300',
                  open ? 'translate-y-[3.5px] rotate-45' : '',
                ].join(' ')}
              />
              <span
                className={[
                  'block h-px w-5 bg-current transition-transform duration-300',
                  open ? '-translate-y-[3.5px] -rotate-45' : '',
                ].join(' ')}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Panneau mobile */}
      <div
        id="menu-mobile"
        ref={panelRef}
        hidden={!open}
        className="border-t border-line bg-bg lg:hidden"
      >
        <nav aria-label="Navigation mobile" className="container-page py-4">
          <ul className="flex flex-col">
            {headerNav.map((item) => (
              <li key={item.id} className="border-b border-line last:border-b-0">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    [
                      'flex min-h-14 items-center font-display text-xl no-underline',
                      isActive ? 'text-accent-text' : 'text-text',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Button to="/contact" variant="primary" size="lg" fullWidth className="mt-6">
            Réserver une consultation
          </Button>
        </nav>
      </div>
    </header>
  )
}
