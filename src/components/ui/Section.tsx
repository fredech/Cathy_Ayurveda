import type { ReactNode } from 'react'
import { Container } from './Container'

interface SectionProps {
  children: ReactNode
  /** Identifiant de la section, utilisé par `aria-labelledby` si un titre existe. */
  id?: string
  /** Surtitre discret au-dessus du titre. */
  eyebrow?: string
  title?: string
  intro?: ReactNode
  /** Niveau du titre, pour garder une hiérarchie de titres propre. */
  headingLevel?: 2 | 3
  tone?: 'default' | 'alt' | 'surface'
  /** Retarde le rendu des sections basses de page. */
  defer?: boolean
  className?: string
  headerClassName?: string
}

const tones = {
  default: '',
  alt: 'bg-bg-alt',
  surface: 'bg-surface',
}

export function Section({
  children,
  id,
  eyebrow,
  title,
  intro,
  headingLevel = 2,
  tone = 'default',
  defer = false,
  className,
  headerClassName,
}: SectionProps) {
  const headingId = id ? `${id}-titre` : undefined
  const Heading = headingLevel === 2 ? 'h2' : 'h3'

  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      className={[
        'py-section',
        tones[tone],
        defer ? 'defer-paint' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Container>
        {title || intro || eyebrow ? (
          <header className={['max-w-3xl', headerClassName ?? ''].filter(Boolean).join(' ')}>
            {eyebrow ? (
              <p className="mb-3 text-xs font-medium tracking-[0.18em] text-accent-text uppercase">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <Heading id={headingId} className="text-3xl md:text-4xl">
                {title}
              </Heading>
            ) : null}
            {intro ? (
              <div className="mt-4 text-lg text-text-muted md:mt-5 [&_p]:m-0 [&_p+p]:mt-4">
                {intro}
              </div>
            ) : null}
          </header>
        ) : null}
        <div className={title || intro || eyebrow ? 'mt-10 md:mt-14' : ''}>{children}</div>
      </Container>
    </section>
  )
}
