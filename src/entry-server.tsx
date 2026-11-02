import { renderToReadableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import { buildHeadHtml } from './lib/seo'

export { routePaths } from './lib/routes'

/**
 * Rendu d'une page en HTML, utilisé par `scripts/prerender.mjs` pour générer
 * un fichier statique par route. Le pré-rendu donne un HTML complet aux
 * robots d'indexation et un affichage immédiat, avant l'hydratation.
 */
export async function render(path: string): Promise<{ html: string; head: string }> {
  const stream = await renderToReadableStream(
    <StaticRouter location={path}>
      <App />
    </StaticRouter>,
    {
      onError(error: unknown) {
        // On remonte l'erreur : le build doit échouer plutôt que publier un
        // HTML incomplet.
        throw error instanceof Error ? error : new Error(String(error))
      },
    },
  )

  await stream.allReady
  const html = await new Response(stream).text()

  return { html, head: buildHeadHtml(path) }
}
