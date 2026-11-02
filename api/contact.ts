/**
 * Envoi du formulaire de contact par Resend.
 *
 * Cette fonction est servie par Vercel sur `/api/contact` (dossier `api/` à la
 * racine du projet). La clé API reste côté serveur : elle n'est jamais incluse
 * dans le bundle du navigateur.
 *
 * Variables d'environnement (à définir dans Vercel et, pour les tests locaux,
 * dans un fichier `.env` — voir `.env.example`) :
 *
 * - `Resend_key` (ou `RESEND_KEY`) : clé API Resend, obligatoire.
 * - `CONTACT_FROM_EMAIL` : expéditeur, sur un domaine vérifié dans Resend.
 *   Par défaut : `Cathy Ayurveda <onboarding@resend.dev>` (adresse de test
 *   Resend, qui n'envoie qu'à l'adresse du compte Resend).
 * - `email_contact` : destinataire. Par défaut : `cathyayurveda@gmail.com`.
 *   (alias accepté : `CONTACT_TO_EMAIL`).
 *
 * Remarque : Resend ne permet pas d'envoyer depuis une adresse `@gmail.com`
 * (le domaine doit être vérifié). L'adresse Gmail sert donc de destinataire
 * et d'adresse de réponse, pas d'expéditeur.
 */
import { Resend } from 'resend'

const DEFAULT_TO = 'cathyayurveda@gmail.com'
const DEFAULT_FROM = 'Cathy Ayurveda <onboarding@resend.dev>'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const LIMITS = {
  name: 120,
  email: 200,
  phone: 40,
  subject: 160,
  message: 6000,
} as const

interface ContactPayload {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  consent: boolean
}

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

function asTrimmedString(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function parsePayload(input: unknown): ContactPayload | null {
  if (!input || typeof input !== 'object') return null
  const record = input as Record<string, unknown>

  const payload: ContactPayload = {
    name: asTrimmedString(record.name, LIMITS.name),
    email: asTrimmedString(record.email, LIMITS.email),
    phone: asTrimmedString(record.phone, LIMITS.phone),
    subject: asTrimmedString(record.subject, LIMITS.subject),
    message: asTrimmedString(record.message, LIMITS.message),
    consent: record.consent === true,
  }

  if (!payload.name) return null
  if (!EMAIL_PATTERN.test(payload.email)) return null
  if (!payload.subject) return null
  if (payload.message.length < 10) return null
  if (!payload.consent) return null

  return payload
}

function buildEmail(payload: ContactPayload) {
  const lines = [
    `Nom : ${payload.name}`,
    `E-mail : ${payload.email}`,
    payload.phone ? `Téléphone : ${payload.phone}` : null,
    `Demande : ${payload.subject}`,
    '',
    payload.message,
    '',
    `Consentement recueilli le ${new Date().toLocaleString('fr-FR', {
      timeZone: 'Europe/Paris',
    })} (heure de Paris).`,
  ].filter((line): line is string => line !== null)

  const text = lines.join('\n')

  const html = `<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:24px;background:#fdfaf3;color:#1f241c;font-family:Helvetica,Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e7e1d4;border-radius:8px;padding:24px;">
      <h1 style="margin:0 0 16px;font-size:20px;">Nouvelle demande de contact</h1>
      <p style="margin:0 0 16px;color:#5b6157;font-size:14px;">Reçue depuis le formulaire du site.</p>
      <table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 0;color:#5b6157;width:110px;">Nom</td><td style="padding:6px 0;">${escapeHtml(payload.name)}</td></tr>
        <tr><td style="padding:6px 0;color:#5b6157;">E-mail</td><td style="padding:6px 0;"><a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a></td></tr>
        ${payload.phone ? `<tr><td style="padding:6px 0;color:#5b6157;">Téléphone</td><td style="padding:6px 0;">${escapeHtml(payload.phone)}</td></tr>` : ''}
        <tr><td style="padding:6px 0;color:#5b6157;">Demande</td><td style="padding:6px 0;">${escapeHtml(payload.subject)}</td></tr>
      </table>
      <hr style="border:0;border-top:1px solid #e7e1d4;margin:20px 0;" />
      <p style="margin:0;white-space:pre-wrap;font-size:14px;line-height:1.6;">${escapeHtml(payload.message)}</p>
      <hr style="border:0;border-top:1px solid #e7e1d4;margin:20px 0;" />
      <p style="margin:0;color:#5b6157;font-size:12px;">Consentement recueilli le ${escapeHtml(
        new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
      )} (heure de Paris).</p>
    </div>
  </body>
</html>`

  return { text, html }
}

export async function POST(request: Request): Promise<Response> {
  const key = process.env.Resend_key ?? process.env.RESEND_KEY
  if (!key) {
    console.error('[contact] Clé Resend manquante : définissez la variable Resend_key.')
    return json(500, {
      error: "Le service d'envoi n'est pas configuré. Merci d'écrire directement à cathyayurveda@gmail.com.",
    })
  }

  let payload: ContactPayload | null
  try {
    payload = parsePayload(await request.json())
  } catch {
    return json(400, { error: 'Requête invalide.' })
  }

  if (!payload) {
    return json(400, { error: 'Formulaire incomplet ou invalide.' })
  }

  const { text, html } = buildEmail(payload)

  try {
    const resend = new Resend(key)
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? DEFAULT_FROM,
      to: process.env.email_contact ?? process.env.CONTACT_TO_EMAIL ?? DEFAULT_TO,
      replyTo: payload.email,
      subject: `[Site] ${payload.subject} — ${payload.name}`,
      text,
      html,
    })

    if (error) {
      console.error('[contact] Resend a refusé l’envoi :', error)
      return json(502, {
        error: "L'envoi a échoué. Merci de réessayer ou d'écrire directement à cathyayurveda@gmail.com.",
      })
    }
  } catch (error) {
    console.error('[contact] Erreur inattendue lors de l’envoi :', error)
    return json(502, {
      error: "L'envoi a échoué. Merci de réessayer ou d'écrire directement à cathyayurveda@gmail.com.",
    })
  }

  return json(200, { ok: true })
}
