import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { Picture } from '../components/ui/Picture'
import { Illustration } from '../components/graphics/Botanical'
import { portraitImage, HERO_IMAGE_SIZES } from '../lib/images'
import { home, site } from '../lib/data'

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-10 pb-section md:pt-16" aria-labelledby="accueil-titre">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div className="max-w-2xl">
            <p className="flex items-center gap-3 text-xs font-medium tracking-[0.18em] text-accent-text uppercase">
              <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
              {home.hero.eyebrow}
            </p>

            <h1 id="accueil-titre" className="mt-6 text-5xl text-text md:text-6xl">
              {home.hero.title}
            </h1>

            <p className="mt-6 max-w-xl text-lg text-text-muted">{home.hero.text}</p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button to={home.hero.primaryCta.href} variant="primary" size="lg">
                {home.hero.primaryCta.label}
              </Button>
              <Button to={home.hero.secondaryCta.href} variant="secondary" size="lg">
                {home.hero.secondaryCta.label}
              </Button>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-text-muted">
              <li className="flex items-center gap-2">
                <Illustration name="leaf" className="size-5 text-moss-500" />
                Approche traditionnelle, sans promesse miracle
              </li>
              <li className="flex items-center gap-2">
                <Illustration name="shield" className="size-5 text-moss-500" />
                Protocoles validés avec un médecin agréé
              </li>
            </ul>
          </div>

          <figure className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="arch-mask relative bg-surface-alt">
              <Picture
                image={portraitImage}
                priority
                sizes={HERO_IMAGE_SIZES}
                imgClassName="h-full w-full object-cover"
              />
            </div>
            <figcaption className="mt-4 max-w-sm text-xs text-text-muted">
              {home.hero.imageCaption}
            </figcaption>
            <p className="sr-only">{site.brand.role}</p>
          </figure>
        </div>
      </Container>
    </section>
  )
}
