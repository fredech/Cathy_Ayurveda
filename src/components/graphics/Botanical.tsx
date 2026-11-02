import type { SVGProps } from 'react'

/**
 * Illustrations botaniques en SVG inline : aucune requête réseau, poids
 * négligeable, et elles suivent la couleur du texte (`currentColor`).
 * Toutes sont décoratives (`aria-hidden`), le sens est porté par le texte.
 */
type IconProps = SVGProps<SVGSVGElement>

const common = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: 'false' as const,
}

export function Leaf(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" {...common} {...props}>
      <path d="M39 9c0 16-10 26-26 27C13 20 23 10 39 9Z" />
      <path d="M13 36C19 27 26 20 34 14" />
      <path d="M22 26c-1-3-1-5-1-8M28 20c-3-1-5-1-8-1" />
    </svg>
  )
}

export function Sprig(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" {...common} {...props}>
      <path d="M24 42V14" />
      <path d="M24 22c-6 0-10-3-11-8 6-1 10 2 11 8Zm0 8c6 0 10-3 11-8-6-1-10 2-11 8Zm0-16c-5-2-7-5-7-10 5 0 7 4 7 10Zm0 8c5-2 7-5 7-10-5 0-7 4-7 10Z" />
    </svg>
  )
}

export function Sun(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" {...common} {...props}>
      <circle cx="24" cy="24" r="9" />
      <path d="M24 5v5M24 38v5M5 24h5M38 24h5M11 11l3.5 3.5M33.5 33.5 37 37M37 11l-3.5 3.5M14.5 33.5 11 37" />
    </svg>
  )
}

export function Shield(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" {...common} {...props}>
      <path d="M24 6c5 3.5 10 5 14 5 0 14-5 24-14 31C15 35 10 25 10 11c4 0 9-1.5 14-5Z" />
      <path d="m18 24 4.5 4.5L31 19" />
    </svg>
  )
}

/** Goutte d'huile : huile capilaire. */
export function Drop(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" {...common} {...props}>
      <path d="M24 6c6 9 10 14.5 10 20a10 10 0 0 1-20 0c0-5.5 4-11 10-20Z" />
      <path d="M19 28a5 5 0 0 0 5 5" />
    </svg>
  )
}

/** Racine : ashwagandha. */
export function Root(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" {...common} {...props}>
      <path d="M24 6c2 6 6 9 6 15 0 5-2.5 8-6 8s-6-3-6-8c0-6 4-9 6-15Z" />
      <path d="M24 29v13M24 34c-4 0-7 2-8 5M24 37c4 0 7 2 8 5" />
    </svg>
  )
}

/** Trois fruits : triphala. */
export function ThreeFruits(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" {...common} {...props}>
      <circle cx="16" cy="30" r="7" />
      <circle cx="32" cy="30" r="7" />
      <circle cx="24" cy="17" r="7" />
      <path d="M24 10V6M21 6h6" />
    </svg>
  )
}

/** Fruit rond : amla. */
export function RoundFruit(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" {...common} {...props}>
      <circle cx="24" cy="27" r="13" />
      <path d="M24 14c0-4 2-7 6-8-1 4-3 7-6 8Z" />
      <path d="M17 26c3 5 9 6 12 2" />
    </svg>
  )
}

/** Motif de séparation : une ligne avec un rameau central. */
export function Divider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={['flex items-center justify-center gap-4 text-sand-400', className ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      <span className="h-px w-16 bg-current opacity-60" />
      <Sprig className="size-6" />
      <span className="h-px w-16 bg-current opacity-60" />
    </div>
  )
}

export const illustrations = {
  leaf: Leaf,
  sun: Sun,
  shield: Shield,
  sprig: Sprig,
  drop: Drop,
  root: Root,
  'three-fruits': ThreeFruits,
  'round-fruit': RoundFruit,
} as const

export type IllustrationName = keyof typeof illustrations

interface IllustrationProps {
  name: string
  className?: string
}

export function Illustration({ name, className }: IllustrationProps) {
  const Icon = illustrations[name as IllustrationName] ?? Sprig
  return <Icon className={className} />
}
