import { roue } from '../lib/data'
import { useDocumentMeta } from '../lib/seo'
import { PageHero } from '../sections/PageHero'
import { DoshaWheel } from '../sections/DoshaWheel'
import { CtaBand } from '../sections/CtaBand'

export default function RoueAyurvedique() {
  useDocumentMeta('/roue-ayurvedique')

  return (
    <>
      <PageHero
        id="roue-titre-page"
        eyebrow={roue.eyebrow}
        title={roue.title}
        intro={<p>{roue.intro}</p>}
      />
      <DoshaWheel />
      <CtaBand
        title="Envie d’accorder votre journée à ces cycles ?"
        text="Un accompagnement permet d’adapter concrètement ces repères à votre emploi du temps, vos contraintes et vos habitudes."
        ctaLabel="Réserver une consultation"
        secondaryLabel="Voir les formules"
        secondaryTo="/coaching"
      />
    </>
  )
}
