import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { Illustration } from '../components/graphics/Botanical'
import { home } from '../lib/data'

export function Pillars() {
  return (
    <Section
      id="approche"
      eyebrow="Repères"
      title={home.pillars.title}
      intro={null}
      defer
    >
      <ul className="grid gap-6 md:grid-cols-3">
        {home.pillars.items.map((pillar, index) => (
          <Reveal as="li" key={pillar.title} delay={index * 90}>
            <div className="flex h-full flex-col rounded-lg border border-line bg-surface p-7">
              <Illustration name={pillar.illustration} className="size-9 text-moss-500" />
              <h3 className="mt-6 text-xl text-text">{pillar.title}</h3>
              <p className="mt-3 text-sm text-text-muted">{pillar.text}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
