/**
 * Couche de données typée.
 *
 * Tout le contenu éditorial vit dans `data/content/*.json` et n'est jamais
 * écrit en dur dans les composants. Pour modifier les textes, les tarifs ou
 * les coordonnées du site : éditez les fichiers JSON, le site se met à jour.
 *
 * Les valeurs manquantes sont explicitement `null` ; l'interface n'affiche que
 * les informations réellement renseignées.
 */
import siteJson from '../../data/content/site.json'
import navJson from '../../data/content/navigation.json'
import pagesJson from '../../data/content/pages.json'
import homeJson from '../../data/content/home.json'
import roueJson from '../../data/content/roue-ayurvedique.json'
import doshaJson from '../../data/content/dosha.json'
import produitsJson from '../../data/content/produits.json'
import coachingJson from '../../data/content/coaching.json'
import legalJson from '../../data/content/legal.json'
import contactJson from '../../data/content/contact.json'

/** Une donnée absente du dossier `data/`, à compléter par la praticienne. */
export type Todo = string | null

export type DoshaId = 'vata' | 'pitta' | 'kapha'

export interface Link {
  label: string
  href: string
}

export interface SiteContact {
  email: Todo
  phone: Todo
  whatsapp: Todo
  address: Todo
  postalCode: Todo
  city: Todo
  country: Todo
  mapUrl: Todo
  openingHours: Todo
  responseTime: Todo
  bookingUrl: Todo
}

export interface Site {
  lang: string
  url: string
  urlNote: string
  brand: {
    name: string
    role: string
    logoText: string
    logoSub: string
  }
  hero: {
    baseline: string
    claim: string
  }
  shortDescription: string
  contact: SiteContact
  social: Record<'instagram' | 'facebook' | 'youtube', Todo>
  disclaimer: string
  medicalPartnerNote: string
}

export interface NavItem {
  id: string
  path: string
  label: string
  navLabel: Todo
  inHeader: boolean
  inFooter: boolean
}

export interface PageMeta {
  title: string
  description: string
}

export interface Pillar {
  title: string
  text: string
  illustration: string
}

export interface HomeContent {
  hero: {
    eyebrow: string
    title: string
    text: string
    primaryCta: Link
    secondaryCta: Link
    imageCaption: string
  }
  pillars: { title: string; items: Pillar[] }
  approach: { eyebrow: string; title: string; paragraphs: string[]; sourceNote: string }
  closing: { title: string; text: string; ctaLabel: string }
}

export interface TimeSlot {
  id: string
  start: number
  end: number
  dosha: DoshaId
  timeLabel: string
  doshaLabel: string
  title: string
  text: string
}

export interface WheelContent {
  eyebrow: string
  title: string
  subtitle: string
  slogan: string
  intro: string
  instruction: string
  slots: TimeSlot[]
}

export interface QuizOption {
  dosha: DoshaId
  label: string
}

export interface QuizQuestion {
  id: string
  label: string
  options: QuizOption[]
}

export interface DoshaProfile {
  name: string
  elements: string
  qualities: string
  balanced: string
  imbalance: string
  advice: string[]
}

export interface DoshaContent {
  eyebrow: string
  title: string
  subtitle: string
  intro: string
  disclaimer: string
  questions: QuizQuestion[]
  profiles: Record<DoshaId, DoshaProfile>
  mixedNote: string
}

export interface Product {
  id: string
  name: string
  latin: Todo
  sanskrit: Todo
  illustration: string
  category: string
  summary: string
  tradition: string
  usage: string
  format: Todo
  price: Todo
  image: Todo
  cautions: string
}

export interface ProduitsContent {
  eyebrow: string
  title: string
  subtitle: string
  intro: string
  globalCaution: string
  purchaseNote: string
  availability: string
  items: Product[]
}

export interface Offer {
  id: string
  highlight: boolean
  badge: Todo
  name: string
  tagline: string
  description: string
  includes: string[]
  duration: Todo
  format: Todo
  price: Todo
  ctaLabel: string
}

export interface OfferStep {
  title: string
  text: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface CoachingContent {
  eyebrow: string
  title: string
  subtitle: string
  intro: string
  medicalGuarantee: string
  practicalNote: string
  offers: Offer[]
  process: { title: string; steps: OfferStep[] }
  forWho: { title: string; items: string[] }
  faq: FaqItem[]
}

export type LegalBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }

export interface LegalSection {
  id: string
  title: string
  blocks: LegalBlock[]
}

export interface LegalContent {
  title: string
  updated: string
  intro: string
  sections: LegalSection[]
}

export interface ContactContent {
  eyebrow: string
  title: string
  intro: string
  formTitle: string
  formIntro: string
  labels: {
    name: string
    email: string
    phone: string
    subject: string
    message: string
    consent: string
    submit: string
  }
  hints: { phone: string; message: string; consent: string }
  subjects: string[]
  errors: { name: string; email: string; subject: string; message: string; consent: string }
  success: { title: string; text: string }
  sending: string
  error: { title: string; text: string }
}

export const site = siteJson as Site
export const pages = pagesJson as Record<string, PageMeta>
export const nav = navJson as NavItem[]
export const home = homeJson as HomeContent
export const roue = { ...roueJson, slots: roueJson.slots as TimeSlot[] } as WheelContent
export const dosha = {
  ...doshaJson,
  profiles: doshaJson.profiles as Record<DoshaId, DoshaProfile>,
  questions: doshaJson.questions as QuizQuestion[],
} as DoshaContent
export const produits = { ...produitsJson, items: produitsJson.items as Product[] } as ProduitsContent
export const coaching = {
  ...coachingJson,
  offers: coachingJson.offers as Offer[],
  faq: coachingJson.faq as FaqItem[],
} as CoachingContent
export const legal = { ...legalJson, sections: legalJson.sections as LegalSection[] } as LegalContent
export const contactPage = contactJson as ContactContent

export const SITE_NAME = site.brand.name
export const SITE_URL = site.url

/** Le contenu principal, utilisé pour le menu et le pied de page. */
export const headerNav = nav.filter((item) => item.inHeader)
export const footerNav = nav.filter((item) => item.inFooter)

/** Coordonnées réellement renseignées : sert à n'afficher que ce qui existe. */
export const contact = site.contact

export const hasContact = {
  email: Boolean(contact.email),
  phone: Boolean(contact.phone),
  whatsapp: Boolean(contact.whatsapp),
  address: Boolean(contact.address && contact.city),
  map: Boolean(contact.mapUrl),
  hours: Boolean(contact.openingHours),
}

/** Lien `tel:` normalisé, ou `null` si le numéro n'est pas renseigné. */
export function telHref(): string | null {
  if (!contact.phone) return null
  return `tel:${contact.phone.replace(/[^+\d]/g, '')}`
}

/** Lien WhatsApp, ou `null` si le numéro n'est pas renseigné. */
export function whatsappHref(message = ''): string | null {
  if (!contact.whatsapp) return null
  const digits = contact.whatsapp.replace(/[^+\d]/g, '').replace(/^\+/, '')
  const query = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${digits}${query}`
}

export function pageMeta(path: string): PageMeta {
  return pages[path] ?? { title: SITE_NAME, description: site.shortDescription }
}

/** Adresse postale mise en forme, ou `null` si incomplète. */
export function postalAddress(): string | null {
  if (!contact.address) return null
  const parts = [contact.address, [contact.postalCode, contact.city].filter(Boolean).join(' ')]
  return parts.filter(Boolean).join(', ')
}
