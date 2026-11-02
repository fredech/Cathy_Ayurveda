import { dosha } from '../lib/data'
import type { DoshaId } from '../lib/data'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'

const order: DoshaId[] = ['vata', 'pitta', 'kapha']

const color: Record<DoshaId, string> = {
  vata: 'var(--color-vata)',
  pitta: 'var(--color-pitta)',
  kapha: 'var(--color-kapha)',
}

/** Les trois doshas : qualités, signes d'équilibre et conseils généraux. */
export function DoshaProfiles() {
  return (
    <Section
      id="doshas"
      eyebrow="Les trois doshas"
      title="Vata, Pitta, Kapha"
      intro="Trois principes qui décrivent des tendances : la mobilité (Vata), la transformation (Pitta) et la structure (Kapha). Voici comment les reconnaître."
      tone="alt"
      defer
    >
      <ul className="grid gap-6 lg:grid-cols-3">
        {order.map((key, index) => {
          const profile = dosha.profiles[key]
          return (
            <Reveal as="li" key={key} delay={index * 90}>
              <article className="flex h-full flex-col rounded-lg border border-line bg-surface p-7">
                <span aria-hidden="true" className="h-1 w-12 rounded-full" style={{ backgroundColor: color[key] }} />
                <h3 className="mt-5 text-2xl text-text">{profile.name}</h3>
                <p className="mt-1 text-xs tracking-[0.14em] text-text-muted uppercase">
                  {profile.elements}
                </p>
                <dl className="mt-6 space-y-4 text-sm">
                  <div>
                    <dt className="font-medium text-text">Qualités</dt>
                    <dd className="m-0 text-text-muted">{profile.qualities}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-text">Quand c’est équilibré</dt>
                    <dd className="m-0 text-text-muted">{profile.balanced}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-text">Signes de déséquilibre</dt>
                    <dd className="m-0 text-text-muted">{profile.imbalance}</dd>
                  </div>
                </dl>
                <h4 className="mt-6 text-sm font-medium text-text">Gestes qui soutiennent l’équilibre</h4>
                <ul className="mt-3 space-y-2 text-sm text-text-muted">
                  {profile.advice.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden="true" className="text-accent-text">
                        •
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          )
        })}
      </ul>
      <p className="mt-10 max-w-2xl text-sm text-text-muted">{dosha.disclaimer}</p>
    </Section>
  )
}
