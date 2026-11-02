import { produits } from '../lib/data'
import { useDocumentMeta } from '../lib/seo'
import { PageHero } from '../sections/PageHero'
import { ProductGrid } from '../sections/ProductGrid'
import { CtaBand } from '../sections/CtaBand'

export default function Produits() {
  useDocumentMeta('/produits')

  return (
    <>
      <PageHero
        id="produits-titre-page"
        eyebrow={produits.eyebrow}
        title={produits.title}
        intro={<p>{produits.subtitle}</p>}
      />
      <ProductGrid />
      <CtaBand
        title="Besoin d’un conseil sur un soin ?"
        text="Les plantes et les huiles ne conviennent pas à toutes les situations. Écrivez-moi : nous regardons ce qui est adapté à votre profil."
        ctaLabel="Poser ma question"
        secondaryLabel="Voir les formules d’accompagnement"
        secondaryTo="/coaching"
      />
    </>
  )
}
