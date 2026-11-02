import type { FaqItem } from '../lib/data'
import { Accordion, AccordionItem } from '../components/ui/Accordion'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { Button } from '../components/ui/Button'

interface FaqSectionProps {
  items: FaqItem[]
  id?: string
  eyebrow?: string
  title?: string
  intro?: string
  /** Affiche un appel à l'action sous la liste. */
  withCta?: boolean
  tone?: 'default' | 'alt'
  defer?: boolean
}

export function FaqSection({
  items,
  id = 'questions',
  eyebrow = 'Questions fréquentes',
  title = 'Ce que l’on me demande souvent',
  intro,
  withCta = false,
  tone = 'alt',
  defer = true,
}: FaqSectionProps) {
  return (
    <Section id={id} eyebrow={eyebrow} title={title} intro={intro} tone={tone} defer={defer}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
        {withCta ? (
          <Reveal>
            <div className="rounded-lg border border-line bg-surface p-7">
              <p className="font-display text-xl text-text">Une autre question ?</p>
              <p className="mt-3 text-sm text-text-muted">
                Écrivez-moi directement : je réponds personnellement, sans engagement.
              </p>
              <Button to="/contact" variant="secondary" size="md" className="mt-6">
                Me contacter
              </Button>
            </div>
          </Reveal>
        ) : null}
        <Reveal delay={80} className={withCta ? 'lg:col-span-1' : 'lg:col-span-2'}>
          <Accordion>
            {items.map((item, index) => (
              <AccordionItem key={item.question} question={item.question} open={index === 0}>
                <p className="m-0">{item.answer}</p>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </Section>
  )
}
