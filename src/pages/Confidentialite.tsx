import { legal } from '../lib/data'
import { useDocumentMeta } from '../lib/seo'
import { PageHero } from '../sections/PageHero'
import { LegalSections } from '../sections/LegalSections'

export default function Confidentialite() {
  useDocumentMeta('/confidentialite')

  return (
    <>
      <PageHero id="confidentialite-titre-page" title={legal.title} intro={<p>{legal.intro}</p>} />
      <LegalSections />
    </>
  )
}
