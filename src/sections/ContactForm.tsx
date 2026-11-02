import { useRef, useState } from 'react'
import { contact, contactPage, site } from '../lib/data'
import { Button } from '../components/ui/Button'
import { CheckboxField, SelectField, TextAreaField, TextField } from '../components/ui/Field'
import { MissingData } from '../components/ui/MissingData'

interface FormValues {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  consent: boolean
}

type FormErrors = Partial<Record<keyof FormValues, string>>

const EMPTY: FormValues = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  consent: false,
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Formulaire de contact.
 *
 * La validation est faite côté client, puis le message est envoyé à
 * `/api/contact` (fonction Vercel dans `api/contact.ts`), qui le transmet par
 * Resend à l'adresse de réception. La clé Resend reste côté serveur.
 */
export function ContactForm() {
  const [values, setValues] = useState<FormValues>(EMPTY)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const formRef = useRef<HTMLFormElement | null>(null)
  const { labels } = contactPage

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((previous) => ({ ...previous, [key]: value }))
    if (errors[key]) {
      setErrors((previous) => ({ ...previous, [key]: undefined }))
    }
    if (status === 'sent' || status === 'error') {
      setStatus('idle')
    }
  }

  function validate(current: FormValues): FormErrors {
    const next: FormErrors = {}
    if (!current.name.trim()) next.name = contactPage.errors.name
    if (!EMAIL_PATTERN.test(current.email.trim())) next.email = contactPage.errors.email
    if (!current.subject) next.subject = contactPage.errors.subject
    if (current.message.trim().length < 10) next.message = contactPage.errors.message
    if (!current.consent) next.consent = contactPage.errors.consent
    return next
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'sending') return

    const found = validate(values)
    setErrors(found)

    if (Object.keys(found).length > 0) {
      setStatus('idle')
      // Amène la personne au premier champ à corriger.
      window.requestAnimationFrame(() => {
        const firstInvalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
        firstInvalid?.focus()
      })
      return
    }

    setStatus('sending')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error(`Envoi refusé (${response.status}).`)
      }

      setValues(EMPTY)
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const errorCount = Object.values(errors).filter(Boolean).length

  return (
    <div>
      <h2 className="text-2xl text-text">{contactPage.formTitle}</h2>
      <p className="mt-3 max-w-xl text-sm text-text-muted">{contactPage.formIntro}</p>

      <div aria-live="polite">
        {status === 'sent' ? (
          <div className="mt-8 rounded-lg border border-line bg-accent-soft p-6 text-sm text-text">
            <strong className="block font-display text-lg font-normal">
              {contactPage.success.title}
            </strong>
            <p className="m-0 mt-2">{contactPage.success.text}</p>
          </div>
        ) : null}

        {status === 'error' ? (
          <div
            role="alert"
            className="mt-8 rounded-lg border border-pitta/40 bg-surface p-6 text-sm text-text"
          >
            <strong className="block font-display text-lg font-normal">
              {contactPage.error.title}
            </strong>
            <p className="m-0 mt-2">{contactPage.error.text}</p>
            {contact.email ? (
              <p className="m-0 mt-2">
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <form ref={formRef} className="mt-8 grid gap-6" onSubmit={onSubmit} noValidate aria-busy={status === 'sending'}>
        {errorCount > 0 ? (
          <div
            role="alert"
            className="rounded-sm border border-pitta/40 bg-surface px-4 py-3 text-sm font-medium text-pitta"
          >
            {errorCount} champ{errorCount > 1 ? 's' : ''} à corriger avant l’envoi.
          </div>
        ) : null}

        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            name="name"
            label={labels.name}
            autoComplete="name"
            required
            value={values.name}
            error={errors.name}
            onChange={(event) => update('name', event.target.value)}
          />
          <TextField
            name="email"
            type="email"
            label={labels.email}
            autoComplete="email"
            required
            value={values.email}
            error={errors.email}
            onChange={(event) => update('email', event.target.value)}
          />
          <TextField
            name="phone"
            type="tel"
            label={labels.phone}
            autoComplete="tel"
            hint={contactPage.hints.phone}
            value={values.phone}
            onChange={(event) => update('phone', event.target.value)}
          />
          <SelectField
            name="subject"
            label={labels.subject}
            required
            value={values.subject}
            error={errors.subject}
            placeholder="— Choisir —"
            options={contactPage.subjects.map((subject) => ({ value: subject, label: subject }))}
            onChange={(event) => update('subject', event.target.value)}
          />
        </div>

        <TextAreaField
          name="message"
          label={labels.message}
          required
          hint={contactPage.hints.message}
          value={values.message}
          error={errors.message}
          onChange={(event) => update('message', event.target.value)}
        />

        <CheckboxField
          name="consent"
          label={labels.consent}
          hint={contactPage.hints.consent}
          checked={values.consent}
          error={errors.consent}
          required
          onChange={(checked) => update('consent', checked)}
        />

        <div className="flex flex-col items-start gap-4">
          <Button type="submit" variant="primary" size="lg" disabled={status === 'sending'}>
            {status === 'sending' ? contactPage.sending : labels.submit}
          </Button>
          <p className="m-0 text-xs text-text-muted">{site.disclaimer}</p>
        </div>
      </form>

      <div className="mt-8 max-w-2xl">
        <MissingData label={contactPage.sourceNote} />
      </div>
    </div>
  )
}
