import type { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  /** `prose` limite la largeur pour les blocs de texte long. */
  variant?: 'page' | 'prose'
  className?: string
}

export function Container({ children, variant = 'page', className }: ContainerProps) {
  const base = variant === 'prose' ? 'container-prose' : 'container-page'
  return <div className={className ? `${base} ${className}` : base}>{children}</div>
}
