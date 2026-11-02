import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    assetsInlineLimit: 1024,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        /**
         * Séparation du socle (React, React DOM, React Router) et du code du
         * site : le socle change rarement et reste en cache d'une version à
         * l'autre, seul le code applicatif est retéléchargé.
         *
         * Les composants interactifs (roue, questionnaire, formulaire) sont
         * volontairement importés de façon statique : leur découpage ne
         * gagnerait que ~7 Ko compressés, alors qu'il empêcherait le HTML
         * pré-rendu de contenir leur contenu (repli visible et contenu masqué).
         */
        manualChunks(id: string) {
          if (id.includes('node_modules')) return 'socle'
          return undefined
        },
      },
    },
  },
})
