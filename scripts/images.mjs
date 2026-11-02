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

async function run() {
  await mkdir(outDir, { recursive: true })
  const report = []

  for (const image of config.images) {
    if (image.usage === 'reference' || image.usage === 'excluded') {
      report.push(`${image.id} — ignorée (${image.usage})`)
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
