import { useMemo, useRef, useState } from 'react'
import { roue } from '../lib/data'
import type { DoshaId, TimeSlot } from '../lib/data'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { MissingData } from '../components/ui/MissingData'

const CX = 150
const CY = 150
const R_OUTER = 120
const R_INNER = 78

const doshaColor: Record<DoshaId, string> = {
  vata: 'var(--color-vata)',
  pitta: 'var(--color-pitta)',
  kapha: 'var(--color-kapha)',
}

function polar(angleDeg: number, radius: number): [number, number] {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return [CX + radius * Math.cos(rad), CY + radius * Math.sin(rad)]
}

/** Secteur d'anneau entre deux heures (0–24 h), dans le sens horaire. */
function sectorPath(startHour: number, endHour: number): string {
  const a1 = (startHour / 24) * 360
  const a2 = (endHour / 24) * 360
  const [x1, y1] = polar(a1, R_OUTER)
  const [x2, y2] = polar(a2, R_OUTER)
  const [x3, y3] = polar(a2, R_INNER)
  const [x4, y4] = polar(a1, R_INNER)
  const large = a2 - a1 > 180 ? 1 : 0
  return [
    `M ${x1.toFixed(2)} ${y1.toFixed(2)}`,
    `A ${R_OUTER} ${R_OUTER} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`,
    `L ${x3.toFixed(2)} ${y3.toFixed(2)}`,
    `A ${R_INNER} ${R_INNER} 0 ${large} 0 ${x4.toFixed(2)} ${y4.toFixed(2)}`,
    'Z',
  ].join(' ')
}

const hourTicks = [0, 6, 12, 18]

/**
 * Roue des doshas interactive (rythme circadien).
 *
 * Implémentation en onglets (motif ARIA « tabs ») :
 * - les segments du disque sont décoratifs (`aria-hidden`), la roue est
 *   pilotée par les six onglets, entièrement au clavier (flèches, origine, fin) ;
 * - le panneau détail suit l'onglet actif.
 */
export function DoshaWheel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])
  const slots = roue.slots

  const segments = useMemo(
    () =>
      slots.map((slot) => ({
        slot,
        path: sectorPath(slot.start, slot.end),
        labelPoint: polar(((slot.start + (slot.end - slot.start) / 2) / 24) * 360, (R_OUTER + R_INNER) / 2),
      })),
    [slots],
  )

  const active = slots[activeIndex]

  function focusTab(index: number) {
    const next = (index + slots.length) % slots.length
    setActiveIndex(next)
    tabsRef.current[next]?.focus()
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        focusTab(index + 1)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        focusTab(index - 1)
        break
      case 'Home':
        event.preventDefault()
        focusTab(0)
        break
      case 'End':
        event.preventDefault()
        focusTab(slots.length - 1)
        break
      default:
        break
    }
  }

  return (
    <Section
      id="roue"
      title="Les six périodes de la journée"
      intro={<p>{roue.subtitle}</p>}
      defer
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-16">
        {/* Roue : purement décorative, la description textuelle est portée par
            les onglets et le panneau. */}
        <Reveal>
          <div className="mx-auto w-full max-w-sm">
            <svg
              viewBox="0 0 300 300"
              className="h-auto w-full"
              aria-hidden="true"
              focusable="false"
            >
              <circle cx={CX} cy={CY} r={R_OUTER + 14} className="fill-surface" />
              <circle
                cx={CX}
                cy={CY}
                r={R_OUTER + 14}
                fill="none"
                stroke="var(--color-line)"
                strokeWidth="1"
              />

              {segments.map(({ slot, path, labelPoint }, index) => {
                const isActive = index === activeIndex
                return (
                  <g key={slot.id}>
                    <path
                      d={path}
                      fill={doshaColor[slot.dosha]}
                      opacity={isActive ? 1 : 0.34}
                      stroke="var(--color-surface)"
                      strokeWidth="2"
                    />
                    <text
                      x={labelPoint[0]}
                      y={labelPoint[1]}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="11"
                      letterSpacing="1.2"
                      fill={isActive ? '#fffdf7' : 'var(--color-text)'}
                      opacity={isActive ? 1 : 0.8}
                    >
                      {slot.doshaLabel.toUpperCase()}
                    </text>
                  </g>
                )
              })}

              {hourTicks.map((hour) => {
                const [x, y] = polar((hour / 24) * 360, R_OUTER + 26)
                return (
                  <text
                    key={hour}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="10"
                    fill="var(--color-text-muted)"
                  >
                    {hour}h
                  </text>
                )
              })}

              <text
                x={CX}
                y={CY - 12}
                textAnchor="middle"
                fontSize="12"
                letterSpacing="1.4"
                fill="var(--color-text-muted)"
              >
                {active.timeLabel}
              </text>
              <text
                x={CX}
                y={CY + 14}
                textAnchor="middle"
                fontSize="22"
                fontFamily="var(--font-display)"
                fill={doshaColor[active.dosha]}
              >
                {active.doshaLabel}
              </text>
            </svg>
            <p className="mt-4 text-center text-xs text-text-muted">{roue.instruction}</p>
          </div>
        </Reveal>

        {/* Onglets + panneau détail */}
        <Reveal delay={100}>
          <div
            role="tablist"
            aria-label="Les six périodes de la journée"
            aria-orientation="vertical"
            className="grid gap-2 sm:grid-cols-2"
          >
            {slots.map((slot, index) => {
              const selected = index === activeIndex
              return (
                <button
                  key={slot.id}
                  ref={(node) => {
                    tabsRef.current[index] = node
                  }}
                  type="button"
                  role="tab"
                  id={`roue-onglet-${slot.id}`}
                  aria-selected={selected}
                  aria-controls={`roue-panneau-${slot.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className={[
                    'flex min-h-16 items-center gap-3 rounded-lg border px-4 py-3 text-left transition-[border-color,background-color] duration-200',
                    selected
                      ? 'border-accent bg-accent-soft'
                      : 'border-line bg-surface hover:border-line-strong',
                  ].join(' ')}
                >
                  <span
                    aria-hidden="true"
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: doshaColor[slot.dosha] }}
                  />
                  <span className="block">
                    <span className="block text-sm font-medium text-text">{slot.timeLabel}</span>
                    <span className="block text-xs text-text-muted">
                      {slot.doshaLabel} · {slot.title}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>

          <div
            key={active.id}
            role="tabpanel"
            id={`roue-panneau-${active.id}`}
            aria-labelledby={`roue-onglet-${active.id}`}
            tabIndex={0}
            className="animate-soft-fade mt-6 rounded-lg border border-line bg-surface p-7"
          >
            <p className="text-2xs font-medium tracking-[0.16em] text-text-muted uppercase">
              {active.timeLabel} · {active.doshaLabel}
            </p>
            <h3 className="mt-3 text-2xl text-text">{active.title}</h3>
            <p className="mt-4 text-base text-text-muted">{active.text}</p>
          </div>
        </Reveal>
      </div>

      {/* Récapitulatif : la même information sous forme de liste, utile à
          l'impression, à la lecture et au référencement. */}
      <div className="mt-16 border-t border-line pt-10">
        <h3 className="text-xl text-text">Le récapitulatif de la journée</h3>
        <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot: TimeSlot) => (
            <li key={slot.id} className="border-s-2 ps-4" style={{ borderColor: doshaColor[slot.dosha] }}>
              <p className="m-0 text-sm font-medium text-text">{slot.timeLabel}</p>
              <p className="m-0 text-xs tracking-wide text-text-muted uppercase">
                {slot.doshaLabel} · {slot.title}
              </p>
              <p className="mt-2 text-sm text-text-muted">{slot.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-base">
          <strong className="font-display text-lg font-normal">{roue.slogan}</strong>
        </p>
        <div className="mt-6 max-w-2xl">
          <MissingData label={roue.sourceNote} />
        </div>
      </div>
    </Section>
  )
}
