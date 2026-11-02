import { NavLink } from 'react-router-dom'
import { contact, footerNav, hasContact, site, telHref, whatsappHref } from '../../lib/data'
import { Divider, Sprig } from '../graphics/Botanical'

export function Footer() {
  const phone = telHref()
  const whatsapp = whatsappHref('Bonjour Cathy, je souhaite des informations sur votre accompagnement ayurvédique.')
  const year = new Date().getFullYear()

  return (
    <footer className="no-print border-t border-line bg-bg-alt">
      <div className="container-page py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="max-w-sm">
            <p className="font-display text-2xl">{site.brand.name}</p>
            <p className="mt-1 text-2xs tracking-[0.16em] text-text-muted uppercase">
              {site.brand.logoSub}
            </p>
            <p className="mt-5 text-sm text-text-muted">{site.hero.claim}</p>
            <Divider className="mt-8 justify-start" />
          </div>

          <nav aria-label="Navigation de pied de page">
            <h2 className="text-sm font-medium tracking-wide">Pages</h2>
            <ul className="mt-4 space-y-1">
              {footerNav.map((item) => (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    className="inline-flex min-h-11 items-center text-sm text-text-muted no-underline hover:text-accent-text"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-medium tracking-wide">Me joindre</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {hasContact.email && contact.email ? (
                <li>
                  <a href={`mailto:${contact.email}`} className="text-text-muted no-underline hover:text-accent-text">
                    {contact.email}
                  </a>
                </li>
              ) : null}

              {phone ? (
                <li>
                  <a href={phone} data-tap-target className="text-text-muted no-underline hover:text-accent-text">
                    {contact.phone}
                  </a>
                </li>
              ) : (
                <li>
                  <NavLink to="/contact" className="text-text-muted no-underline hover:text-accent-text">
                    Formulaire de contact
                  </NavLink>
                </li>
              )}

              {whatsapp ? (
                <li>
                  <a
                    href={whatsapp}
                    data-tap-target
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-text-muted no-underline hover:text-accent-text"
                  >
                    Écrire sur WhatsApp
                  </a>
                </li>
              ) : null}
            </ul>

            <p className="mt-6 flex items-center gap-2 text-xs text-text-muted">
              <Sprig className="size-4 shrink-0" aria-hidden="true" />
              <span>
                Formation et protocoles validés avec un médecin agréé en Ayurveda.
              </span>
            </p>
          </div>
        </div>

        <div className="mt-14 border-t border-line pt-8">
          <p className="max-w-3xl text-xs leading-relaxed text-text-muted">{site.disclaimer}</p>
          <div className="mt-6 flex flex-col gap-3 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
            <p className="m-0">
              © {year} {site.brand.name}. Tous droits réservés.
            </p>
            <p className="m-0">
              <NavLink to="/confidentialite" className="text-text-muted no-underline hover:text-accent-text">
                Politique de confidentialité (RGPD)
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
