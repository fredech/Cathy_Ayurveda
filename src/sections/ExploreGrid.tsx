import { Link } from 'react-router-dom'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { Illustration } from '../components/graphics/Botanical'
import { dosha, produits, roue } from '../lib/data'

interface Tile {
  to: string
  eyebrow: string
  title: string
  text: string
  illustration: string
  /** Occupation dans la grille éditoriale (asymétrique sur grand écran). */
  span: string
}

const tiles: Tile[] = [
  {
    to: '/roue-ayurvedique',
    eyebrow: 'Rythme circadien',
    title: roue.title,
    text: roue.subtitle,
    illustration: 'sun',
    span: 'lg:col-span-3',
  },
  {
    to: '/mon-dosha',
    eyebrow: 'Auto-observation',
    title: dosha.title,
    text: dosha.subtitle,
    illustration: 'leaf',
    span: 'lg:col-span-3',
  },
  {
    to: '/produits',
    eyebrow: `Soins & plantes · ${produits.items.length} références`,
    title: produits.title,
    text: produits.subtitle,
    illustration: 'drop',
    span: 'lg:col-span-2',
  },
  {
    to: '/coaching',
    eyebrow: 'Accompagnement',
    title: 'Une séance ou un mois de suivi',
    text: 'Une séance ponctuelle pour faire le point, ou un accompagnement d’un mois avec un protocole détaillé.',
    illustration: 'shield',
    span: 'lg:col-span-2',
  },
  {
    to: '/contact',
    eyebrow: 'Prendre rendez-vous',
    title: 'Parlons de votre situation',
    text: 'Écrivez-moi quelques lignes : je vous réponds et nous voyons ensemble ce qui vous convient.',
    illustration: 'sprig',
    span: 'lg:col-span-2',
  },
]

export function ExploreGrid() {
  return (
    <Section
      id="explorer"
      eyebrow="Explorer"
      title="Comprendre l’Ayurveda, étape par étape"
      intro="Chaque page approfondit un aspect : le rythme de la journée, votre constitution, les soins et les formules d’accompagnement."
      defer
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
        {tiles.map((tile, index) => (
          <Reveal as="li" key={tile.to} delay={index * 70} className={tile.span}>
            <Link
              to={tile.to}
              className="group flex h-full flex-col justify-between gap-8 rounded-lg border border-line bg-surface p-7 no-underline transition-[border-color,transform] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-accent"
            >
              <span className="flex items-start justify-between gap-4">
                <span className="text-2xs font-medium tracking-[0.16em] text-text-muted uppercase">
                  {tile.eyebrow}
                </span>
                <Illustration
                  name={tile.illustration}
                  className="size-8 shrink-0 text-moss-500 transition-colors duration-300 group-hover:text-accent"
                />
              </span>
              <span className="block">
                <span className="block font-display text-2xl text-text group-hover:text-accent-text">
                  {tile.title}
                </span>
                <span className="mt-3 block text-sm text-text-muted">{tile.text}</span>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent-text">
                  Découvrir
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
