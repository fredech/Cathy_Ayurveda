import { coaching } from '../lib/data'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'

/** Déroulé de l'accompagnement, en quatre étapes. */
export function ProcessSteps() {
  return (
    <Section
      id="deroulement"
      eyebrow="Déroulement"
      title={coaching.process.title}
      tone="alt"
      defer
    >
      <ol className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {coaching.process.steps.map((step, index) => (
          <Reveal as="li" key={step.title} delay={index * 80}>
            <div className="flex h-full flex-col rounded-lg border border-line bg-surface p-7">
              <span
                aria-hidden="true"
                className="font-display text-3xl text-accent-text"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 text-lg text-text">{step.title}</h3>
              <p className="mt-3 text-sm text-text-muted">{step.text}</p>
            </div>
          </Reveal>
        ))}
      </ol>

      <div className="mt-12 grid gap-10 border-t border-line pt-10 lg:grid-cols-2">
        <div>
          <h3 className="text-xl text-text">{coaching.forWho.title}</h3>
          <ul className="mt-4 space-y-3 text-sm text-text-muted">
            {coaching.forWho.items.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden="true" className="text-accent-text">
                  •
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="max-w-xl">
          <h3 className="text-xl text-text">Bon à savoir</h3>
          <p className="mt-3 text-sm text-text-muted">{coaching.practicalNote}</p>
        </div>
      </div>
    </Section>
  )
}
