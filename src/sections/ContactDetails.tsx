import { contact, contactPage, hasContact, site } from '../lib/data'
import { MissingData } from '../components/ui/MissingData'
import { Reveal } from '../components/ui/Reveal'

/** Encart de coordonnées : n'affiche que ce qui existe, le reste en repère. */
export function ContactDetails() {
  const { detailsTitle, detailsIntro, fields } = contactPage

  return (
    <Reveal>
      <div className="rounded-lg border border-line bg-surface p-7">
        <h2 className="text-xl text-text">{detailsTitle}</h2>
        <p className="mt-3 text-sm text-text-muted">{detailsIntro}</p>

        <dl className="mt-6 space-y-5 text-sm">
          <div>
            <dt className="font-medium text-text">{fields.emailLabel}</dt>
            <dd className="m-0 mt-1">
              {hasContact.email && contact.email ? (
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              ) : (
                <MissingData variant="inline" label="adresse e-mail" />
              )}
            </dd>
          </div>

          <div>
            <dt className="font-medium text-text">{fields.phoneLabel}</dt>
            <dd className="m-0 mt-1">
              {hasContact.phone && contact.phone ? (
                <a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`} data-tap-target>
                  {contact.phone}
                </a>
              ) : (
                <MissingData variant="inline" label="numéro de téléphone" />
              )}
            </dd>
          </div>

          <div>
            <dt className="font-medium text-text">{fields.whatsappLabel}</dt>
            <dd className="m-0 mt-1">
              {hasContact.whatsapp && contact.whatsapp ? (
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/[^+\d]/g, '').replace(/^\+/, '')}`}
                  data-tap-target
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Écrire sur WhatsApp
                </a>
              ) : (
                <MissingData variant="inline" label="numéro WhatsApp" />
              )}
            </dd>
          </div>

          <div>
            <dt className="font-medium text-text">{fields.addressLabel}</dt>
            <dd className="m-0 mt-1 text-text-muted">
              {hasContact.address ? (
                <>
                  {contact.address}
                  <br />
                  {[contact.postalCode, contact.city].filter(Boolean).join(' ')}
                </>
              ) : (
                <MissingData variant="inline" label="adresse postale" />
              )}
            </dd>
          </div>

          <div>
            <dt className="font-medium text-text">{fields.hoursLabel}</dt>
            <dd className="m-0 mt-1 text-text-muted">
              {hasContact.hours && contact.openingHours ? (
                contact.openingHours
              ) : (
                <MissingData variant="inline" label="horaires d’ouverture" />
              )}
            </dd>
          </div>

          <div>
            <dt className="font-medium text-text">{fields.responseTimeLabel}</dt>
            <dd className="m-0 mt-1 text-text-muted">
              {contact.responseTime ?? (
                <MissingData variant="inline" label="délai de réponse habituel" />
              )}
            </dd>
          </div>
        </dl>

        <p className="mt-7 border-t border-line pt-6 text-xs text-text-muted">{site.disclaimer}</p>
      </div>
    </Reveal>
  )
}
