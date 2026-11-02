import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'quiet' | 'link'
type Size = 'md' | 'lg'

interface BaseProps {
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
  /** Icône décorative placée après le libellé. */
  icon?: ReactNode
  fullWidth?: boolean
}

interface LinkButtonProps extends BaseProps {
  to: string
  href?: never
  onClick?: never
  type?: never
  external?: never
  disabled?: never
}

interface AnchorButtonProps extends BaseProps {
  href: string
  external?: boolean
  to?: never
  onClick?: never
  type?: never
  disabled?: never
}

interface ActionButtonProps extends BaseProps {
  onClick?: () => void
  to?: never
  href?: never
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export type ButtonProps = LinkButtonProps | AnchorButtonProps | ActionButtonProps

const base =
  'inline-flex items-center justify-center gap-2 text-center font-medium tracking-tight no-underline transition-[transform,background-color,color,border-color] duration-200 ease-[var(--ease-out-soft)] focus-visible:outline-3'

const variants: Record<Variant, string> = {
  primary:
    'bg-button-bg text-button-text border border-transparent hover:bg-button-bg-hover active:translate-y-px shadow-[var(--shadow-soft)]',
  secondary:
    'bg-secondary-bg text-secondary-text border border-line-strong hover:border-accent hover:text-accent-text active:translate-y-px',
  quiet:
    'bg-transparent text-accent-text border border-current/30 hover:border-current hover:bg-accent-soft',
  link: 'bg-transparent text-accent-text underline underline-offset-4 decoration-1 hover:decoration-2 px-1 py-1',
}

const sizes: Record<Size, string> = {
  md: 'rounded-full px-5 py-3 text-sm min-h-11',
  lg: 'rounded-full px-7 py-4 text-base min-h-12',
}

function classes(variant: Variant, size: Size, fullWidth: boolean, className?: string) {
  return [
    base,
    variants[variant],
    variant === 'link' ? 'text-sm' : sizes[size],
    fullWidth ? 'w-full' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')
}

export function Button(props: ButtonProps) {
  const { children, variant = 'primary', size = 'md', className, icon, fullWidth = false } = props
  const cls = classes(variant, size, fullWidth, className)

  const content = (
    <>
      <span>{children}</span>
      {icon ? <span aria-hidden="true">{icon}</span> : null}
    </>
  )

  if ('to' in props && props.to) {
    return (
      <Link to={props.to} className={cls}>
        {content}
      </Link>
    )
  }

  if ('href' in props && props.href) {
    const isExternal = props.external ?? /^https?:|^tel:|^mailto:/.test(props.href)
    return (
      <a
        href={props.href}
        className={cls}
        {...(isExternal ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
      >
        {content}
      </a>
    )
  }

  const action = props as ActionButtonProps
  return (
    <button
      type={action.type ?? 'button'}
      onClick={action.onClick}
      disabled={action.disabled}
      className={[cls, action.disabled ? 'cursor-not-allowed opacity-55' : ''].filter(Boolean).join(' ')}
    >
      {content}
    </button>
  )
}
