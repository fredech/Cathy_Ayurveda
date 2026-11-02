#!/usr/bin/env node
/**
 * Pré-rendu statique.
 *
 * 1. Construit le bundle serveur (`src/entry-server.tsx`) dans `dist-ssr/`.
 * 2. Pour chaque route, rend le HTML complet et l'injecte dans le gabarit
 *    `dist/index.html` (repères `<!--app-head-->` et `<!--app-html-->`).
 * 3. Écrit `dist/<route>/index.html`, plus `dist/404.html` pour les
 *    hébergeurs statiques.
 *
 * Le pré-rendu n'est jamais bloquant : si une étape échoue, le build doit
 * échouer explicitement (pas de publication d'un HTML incomplet).
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(root, 'dist')
const ssrDir = join(root, 'dist-ssr')
const viteBin = join(root, 'node_modules', 'vite', 'bin', 'vite.js')

const tplPath = join(distDir, 'index.html')
if (!existsSync(tplPath)) {
  throw new Error('dist/index.html introuvable — lancez `vite build` avant le pré-rendu.')
}

console.log('\n▸ Pré-rendu : construction du bundle serveur…')
rmSync(ssrDir, { recursive: true, force: true })
execFileSync(process.execPath, [viteBin, 'build', '--ssr', 'src/entry-server.tsx', '--outDir', 'dist-ssr', '--emptyOutDir'], {
  cwd: root,
  stdio: 'inherit',
})

const bundlePath = join(ssrDir, 'entry-server.js')
if (!existsSync(bundlePath)) {
  throw new Error(`Bundle serveur introuvable : ${bundlePath}`)
}

const { render, routePaths } = await import(pathToFileURL(bundlePath).href)
let template = readFileSync(tplPath, 'utf8')

const HEAD_MARKER = '<!--app-head-->'
const HTML_MARKER = '<!--app-html-->'
if (!template.includes(HEAD_MARKER) || !template.includes(HTML_MARKER)) {
  throw new Error(
    'index.html doit contenir les repères <!--app-head--> et <!--app-html--> pour le pré-rendu.',
  )
}

/**
 * Feuille de style « inline ».
 *
 * Le CSS est un fichier unique (cssCodeSplit: false) et n'est référencé par
 * aucun script : l'insérer directement dans le `<head>` supprime une requête
 * bloquante pour le rendu (≈ 320 ms sur mobile bridé) et laisse l'image
 * principale se charger plus tôt. Le fichier reste dans `dist/assets/` comme
 * repli si cette étape était désactivée.
 */
const styleLink = template.match(
  /<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/,
)
if (styleLink) {
  const cssPath = join(distDir, styleLink[1].replace(/^\//, ''))
  if (existsSync(cssPath)) {
    const css = readFileSync(cssPath, 'utf8')
    template = template.replace(styleLink[0], `<style>${css}</style>`)
    console.log(`  ▸ CSS inséré dans le HTML (${(css.length / 1024).toFixed(1)} Ko)`)
  } else {
    console.warn(`  ⚠ CSS introuvable (${cssPath}) : la feuille reste en lien externe.`)
  }
}

/**
 * Hydratation différée après le premier rendu.
 *
 * Le HTML pré-rendu et le CSS (inséré ci-dessus) suffisent à afficher la page :
 * le script de l'application n'a donc pas besoin de bloquer le premier
 * affichage. On remplace le script de module par un amorçage qui l'injecte
 * après l'événement `load` (donc après le premier rendu), et on retire les
 * `modulepreload` correspondants pour qu'ils ne prennent pas la bande passante
 * de l'élément LCP.
 *
 * Sans JavaScript, la page reste entièrement lisible et navigable : tous les
 * liens sont de vrais `<a href>` vers des pages pré-rendues.
 */
const entryScript = template.match(
  /<script type="module"[^>]*src="(\/assets\/[^"]+\.js)"[^>]*><\/script>/,
)
if (entryScript) {
  const entrySrc = entryScript[1]
  template = template.replace(
    /[ \t]*<link rel="modulepreload"[^>]*>\n?/g,
    '',
  )
  const bootstrap = [
    '<script>',
    '(function(){',
    'var src=' + JSON.stringify(entrySrc) + ';',
    'function hydrate(){',
    'var s=document.createElement("script");',
    's.type="module";s.crossOrigin="anonymous";s.src=src;',
    'document.head.appendChild(s);',
    '}',
    'if(document.readyState==="complete"){requestAnimationFrame(function(){requestAnimationFrame(hydrate)})}',
    'else{window.addEventListener("load",function(){requestAnimationFrame(function(){requestAnimationFrame(hydrate)})},{once:true})}',
    '})();',
    '</script>',
  ].join('')
  template = template.replace(entryScript[0], bootstrap)
  console.log(`  ▸ Hydratation différée après le premier rendu (${entrySrc})`)
}

function outputPathFor(route) {
  if (route === '/') return join(distDir, 'index.html')
  const clean = route.replace(/^\/+|\/+$/g, '')
  return join(distDir, clean, 'index.html')
}

let rendered = 0
for (const route of routePaths) {
  const { html, head } = await render(route)
  const page = template.replace(HEAD_MARKER, head).replace(HTML_MARKER, html)

  const target = outputPathFor(route)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, page, 'utf8')

  const label = target.replace(`${root}/`, '')
  console.log(`  ✓ ${route} → ${label}`)
  rendered += 1
}

// Repli pour les hébergeurs statiques qui servent 404.html.
const notFoundPage = await render('/404')
const notFoundHtml = template
  .replace(
    HEAD_MARKER,
    '<title>Page introuvable | Cathy Ayurveda</title>\n    <meta name="robots" content="noindex" />',
  )
  .replace(HTML_MARKER, notFoundPage.html)
writeFileSync(join(distDir, '404.html'), notFoundHtml, 'utf8')

rmSync(ssrDir, { recursive: true, force: true })

console.log(`\n✓ ${rendered} pages pré-rendues dans dist/ (+ 404.html)\n`)
