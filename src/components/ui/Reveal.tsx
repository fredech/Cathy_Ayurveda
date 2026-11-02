import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useReveal } from '../../lib/useReveal'

interface RevealProps {
  children: ReactNode
  /** Balise à utiliser : évite un `div` superflu (par ex. `li`, `article`). */
  as?: ElementType
  /** Décalage en millisecondes pour un effet d'apparition échelonné. */
  delay?: number
  className?: string
}

/**
 * Enveloppe un bloc dont l'apparition est progressive au défilement.
 * L'animation est neutralisée si l'utilisateur préfère réduire les animations.
 */
export function Reveal({ children, as: Tag = 'div', delay = 0, className }: RevealProps) {
  const { ref, className: revealClass, style } = useReveal({ delayMs: delay })
  const merged = [revealClass, className ?? ''].filter(Boolean).join(' ')

  return (
    <Tag ref={ref} className={merged} style={style as CSSProperties | undefined}>
      {children}
    </Tag>
  )
}
