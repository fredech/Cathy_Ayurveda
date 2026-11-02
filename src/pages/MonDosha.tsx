import { dosha } from '../lib/data'
import { useDocumentMeta } from '../lib/seo'
import { PageHero } from '../sections/PageHero'
import { DoshaQuiz } from '../sections/DoshaQuiz'
import { DoshaProfiles } from '../sections/DoshaProfiles'
import { CtaBand } from '../sections/CtaBand'

export default function MonDosha() {
  useDocumentMeta('/mon-dosha')

  return (
    <>
      <PageHero
        id="dosha-titre-page"
        eyebrow={dosha.eyebrow}
        title={dosha.title}
        intro={<p>{dosha.intro}</p>}
      />
      <DoshaQuiz />
      <DoshaProfiles />
      <CtaBand
        title="Un résultat, c’est un point de départ"
        text="Le questionnaire donne une tendance. Un bilan permet d’aller plus loin et de traduire ces repères en habitudes tenables pour vous."
        ctaLabel="Réserver une consultation"
        secondaryLabel="Comprendre la roue des doshas"
        secondaryTo="/roue-ayurvedique"
      />
    </>
  )
}
