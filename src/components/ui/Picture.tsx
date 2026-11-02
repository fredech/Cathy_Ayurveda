import type { SiteImage } from '../../lib/images'

interface PictureProps {
  image: SiteImage
  /** Indique la largeur d'affichage attendue, pour choisir la bonne source. */
  sizes: string
  className?: string
  imgClassName?: string
  /** Image principale : chargée immédiatement et préchargée dans index.html. */
  priority?: boolean
  /** Redéfinit les largeurs de la srcset (ex. image très recadrée). */
  widths?: number[]
}

function srcsetFor(image: SiteImage, format: 'avif' | 'webp' | 'jpg', widths: number[]) {
  return widths.map((width) => `/images/${image.id}-${width}.${format} ${width}w`).join(', ')
}

/**
 * Image responsive au format `<picture>` : AVIF puis WebP puis JPEG, avec des
 * dimensions explicites (pas de décalage de mise en page) et un chargement
 * différé sauf pour l'image principale.
 */
export function Picture({
  image,
  sizes,
  className,
  imgClassName,
  priority = false,
  widths,
}: PictureProps) {
  const available = widths ? image.widths.filter((width) => widths.includes(width)) : image.widths
  const list = available.length > 0 ? available : image.widths
  const fallbackWidth = list[Math.min(1, list.length - 1)]
  const fallbackSrc = `/images/${image.id}-${fallbackWidth}.jpg`

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcsetFor(image, 'avif', list)} sizes={sizes} />
      <source type="image/webp" srcSet={srcsetFor(image, 'webp', list)} sizes={sizes} />
      <img
        src={fallbackSrc}
        alt={image.alt}
        width={image.width}
        height={image.height}
        className={imgClassName}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </picture>
  )
}
