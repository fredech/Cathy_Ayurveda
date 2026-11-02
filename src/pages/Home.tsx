import { coaching, home } from '../lib/data'
import { useDocumentMeta } from '../lib/seo'
import { Hero } from '../sections/Hero'
import { Pillars } from '../sections/Pillars'
import { Approach } from '../sections/Approach'
import { ExploreGrid } from '../sections/ExploreGrid'
import { FaqSection } from '../sections/FaqSection'
import { CtaBand } from '../sections/CtaBand'

export default function Home() {
  useDocumentMeta('/')

  return (
    <>
      <Hero />
      <Pillars />
      <Approach />
      <ExploreGrid />
      <FaqSection
        items={coaching.faq.slice(0, 3)}
        id="questions-accueil"
        eyebrow="Questions fréquentes"
        title="Avant de commencer"
        intro="Les trois questions qui reviennent le plus souvent."
        withCta
      />
      <CtaBand
        title={home.closing.title}
        text={home.closing.text}
        ctaLabel={home.closing.ctaLabel}
        secondaryLabel="Voir les formules"
        secondaryTo="/coaching"
      />
    </>
  )
}
