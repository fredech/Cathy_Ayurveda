import { coaching, site } from '../lib/data'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { Button } from '../components/ui/Button'
import { MissingData } from '../components/ui/MissingData'
import { Sprig } from '../components/graphics/Botanical'

/** Les deux formules : une séance ponctuelle, ou un accompagnement d'un mois. */
export function OffersGrid() {
  return (
    <Section
      id="formules"
      title="Deux formules"
      intro={<p>{coaching.intro}</p>}
      defer
    >
      <ul className="grid gap-6 lg:grid-cols-2">
        {coaching.offers.map((offer, index) => (
          <Reveal as="li" key={offer.id} delay={index * 90}>
            <article
              className={[
                'relative flex h-full flex-col rounded-xl border p-8 md:p-10',
                offer.highlight
                  ? 'border-accent bg-accent-soft'
                  : 'border-line bg-surface',
              ].join(' ')}
            >
              {offer.badge ? (
                <p className="absolute -top-3 left-8 m-0 rounded-full bg-button-bg px-4 py-1 text-2xs font-medium tracking-[0.14em] text-button-text uppercase">
                  {offer.badge}
                </p>
              ) : null}

              <h3 className="text-2xl text-text md:text-3xl">{offer.name}</h3>
              <p className="mt-3 text-base text-text-muted">{offer.tagline}</p>
              <p className="mt-5 text-sm text-text-muted">{offer.description}</p>

              <ul className="mt-7 space-y-3 text-sm text-text">
                {offer.includes.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Sprig aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-moss-500" />
                    {item}
                  </li>
                ))}
              </ul>

              <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-6 text-sm">
                <div>
                  <dt className="text-text-muted">Durée</dt>
                  <dd className="m-0 font-medium text-text">
                    {offer.duration ?? <span className="text-text-muted">à préciser</span>}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-muted">Format</dt>
                  <dd className="m-0 font-medium text-text">
                    {offer.format ?? <span className="text-text-muted">à préciser</span>}
                  </dd>
                </div>
              </dl>

              <div className="mt-6">
                <MissingData label={`tarif de la formule « ${offer.name} »`} />
              </div>

              <div className="mt-auto pt-8">
                <Button
                  to="/contact"
                  variant={offer.highlight ? 'primary' : 'secondary'}
                  size="lg"
                  fullWidth
                >
                  {offer.ctaLabel}
                </Button>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>

      <p className="mt-8 flex max-w-2xl items-start gap-3 text-sm text-text-muted">
        <Sprig aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-moss-500" />
        <span>{coaching.medicalGuarantee}</span>
      </p>

      <p className="mt-4 text-sm text-text-muted">
        {site.disclaimer}
      </p>
    </Section>
  )
}
