import type { ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes, InputHTMLAttributes } from 'react'
import { useId } from 'react'

interface FieldShellProps {
  id: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: ReactNode
  className?: string
}

function FieldShell({ id, label, hint, error, required, children, className }: FieldShellProps) {
  return (
    <div className={['flex flex-col gap-2', className ?? ''].filter(Boolean).join(' ')}>
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label}
        {required ? (
          <span className="ms-1 text-accent-text" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ms-1 text-xs font-normal text-text-muted">(facultatif)</span>
        )}
      </label>
      {hint ? (
        <p id={`${id}-aide`} className="m-0 text-sm text-text-muted">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-erreur`} className="m-0 flex items-start gap-1.5 text-sm font-medium text-pitta">
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      ) : null}
    </div>
  )
}

const controlClass =
  'w-full rounded-sm border border-field-line bg-surface px-4 py-3 text-base text-text placeholder:text-text-muted/70 focus-visible:border-accent'

function describedBy(id: string, hint?: string, error?: string): string | undefined {
  const ids = [hint ? `${id}-aide` : null, error ? `${id}-erreur` : null].filter(Boolean)
  return ids.length ? ids.join(' ') : undefined
}

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string
  hint?: string
  error?: string
  name: string
}

export function TextField({ label, hint, error, required, className, ...rest }: TextFieldProps) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <input
        id={id}
        className={controlClass}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        required={required}
        {...rest}
      />
    </FieldShell>
  )
}

interface TextAreaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string
  hint?: string
  error?: string
  name: string
}

export function TextAreaField({ label, hint, error, required, className, ...rest }: TextAreaFieldProps) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <textarea
        id={id}
        rows={5}
        className={controlClass}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        required={required}
        {...rest}
      />
    </FieldShell>
  )
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label: string
  hint?: string
  error?: string
  options: { value: string; label: string }[]
  /** Option vide affichée en premier, pour forcer un choix explicite. */
  placeholder?: string
  name: string
}

export function SelectField({
  label,
  hint,
  error,
  required,
  options,
  placeholder,
  className,
  ...rest
}: SelectFieldProps) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <select
        id={id}
        className={controlClass}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        required={required}
        {...rest}
      >
        {placeholder ? (
          <option value="">{placeholder}</option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

interface CheckboxFieldProps {
  label: ReactNode
  hint?: string
  error?: string
  checked: boolean
  onChange: (checked: boolean) => void
  required?: boolean
  name: string
}

export function CheckboxField({
  label,
  hint,
  error,
  checked,
  onChange,
  required,
  name,
}: CheckboxFieldProps) {
  const id = useId()
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className="mt-1 size-5 shrink-0 accent-[var(--color-accent-text)]"
        />
        <label htmlFor={id} className="text-sm text-text-muted">
          {label}
        </label>
      </div>
      {hint ? (
        <p id={`${id}-aide`} className="m-0 ps-8 text-sm text-text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-erreur`} className="m-0 ps-8 flex items-start gap-1.5 text-sm font-medium text-pitta">
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      ) : null}
    </div>
  )
}
