/**
 * Télécharge les polices auto-hébergées (Fraunces pour les titres, Inter pour
 * le texte) depuis l'API Google Fonts, écrit `public/fonts/*.woff2` et
 * `src/styles/fonts.css`.
 *
 * Lancer une seule fois : `npm run fonts`
 * Les fichiers générés sont versionnés dans le dépôt : le script n'est pas
 * relancé à chaque build (pas de dépendance réseau à la construction).
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const fontDir = join(root, 'public/fonts')
const cssFile = join(root, 'src/styles/fonts.css')

// Un site en français n'a besoin que des sous-ensembles latin et latin-ext :
// on évite ainsi de télécharger cyrillique, grec et vietnamien.
const KEEP = ['latin', 'latin-ext']

const FAMILIES = [
  {
    label: 'Fraunces',
    url: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&display=swap',
  },
  {
    label: 'Inter',
    url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300..600&display=swap',
  },
]

// Un UA moderne est indispensable pour obtenir du woff2 variable.
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} pour ${url}`)
  return res.text()
}

await mkdir(fontDir, { recursive: true })

const out = [
  '/* Généré par scripts/fonts.mjs — ne pas modifier à la main.',
  '   Polices auto-hébergées : Fraunces (titres) et Inter (texte).',
  '   Licences : SIL Open Font License 1.1 — https://openfontlicense.org */',
  '',
]

// Le commentaire de sous-ensemble précède toujours son bloc @font-face.
const FACE_RE = /\/\*\s*([a-z-]+?)\s*\*\/\s*@font-face\s*\{([^}]*)\}/g

for (const family of FAMILIES) {
  const css = await fetchText(family.url)
  let written = 0

  for (const match of css.matchAll(FACE_RE)) {
    const [, subset, body] = match
    if (!KEEP.includes(subset)) continue

    const url = body.match(/url\((https:[^)]+\.woff2)\)/)?.[1]
    const unicodeRange = body.match(/unicode-range:\s*([^;]+);/)?.[1]
    if (!url || !unicodeRange) continue

    const style = /font-style:\s*italic/.test(body) ? 'italic' : 'normal'
    const fileName = `${family.label.toLowerCase()}-${subset}-${style}.woff2`
    const res = await fetch(url, { headers: { 'User-Agent': UA } })
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} pour ${url}`)
    const bytes = Buffer.from(await res.arrayBuffer())
    await writeFile(join(fontDir, fileName), bytes)
    written += 1

    const axis = ''

    out.push(
      '@font-face {',
      `  font-family: "${family.label}";`,
      `  font-style: ${style};`,
      '  font-weight: 300 700;',
      '  font-display: swap;',
      `  src: url("/fonts/${fileName}") format("woff2");`,
      ...(axis ? [axis.trimEnd()] : []),
      `  unicode-range: ${unicodeRange};`,
      '}',
      '',
    )
    console.log(`[fonts] ${fileName} — ${(bytes.length / 1024).toFixed(0)} Ko`)
  }

  if (written === 0) throw new Error(`Aucune police récupérée pour ${family.label}`)
}

await mkdir(dirname(cssFile), { recursive: true })
await writeFile(cssFile, out.join('\n'), 'utf8')
console.log(`[fonts] ${cssFile} écrit`)
