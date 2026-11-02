#!/usr/bin/env bash
# =============================================================================
# Cathy Ayurveda — script de démarrage
# -----------------------------------------------------------------------------
# Usage :
#   ./run.sh              installe si besoin, génère les médias, lance le serveur
#                         de développement puis ouvre le navigateur
#   ./run.sh --build      construit le site de production (dist/)
#   ./run.sh --preview    construit puis sert le site de production en local
#   ./run.sh --check      contrôle types + lint (sans lancer de serveur)
#   ./run.sh --no-open    lance le serveur de développement sans ouvrir le
#                         navigateur
#   ./run.sh --help       affiche cette aide
# =============================================================================
set -Eeuo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

readonly NODE_MIN_MAJOR=20
readonly NODE_MIN_MINOR=19
readonly PORT="${PORT:-5173}"
readonly PREVIEW_PORT="${PREVIEW_PORT:-4173}"

MODE="dev"
OPEN_BROWSER=1

print_help() { sed -n '2,14p' "$0" | sed 's/^# \{0,1\}//'; }

for arg in "$@"; do
  case "$arg" in
    --build)   MODE="build" ;;
    --preview) MODE="preview" ;;
    --check)   MODE="check" ;;
    --no-open) OPEN_BROWSER=0 ;;
    -h|--help) print_help; exit 0 ;;
    *) printf '\033[31mOption inconnue : %s\033[0m\n' "$arg" >&2; print_help >&2; exit 2 ;;
  esac
done

step() { printf '\n\033[38;5;108m▸ %s\033[0m\n' "$1"; }
warn() { printf '\033[33m! %s\033[0m\n' "$1" >&2; }
die()  { printf '\033[31m✗ %s\033[0m\n' "$1" >&2; exit 1; }

# --- 1. Node -----------------------------------------------------------------
command -v node >/dev/null 2>&1 || die "Node.js est introuvable. Installez Node 20.19+ : https://nodejs.org"
NODE_VERSION="$(node -v | sed 's/^v//')"
NODE_MAJOR="${NODE_VERSION%%.*}"
NODE_REST="${NODE_VERSION#*.}"
NODE_MINOR="${NODE_REST%%.*}"
if (( NODE_MAJOR < NODE_MIN_MAJOR || (NODE_MAJOR == NODE_MIN_MAJOR && NODE_MINOR < NODE_MIN_MINOR) )); then
  die "Node $NODE_VERSION détecté, or ce projet requiert Node ${NODE_MIN_MAJOR}.${NODE_MIN_MINOR} ou plus récent."
fi
step "Node v$NODE_VERSION"

# --- 2. Dépendances ----------------------------------------------------------
if [[ ! -d node_modules ]]; then
  step "Installation des dépendances (npm install)…"
  if [[ -f package-lock.json ]]; then npm ci || npm install; else npm install; fi
else
  step "Dépendances déjà installées (node_modules présent)"
fi

# --- 3. Médias : images optimisées et polices auto-hébergées -----------------
if [[ ! -f public/images/manifest.txt ]]; then
  step "Génération des images (AVIF / WebP / JPEG)…"
  npm run --silent images
fi

if ! compgen -G "public/fonts/*.woff2" >/dev/null; then
  step "Téléchargement des polices (Fraunces, Inter)…"
  npm run --silent fonts
fi

# --- 4. Action ---------------------------------------------------------------
case "$MODE" in
  check)
    step "Contrôle des types TypeScript…"; npm run --silent typecheck
    step "Lint ESLint…";                    npm run --silent lint
    step "Contrôles OK"
    ;;
  build)
    step "Construction du site de production…"
    npm run --silent build
    step "Build terminé — fichiers dans dist/"
    ;;
  preview)
    step "Construction du site de production…"; npm run --silent build
    step "Serveur de prévisualisation : http://localhost:${PREVIEW_PORT}"
    [[ "$OPEN_BROWSER" == 1 ]] && open "http://localhost:${PREVIEW_PORT}" 2>/dev/null || true
    exec npm run --silent preview
    ;;
  dev)
    URL="http://localhost:${PORT}"
    step "Serveur de développement : ${URL}"
    printf '   (Ctrl+C pour arrêter)\n'
    if [[ "$OPEN_BROWSER" == 1 ]]; then
      # Ouvre le navigateur une fois Vite prêt, sans bloquer le serveur.
      (
        for _ in $(seq 1 60); do
          if curl -s -o /dev/null "http://localhost:${PORT}"; then
            open "$URL" 2>/dev/null || true
            break
          fi
          sleep 0.5
        done
      ) &
    fi
    exec npx vite --port "$PORT" --strictPort
    ;;
esac
