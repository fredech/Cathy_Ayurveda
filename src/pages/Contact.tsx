import { contactPage } from '../lib/data'
import { useDocumentMeta } from '../lib/seo'
import { PageHero } from '../sections/PageHero'
import { ContactForm } from '../sections/ContactForm'

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
          <div className="max-w-3xl">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
