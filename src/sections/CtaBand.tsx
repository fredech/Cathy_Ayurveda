import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { Reveal } from '../components/ui/Reveal'
import { Sprig } from '../components/graphics/Botanical'

interface CtaBandProps {
  title: string
  text: string
  ctaLabel: string
  ctaTo?: string
  /** Action secondaire optionnelle. */
  secondaryLabel?: string
  secondaryTo?: string
}

/** Appel à l'action de fin de page, répété sobrement sur tout le site. */
export function CtaBand({
  title,
  text,
  ctaLabel,
  ctaTo = '/contact',
  secondaryLabel,
  secondaryTo,
}: CtaBandProps) {
  return (
    <section className="py-section" aria-labelledby="cta-titre">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-xl border border-line bg-surface-alt px-7 py-14 text-center md:px-16 md:py-20">
            <Sprig
              aria-hidden="true"
              className="pointer-events-none absolute -top-6 -right-6 size-40 text-moss-300 opacity-30"
            />
            <Sprig
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-10 -left-8 size-44 text-clay-200 opacity-40"
            />
            <h2 id="cta-titre" className="relative mx-auto max-w-2xl text-3xl text-text md:text-4xl">
              {title}
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-base text-text-muted">{text}</p>
            <div className="relative mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button to={ctaTo} variant="primary" size="lg">
                {ctaLabel}
              </Button>
              {secondaryLabel && secondaryTo ? (
                <Button to={secondaryTo} variant="quiet" size="lg">
                  {secondaryLabel}
                </Button>
              ) : null}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
