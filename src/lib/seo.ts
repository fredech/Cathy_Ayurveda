/**
 * Génération des balises meta et des données structurées pour chaque page.
 *
 * - Les fonctions pures servent au pré-rendu (`scripts/prerender.mjs`).
 * - Le hook `useDocumentMeta` synchronise les balises `<title>`, `<meta>`,
 *   `<link rel="canonical">` et `og:*` au cours de la navigation côté client.
 */
import { useEffect } from 'react'
import { pageMeta, site } from './data'
import {
  HERO_IMAGE_SIZES,
  heroImage,
  imageUrl,
  largestWidth,
  ogImage,
  ogImageAlt,
} from './images'

export interface PageSeo {
  title: string
  description: string
  canonical: string
  ogTitle: string
  ogDescription: string
  ogUrl: string
  ogImage: string
  ogImageAlt: string
  ogImageWidth: number
  ogImageHeight: number
}

export function getPageSeo(path: string): PageSeo {
  const { title, description } = pageMeta(path)
  const trimmed = path !== '/' && path.endsWith('/') ? path.slice(0, -1) : path
  const canonicalPath = trimmed === '/' ? '' : trimmed
  const canonical = `${site.url}${canonicalPath}`

  return {
    title,
    description,
    canonical,
    ogTitle: title,
    ogDescription: description,
    ogUrl: canonical || site.url,
    ogImage: `${site.url}/images/banner-${ogImage.width}.jpg`,
    ogImageAlt,
    ogImageWidth: ogImage.width,
    ogImageHeight: ogImage.height,
  }
}

/**
 * Préchargement de l'image principale (LCP) de la page d'accueil.
 *
 * Les `imagesrcset` / `imagesizes` sont dérivés de la même source que le
 * `<picture>` : le navigateur réutilise donc le préchargement au lieu de
 * relancer une requête (c'était la cause d'un LCP dégradé auparavant).
 */
function heroImagePreload(): string {
  const source = heroImage.sources[0]
  if (!source) return ''

  const format = source.type === 'image/avif' ? 'avif' : 'webp'
  const href = imageUrl(heroImage, largestWidth(heroImage), format)
  return [
    `<link rel="preload" as="image" type="${source.type}" fetchpriority="high" href="${href}"`,
    `imagesrcset="${source.srcset}" imagesizes="${HERO_IMAGE_SIZES}" />`,
  ].join(' ')
}

export function buildHeadHtml(path: string): string {
  const seo = getPageSeo(path)
  const tags: string[] = []

  // L'image de l'en-tête n'est utile (et n'est chargée en priorité) que sur
  // la page d'accueil.
  if (path === '/') tags.push(heroImagePreload())

  tags.push(
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
    `<link rel="canonical" href="${escapeHtml(seo.canonical || site.url)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeHtml(site.brand.name)}" />`,
    `<meta property="og:locale" content="fr_FR" />`,
    `<meta property="og:title" content="${escapeHtml(seo.ogTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(seo.ogDescription)}" />`,
    `<meta property="og:url" content="${escapeHtml(seo.ogUrl)}" />`,
    `<meta property="og:image" content="${escapeHtml(seo.ogImage)}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(seo.ogImageAlt)}" />`,
    `<meta property="og:image:width" content="${seo.ogImageWidth}" />`,
    `<meta property="og:image:height" content="${seo.ogImageHeight}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(seo.ogTitle)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(seo.ogDescription)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(seo.ogImage)}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(seo.ogImageAlt)}" />`,
    `<script type="application/ld+json">${escapeJson(buildJsonLd(path, seo))}</script>`,
  )

  return tags.join('\n    ')
}

export function buildJsonLd(path: string, seo: PageSeo): Record<string, unknown> {
  const normalizedPath = path === '/' ? '' : path
  const pageUrl = `${site.url}${normalizedPath}` || site.url

  const socialList = Object.values(site.social).filter((value): value is string => Boolean(value))

  const business: Record<string, unknown> = {
    '@type': 'HealthAndBeautyBusiness',
    '@id': `${site.url}#etablissement`,
    name: site.brand.name,
    url: pageUrl,
    description: seo.description,
    image: seo.ogImage,
    logo: `${site.url}/favicon.svg`,
    inLanguage: site.lang,
    areaServed: 'FR',
    slogan: site.hero.claim,
    // TODO : renseigner une fourchette de prix lorsque les tarifs seront connus.
    priceRange: 'TODO',
    founder: {
      '@type': 'Person',
      name: 'Cathy',
      jobTitle: site.brand.role,
    },
  }

  if (socialList.length > 0) business.sameAs = socialList
  if (site.contact.phone) business.telephone = site.contact.phone
  if (site.contact.email) business.email = site.contact.email
  if (site.contact.openingHours) business.openingHours = site.contact.openingHours
  if (site.contact.address && site.contact.city && site.contact.postalCode && site.contact.country) {
    business.address = {
      '@type': 'PostalAddress',
      streetAddress: site.contact.address,
      postalCode: site.contact.postalCode,
      addressLocality: site.contact.city,
      addressCountry: site.contact.country,
    }
  }

  const website: Record<string, unknown> = {
    '@type': 'WebSite',
    '@id': `${site.url}#site`,
    name: site.brand.name,
    url: site.url,
    inLanguage: site.lang,
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [business, website],
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

export function useDocumentMeta(path: string): void {
  const seo = getPageSeo(path)

  useEffect(() => {
    document.title = seo.title
    setMeta('description', seo.description)
    setCanonical(seo.canonical || site.url)
    setProperty('og:type', 'website')
    setProperty('og:site_name', site.brand.name)
    setProperty('og:locale', 'fr_FR')
    setProperty('og:title', seo.ogTitle)
    setProperty('og:description', seo.ogDescription)
    setProperty('og:url', seo.ogUrl)
    setProperty('og:image', seo.ogImage)
    setProperty('og:image:alt', seo.ogImageAlt)
    setProperty('og:image:width', String(seo.ogImageWidth))
    setProperty('og:image:height', String(seo.ogImageHeight))
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', seo.ogTitle)
    setMeta('twitter:description', seo.ogDescription)
    setMeta('twitter:image', seo.ogImage)
    setMeta('twitter:image:alt', seo.ogImageAlt)
  }, [seo])
}

function setMeta(name: string, content: string): void {
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setProperty(name: string, content: string): void {
  let el = document.querySelector(`meta[property="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href: string): void {
  let el = document.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}
