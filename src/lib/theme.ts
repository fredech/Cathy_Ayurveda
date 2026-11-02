/**
 * Gestion du thème clair / sombre.
 *
 * Le script d'initialisation dans `index.html` définit déjà `data-theme` et
 * `data-js` avant le premier rendu, ce qui évite tout clignotement. Ce module
 * fournit l'état au composant `<ThemeToggle />` via `useSyncExternalStore`.
 */
export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'cathy-theme'

/** Événement émis quand le choix de thème change, pour réveiller les abonnés. */
export const THEME_EVENT = 'cathy-theme-change'

export function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? (value as Theme) : null
  } catch {
    // Stockage indisponible (navigation privée, réglages) : on ignore.
    return null
  }
}

export function getPreferredTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = getStoredTheme()
  if (stored) return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function setTheme(theme: Theme): void {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', theme)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#141813' : '#fdfaf3')
  }
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Pas de stockage disponible : le thème reste valable pour la visite.
    }
    window.dispatchEvent(new Event(THEME_EVENT))
  }
}

/** Abonnement aux changements de thème (choix manuel ou préférence système). */
export function subscribeToTheme(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  media.addEventListener('change', callback)
  window.addEventListener(THEME_EVENT, callback)
  return () => {
    media.removeEventListener('change', callback)
    window.removeEventListener(THEME_EVENT, callback)
  }
}
