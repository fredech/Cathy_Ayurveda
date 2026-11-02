/**
 * Génère les images optimisées du site (AVIF / WebP / JPEG) à partir des
 * sources de `data/`, en s'appuyant sur `data/content/images.json`.
 *
 * Usage :
 *   node scripts/images.mjs                 # (re)génère toutes les images
 *   node scripts/images.mjs --if-missing     # ne fait rien si déjà généré
 */
import { mkdir, readFile, writeFile, access } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const config = JSON.parse(await readFile(join(root, 'data/content/images.json'), 'utf8'))
const ifMissing = process.argv.includes('--if-missing')
const outDir = join(root, config.outputDir)

const quality = { avif: 52, webp: 72, jpg: 80 }

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

/**
 * Détoure un logo fourni sur fond clair et l'exporte en WebP avec alpha.
 *
 * Le fond (papier crème) est converti en transparence à partir de la
 * luminance : les pixels sombres du dessin restent opaques, les pixels clairs
 * deviennent transparents, avec un dégradé pour les bords anti-crénelés. La
 * couleur est unifiée pour éviter les halos clairs sur fond sombre.
 */
async function generateLogo(image) {
  const source = join(root, image.source)
  if (!(await exists(source))) return `${image.id} — SOURCE MANQUANTE : ${image.source}`

  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const out = Buffer.alloc(info.width * info.height * 4)
  const [red, green, blue] = [82, 92, 42]
  let minX = info.width
  let minY = info.height
  let maxX = 0
  let maxY = 0

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const index = (y * info.width + x) * 4
      const luminance =
        0.2126 * data[index] + 0.7152 * data[index + 1] + 0.0722 * data[index + 2]
      let alpha = (238 - luminance) / (238 - 95)
      alpha = Math.max(0, Math.min(1, alpha))
      if (alpha < 0.06) alpha = 0

      out[index] = red
      out[index + 1] = green
      out[index + 2] = blue
      out[index + 3] = Math.round(alpha * 255)

      if (alpha > 0) {
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
      }
    }
  }

  if (maxX < minX || maxY < minY) return `${image.id} — dessin introuvable`

  const padding = 6
  const left = Math.max(0, minX - padding)
  const top = Math.max(0, minY - padding)
  const width = Math.min(info.width - left, maxX - minX + 1 + padding * 2)
  const height = Math.min(info.height - top, maxY - minY + 1 + padding * 2)

  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .extract({ left, top, width, height })
    .resize({ width: 256, withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 100, effort: 6 })
    .toFile(join(outDir, `${image.id}.webp`))

  return `${image.id} — ${width}×${height} détouré, 256 px (webp alpha)`
}

async function run() {
  await mkdir(outDir, { recursive: true })
  const report = []

  for (const image of config.images) {
    if (image.usage === 'reference' || image.usage === 'excluded') {
      report.push(`${image.id} — ignorée (${image.usage})`)
      continue
    }

    if (image.usage === 'logo') {
      report.push(await generateLogo(image))
      continue
    }

    const source = join(root, image.source)
    if (!(await exists(source))) {
      report.push(`${image.id} — SOURCE MANQUANTE : ${image.source}`)
      continue
    }

    const master = sharp(source, { failOn: 'none' })
    if (image.crop) {
      master.extract({
        left: image.crop.x,
        top: image.crop.y,
        width: image.crop.width,
        height: image.crop.height,
      })
    }
    const buffer = await master.toBuffer()
    const meta = await sharp(buffer).metadata()
    const masterWidth = meta.width ?? image.width

    // Certaines sources fournies sont des JPEG légèrement tronqués (marqueur de
    // fin absent). On le signale pour que la source puisse être ré-exportée.
    let warning = ''
    try {
      await sharp(source).metadata()
      await sharp(source).stats()
    } catch {
      warning = ' ⚠ source tronquée, ré-export recommandé'
    }

    const targets = config.widths.filter((w) => w <= masterWidth)
    if (!targets.includes(masterWidth)) targets.push(masterWidth)
    targets.sort((a, b) => a - b)

    // Un visuel peut restreindre ses formats (ex. WebP seul pour conserver la
    // transparence alpha : le JPEG ne gère pas la transparence).
    const formats = image.formats ?? config.formats

    const produced = {}
    for (const width of targets) {
      for (const format of formats) {
        const name = `${image.id}-${width}.${format}`
        const file = join(outDir, name)
        if (ifMissing && (await exists(file))) continue
        const pipeline = sharp(buffer).resize({ width, withoutEnlargement: true })
        // Le JPEG ne gère pas l'alpha : on aplatit sur le fond clair du site
        // plutôt que de laisser Sharp produire des zones noires.
        if (format === 'jpg' && meta.hasAlpha) {
          pipeline.flatten({ background: '#fdfaf3' })
        }
        await pipeline
          .toFormat(format === 'jpg' ? 'jpeg' : format, {
            quality: quality[format],
            progressive: format === 'jpg',
            mozjpeg: format === 'jpg',
          })
          .toFile(file)
        produced[width] = true
      }
    }
    report.push(
      `${image.id} — ${masterWidth}px source, largeurs : ${targets.join(', ')} (${formats.join('/')})${warning}`,
    )
  }

  // Icône pour l'écran d'accueil iOS, dérivée du favicon (rendu vectoriel).
  // iOS applique son propre masque arrondi : on aplatit sur la couleur de
  // fond de la marque pour éviter des coins transparents.
  const favicon = join(root, 'public/favicon.svg')
  if (await exists(favicon)) {
    const iconPath = join(root, 'public/apple-touch-icon.png')
    if (!(ifMissing && (await exists(iconPath)))) {
      await sharp(await readFile(favicon), { density: 384 })
        .resize(180, 180, { fit: 'contain', background: '#1f2a21' })
        .flatten({ background: '#1f2a21' })
        .png({ compressionLevel: 9 })
        .toFile(iconPath)
    }
    report.push('apple-touch-icon.png — 180×180 (dérivé de favicon.svg)')
  }

  // Manifeste informatif : utile pour vérifier ce qui a été généré.
  await writeFile(
    join(outDir, 'manifest.txt'),
    `# Généré par scripts/images.mjs — ne pas modifier à la main\n${report.join('\n')}\n`,
    'utf8',
  )
  console.log('[images] ok\n' + report.map((line) => '  - ' + line).join('\n'))
}

await run()
