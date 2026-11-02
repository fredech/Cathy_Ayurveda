/**
 * Accès aux images optimisées générées par `scripts/images.mjs` dans
 * `public/images/`. Les recadrages, largeurs et textes alternatifs sont
 * décrits dans `data/content/images.json`.
 */
import config from '../../data/content/images.json'

export interface ImageSource {
  type: 'image/avif' | 'image/webp' | 'image/jpeg'
  srcset: string
}

export interface SiteImage {
  id: string
  width: number
  height: number
  alt: string
  caption: string | null
  /** Largeurs réellement disponibles, de la plus petite à la plus grande. */
  widths: number[]
  /** Source de repli (JPEG), largeur intermédiaire. */
  src: string
  /** Formats modernes, dans l'ordre de préférence. */
  sources: ImageSource[]
  ratio: number
}

const MIME = {
  avif: 'image/avif',
  webp: 'image/webp',
  jpg: 'image/jpeg',
} as const

type Format = keyof typeof MIME

function buildImage(id: string, widthsOverride?: number[]): SiteImage {
  const raw = config.images.find((image) => image.id === id)
  if (!raw) throw new Error(`Image inconnue : ${id}`)
  if (raw.width === 0 || raw.height === 0) throw new Error(`Image sans dimensions : ${id}`)

  const widths = (widthsOverride ?? config.widths).filter((width) => width <= raw.width)
  if (!widths.includes(raw.width)) widths.push(raw.width)

  const srcsetFor = (format: Format) =>
    widths.map((width) => `/images/${id}-${width}.${format} ${width}w`).join(', ')

  const fallbackWidth = widths[Math.min(1, widths.length - 1)]

  return {
    id,
    width: raw.width,
    height: raw.height,
    alt: raw.alt ?? '',
    caption: raw.caption ?? null,
    widths,
    src: `/images/${id}-${fallbackWidth}.jpg`,
    sources: (['avif', 'webp'] as Format[]).map((format) => ({
      type: MIME[format],
      srcset: srcsetFor(format),
    })),
    ratio: raw.width / raw.height,
  }
}

/** Portrait de Cathy (découpe du visuel de marque). */
export const portraitImage = buildImage('portrait')
/** Bol d'épices fourni. */
export const spicesImage = buildImage('spices')
/** Visuel de marque complet, réservé au partage social (Open Graph). */
export const ogImage = buildImage('banner')

/** Texte alternatif déclaré pour l'image de partage social. */
export const ogImageAlt = ogImage.alt

/**
 * Largeur d'affichage du portrait principal dans l'en-tête de la page
 * d'accueil. La valeur est partagée entre le `<picture>` (attribut `sizes`) et
 * le préchargement, pour que le navigateur choisisse toujours la même source.
 * Sur mobile, le portrait est limité par `max-w-md` (28 rem) ; sur grand écran,
 * il occupe une colonne de la grille, plafonnée à 34 rem.
 */
export const HERO_IMAGE_SIZES = '(min-width: 1024px) 34rem, (min-width: 672px) 28rem, 88vw'

/** URL d'une déclinaison précise d'une image. */
export function imageUrl(image: SiteImage, width: number, format: 'avif' | 'webp' | 'jpg'): string {
  return `/images/${image.id}-${width}.${format}`
}

/** Dernière largeur disponible : sert de repli pour le préchargement. */
export function largestWidth(image: SiteImage): number {
  return image.widths[image.widths.length - 1]
}

