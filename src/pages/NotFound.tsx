import { Link } from 'react-router-dom'
import { headerNav } from '../lib/data'
import { useDocumentMeta } from '../lib/seo'
import { PageHero } from '../sections/PageHero'
import { Button } from '../components/ui/Button'

export default function NotFound() {
  useDocumentMeta('/404')

  return (
    <>
      <PageHero
        id="introuvable-titre-page"
        eyebrow="Erreur 404"
        title="Cette page n’existe pas"
        intro={
          <p>
            Le lien que vous avez suivi est peut-être incomplet, ou la page a été déplacée. Voici
            quelques points de départ.
          </p>
        }
        aside={
          <Button to="/" variant="primary" size="lg">
            Revenir à l’accueil
          </Button>
        }
      />
      <section className="pb-section" aria-labelledby="introuvable-titre-page">
        <div className="container-page">
          <h2 className="sr-only">Pages principales</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {headerNav.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className="flex min-h-14 items-center justify-between gap-4 rounded-lg border border-line bg-surface px-5 no-underline transition-colors duration-200 hover:border-accent"
                >
                  <span className="font-display text-lg text-text">{item.label}</span>
                  <span aria-hidden="true" className="text-accent-text">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
