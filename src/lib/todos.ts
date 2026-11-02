/**
 * Liste centralisée des informations manquantes dans `data/`.
 *
 * Elle sert de source unique pour le récapitulatif affiché dans le README et
 * pour l'avertissement visible en console pendant le développement. Chaque
 * entrée correspond à un `TODO:` affiché à l'écran via `<MissingData>`
 * (`src/components/ui/MissingData.tsx`).
 */
export interface TodoEntry {
  /** Où l'information manque. */
  where: string
  /** Ce qu'il faut fournir. */
  what: string
}

export const TODOS: TodoEntry[] = [
  { where: 'site.json → contact', what: 'Numéro de téléphone et numéro WhatsApp.' },
  {
    where: 'site.json → contact',
    what: 'Adresse postale complète, horaires d’ouverture et temps de réponse habituel.',
  },
  { where: 'site.json → social', what: 'Liens Instagram, Facebook et YouTube s’ils existent.' },
  {
    where: 'site.json → url',
    what: 'Nom de domaine définitif (canonique, sitemap, Open Graph).',
  },
  {
    where: 'coaching.json → offers',
    what: 'Durée, format (visio / présentiel), tarif et moyens de paiement des deux formules.',
  },
  {
    where: 'coaching.json → faq',
    what: 'Déroulé précis d’une séance et possibilité de séances à distance.',
  },
  {
    where: 'produits.json → items',
    what: 'Formats, prix, visuels produits et disponibilités pour les cinq références.',
  },
  {
    where: 'produits.json',
    what: 'Validation par la praticienne des descriptions et des précautions d’usage.',
  },
  {
    where: 'dosha.json',
    what: 'Validation du questionnaire et des conseils par la praticienne.',
  },
  {
    where: 'roue-ayurvedique.json',
    what: 'Relecture des textes transcrits depuis le visuel fourni (transcription automatique).',
  },
  {
    where: 'images.json',
    what: 'Remplacement des textes alternatifs par la praticienne, et photos originales pour remplacer les deux aperçus de banque d’images écartés.',
  },
  {
    where: 'images.json → spices',
    what: 'Ré-export de la photo du bol d’épices : le fichier fourni est tronqué (marqueur de fin absent).',
  },
  {
    where: 'legal.json',
    what: 'Identité de l’éditeur, hébergeur, durées de conservation, date de mise à jour et mentions légales.',
  },
  { where: 'home.json → hero', what: 'Portrait professionnel définitif si un autre visuel est souhaité.' },
]
