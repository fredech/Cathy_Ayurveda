import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, RefObject } from 'react'

const SUPPORTS_ANIMATION_TIMELINE =
  typeof CSS !== 'undefined' && 'supports' in CSS && CSS.supports('animation-timeline: view()')

interface RevealOptions {
  delayMs?: number
  rootMargin?: string
}

interface RevealState {
  ref: RefObject<HTMLDivElement | null>
  className: string
  style: CSSProperties | undefined
}

/**
 * Gestion des apparitions au défilement, en deux niveaux :
 *
 * 1. Navigateur compatible `animation-timeline: view()` → animation pilotée par
 *    le défilement (classe CSS `.reveal`), sans JavaScript ni observateur.
 * 2. Sinon → repli avec `IntersectionObserver` et la classe `.js-reveal`,
 *    qui devient `.is-visible` à l'entrée dans le viewport.
 *
 * `prefers-reduced-motion: reduce` est traité en CSS (`src/styles/index.css`) :
 * dans ce cas, le contenu est visible d'emblée et l'animation est neutralisée.
 */
export function useReveal(options?: RevealOptions): RevealState {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const delayMs = options?.delayMs ?? 0
  const rootMargin = options?.rootMargin ?? '-4% 0px -16%'
  const style = delayMs > 0 ? ({ '--reveal-delay': `${delayMs}ms` } as CSSProperties) : undefined

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(node)
          }
        })
      },
      { threshold: 0.08, rootMargin },
    )
    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [rootMargin])

  if (SUPPORTS_ANIMATION_TIMELINE) {
    return { ref, className: 'reveal', style }
  }

  return {
    ref,
    className: isVisible ? 'js-reveal is-visible' : 'js-reveal',
    style,
  }
}
