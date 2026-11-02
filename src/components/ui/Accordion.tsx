import type { ReactNode } from 'react'
import { useId } from 'react'

interface AccordionItemProps {
  question: string
  children: ReactNode
  /** Ouvre l'élément par défaut. */
  open?: boolean
}

/**
 * Accordéon basé sur `<details>` / `<summary>` : entièrement accessible et
 * fonctionnel sans JavaScript, avec une animation douce sur l'ouverture.
 */
export function AccordionItem({ question, children, open = false }: AccordionItemProps) {
  const id = useId()

  return (
    <details
      className="group border-b border-line last:border-b-0 [&[open]>summary_.chevron]:rotate-180"
      open={open}
    >
      <summary
        id={`${id}-titre`}
        className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-medium text-text marker:content-none hover:text-accent-text [&::-webkit-details-marker]:hidden"
      >
        <span>{question}</span>
        <span
          aria-hidden="true"
          className="chevron shrink-0 text-accent-text transition-transform duration-300 ease-[var(--ease-out-soft)]"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor">
            <path d="M3 6.5 9 12.5l6-6" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
      </summary>
      <div className="pb-6 pe-8 text-base text-text-muted">{children}</div>
    </details>
  )
}

interface AccordionProps {
  children: ReactNode
  className?: string
}

export function Accordion({ children, className }: AccordionProps) {
  return (
    <div className={['border-t border-line', className ?? ''].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}
