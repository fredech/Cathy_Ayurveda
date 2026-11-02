import { contactPage } from '../lib/data'
import { useDocumentMeta } from '../lib/seo'
import { PageHero } from '../sections/PageHero'
import { ContactForm } from '../sections/ContactForm'
import { ContactDetails } from '../sections/ContactDetails'

export default function Contact() {
  useDocumentMeta('/contact')

  return (
    <>
      <PageHero
        id="contact-titre-page"
        eyebrow={contactPage.eyebrow}
        title={contactPage.title}
        intro={<p>{contactPage.intro}</p>}
      />
      <section className="pb-section" aria-labelledby="contact-titre-page">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:items-start lg:gap-16">
            <ContactForm />
            <div className="lg:sticky lg:top-28">
              <ContactDetails />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
