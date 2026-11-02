import type { ReactNode } from 'react'
import { Container } from '../components/ui/Container'
import { Divider } from '../components/graphics/Botanical'

interface PageHeroProps {
  eyebrow?: string
  title: string
  intro?: ReactNode
  /** Élément optionnel affiché sous l'introduction (boutons, note). */
  aside?: ReactNode
  /** Identifiant unique pour `aria-labelledby`. */
  id: string
}

/** En-tête commun aux pages intérieures : même rythme, un seul `h1` par page. */
export function PageHero({ eyebrow, title, intro, aside, id }: PageHeroProps) {
  return (
    <section className="pt-12 pb-4 md:pt-16" aria-labelledby={id}>
      <Container>
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="flex items-center gap-3 text-xs font-medium tracking-[0.18em] text-accent-text uppercase">
              <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
              {eyebrow}
            </p>
          ) : null}
          <h1 id={id} className="mt-6 text-4xl text-text md:text-5xl">
            {title}
          </h1>
          {intro ? <div className="mt-6 text-lg text-text-muted [&_p]:m-0">{intro}</div> : null}
          {aside ? <div className="mt-8">{aside}</div> : null}
        </div>
        <Divider className="mt-12 justify-start" />
      </Container>
    </section>
  )
}
