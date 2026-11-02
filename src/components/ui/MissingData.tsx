/**
 * Repère visible pour une information absente du dossier `data/`.
 *
 * Aucun contenu n'est inventé : ce qui manque est affiché comme « à compléter ».
 * La liste complète figure dans `src/lib/todos.ts` et dans le README.
 */
interface MissingDataProps {
  /** Ce qu'il faut fournir. */
  label: string
  /** `inline` pour insérer le repère dans une phrase ou une ligne de coordonnées. */
  variant?: 'block' | 'inline'
  className?: string
}

export function MissingData({ label, variant = 'block', className }: MissingDataProps) {
  if (variant === 'inline') {
    return (
      <span
        className={[
          'inline-flex items-baseline gap-1.5 rounded-xs border border-dashed border-field-line px-2 py-0.5 text-sm text-text-muted',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="font-semibold tracking-wide not-italic">TODO</span>
        <span>{label}</span>
      </span>
    )
  }

  return (
    <p
      className={[
        'rounded-sm border border-dashed border-field-line bg-surface/60 px-4 py-3 text-sm text-text-muted',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="font-semibold tracking-wide">TODO</span>
      {' — '}
      {label}
    </p>
  )
}
