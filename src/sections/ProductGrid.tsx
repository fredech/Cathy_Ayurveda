import { produits } from '../lib/data'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { Illustration } from '../components/graphics/Botanical'
import { MissingData } from '../components/ui/MissingData'

/**
 * Cinq soins et plantes traditionnels.
 * Chaque fiche indique la matière première, l'usage traditionnel, le mode
 * d'emploi et les précautions. Les informations commerciales manquantes
 * (format, prix, visuel) sont affichées comme repères à compléter.
 */
export function ProductGrid() {
  return (
    <Section
      id="produits"
      title="Les cinq références"
      intro={<p>{produits.intro}</p>}
      defer
    >
      <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {produits.items.map((product, index) => (
          <Reveal as="li" key={product.id} delay={index * 70}>
            <article className="flex h-full flex-col rounded-lg border border-line bg-surface p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl text-text">{product.name}</h3>
                  {product.latin || product.sanskrit ? (
                    <p className="mt-1 text-xs text-text-muted italic">
                      {[product.latin, product.sanskrit && `« ${product.sanskrit} »`]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  ) : null}
                </div>
                <Illustration name={product.illustration} className="size-9 shrink-0 text-moss-500" />
              </div>

              <p className="mt-2 text-2xs font-medium tracking-[0.14em] text-accent-text uppercase">
                {product.category}
              </p>

              <p className="mt-5 text-sm text-text">{product.summary}</p>
              <p className="mt-3 text-sm text-text-muted">{product.tradition}</p>

              <dl className="mt-6 space-y-3 text-sm">
                <div>
                  <dt className="font-medium text-text">Mode d’emploi</dt>
                  <dd className="m-0 text-text-muted">{product.usage}</dd>
                </div>
                <div>
                  <dt className="font-medium text-text">Précautions</dt>
                  <dd className="m-0 text-text-muted">{product.cautions}</dd>
                </div>
              </dl>

              <div className="mt-auto pt-6">
                <MissingData
                  label={`format, prix et visuel du produit « ${product.name} »`}
                />
              </div>
            </article>
          </Reveal>
        ))}
      </ul>

      <div className="mt-12 grid gap-6 border-t border-line pt-10 md:grid-cols-2">
        <div>
          <h3 className="text-lg text-text">Commander</h3>
          <p className="mt-3 text-sm text-text-muted">{produits.purchaseNote}</p>
        </div>
        <div>
          <h3 className="text-lg text-text">À savoir avant de commencer</h3>
          <p className="mt-3 text-sm text-text-muted">{produits.globalCaution}</p>
        </div>
      </div>

      <div className="mt-8 max-w-2xl">
        <MissingData label={produits.sourceNote} />
      </div>
    </Section>
  )
}
