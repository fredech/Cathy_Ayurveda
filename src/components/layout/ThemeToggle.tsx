import { useSyncExternalStore } from 'react'
import { getPreferredTheme, setTheme, subscribeToTheme, type Theme } from '../../lib/theme'

const serverSnapshot = (): Theme => 'light'

/**
 * Bascule clair / sombre.
 *
 * `useSyncExternalStore` évite tout écart d'hydratation : le rendu serveur et
 * le premier rendu client utilisent l'instantané serveur (« clair »), puis le
 * thème réel est appliqué. Le choix est mémorisé sur l'appareil.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribeToTheme, getPreferredTheme, serverSnapshot)
  const isDark = theme === 'dark'
  const nextLabel = isDark ? 'passer en thème clair' : 'passer en thème sombre'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`Changer de thème : ${nextLabel}`}
      title={`Changer de thème : ${nextLabel}`}
      className={[
        'inline-flex size-11 items-center justify-center rounded-full border border-line text-text transition-colors duration-200 hover:border-accent hover:text-accent-text',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span aria-hidden="true" className="block">
        {isDark ? (
          // Lune
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" strokeLinecap="round" />
          </svg>
        ) : (
          // Soleil
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="12" cy="12" r="4.2" />
            <path
              d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
    </button>
  )
}
