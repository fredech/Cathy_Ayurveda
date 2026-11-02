import { coaching } from '../lib/data'
import { useDocumentMeta } from '../lib/seo'
import { PageHero } from '../sections/PageHero'
import { OffersGrid } from '../sections/OffersGrid'
import { ProcessSteps } from '../sections/ProcessSteps'
import { FaqSection } from '../sections/FaqSection'
import { CtaBand } from '../sections/CtaBand'

export default function Coaching() {
  useDocumentMeta('/coaching')

  return (
    <>
      <PageHero
        id="coaching-titre-page"
        eyebrow={coaching.eyebrow}
        title={coaching.title}
        intro={<p>{coaching.subtitle}</p>}
      />
      <OffersGrid />
      <ProcessSteps />
      <FaqSection items={coaching.faq} id="questions-coaching" />
      <CtaBand
        title="Prête à commencer ?"
        text="Écrivez-moi quelques lignes sur votre situation : je vous indique la formule la plus juste, sans engagement."
        ctaLabel="Prendre contact"
      />
    </>
  )
}
