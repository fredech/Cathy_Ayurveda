import { legal, site } from '../lib/data'
import { Container } from '../components/ui/Container'
import { Reveal } from '../components/ui/Reveal'

/** Rendu des sections RGPD, telles que décrites dans `data/content/legal.json`. */
export function LegalSections() {
  return (
    <section className="pb-section" aria-labelledby="confidentialite-sections">
      <Container>
        <h2 id="confidentialite-sections" className="sr-only">
          Détail de la politique de confidentialité
        </h2>

        <p className="text-sm text-text-muted">
          Dernière mise à jour : {legal.updated}
        </p>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,0.35fr)_minmax(0,0.65fr)] lg:gap-16">
          <nav aria-label="Sommaire de la politique de confidentialité" className="lg:sticky lg:top-28 lg:self-start">
            <ol className="space-y-2 text-sm">
              {legal.sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="inline-flex min-h-11 items-center gap-3 text-text-muted no-underline hover:text-accent-text"
                  >
                    <span aria-hidden="true" className="text-2xs text-text-muted">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-12">
            {legal.sections.map((section) => (
              <Reveal as="article" key={section.id} className="scroll-mt-32">
                <h3 id={section.id} className="text-2xl text-text">
                  {section.title}
                </h3>
                <div className="mt-4 space-y-4 text-base text-text-muted">
                  {section.blocks.map((block, index) =>
                    block.type === 'paragraph' ? (
                      <p key={`${section.id}-p-${index}`} className="m-0">
                        {block.text}
                      </p>
                    ) : (
                      <ul key={`${section.id}-l-${index}`} className="m-0 space-y-2 ps-5">
                        {block.items.map((item) => (
                          <li key={item} className="list-disc">
                            {item}
                          </li>
                        ))}
                      </ul>
                    ),
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-14 max-w-2xl space-y-4">
          <p className="text-sm text-text-muted">{site.disclaimer}</p>
        </div>
      </Container>
    </section>
  )
}
