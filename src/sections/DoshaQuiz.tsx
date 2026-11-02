import { useMemo, useRef, useState } from 'react'
import { dosha } from '../lib/data'
import type { DoshaId } from '../lib/data'
import { Section } from '../components/ui/Section'
import { Button } from '../components/ui/Button'

type Answers = Record<string, DoshaId>

const doshaColor: Record<DoshaId, string> = {
  vata: 'var(--color-vata)',
  pitta: 'var(--color-pitta)',
  kapha: 'var(--color-kapha)',
}

const doshaOrder: DoshaId[] = ['vata', 'pitta', 'kapha']

/**
 * Questionnaire d'auto-observation Vata / Pitta / Kapha.
 *
 * - Chaque question est un groupe de boutons radio dans un `fieldset` légendé.
 * - Le résultat s'affiche après validation, avec la répartition complète.
 * - Le questionnaire est présenté comme éducatif, jamais comme un diagnostic.
 */
export function DoshaQuiz() {
  const [answers, setAnswers] = useState<Answers>({})
  const [submitted, setSubmitted] = useState(false)
  const resultRef = useRef<HTMLDivElement | null>(null)
  const questions = dosha.questions

  const answeredCount = Object.keys(answers).length
  const total = questions.length
  const progress = Math.round((answeredCount / total) * 100)
  const isComplete = answeredCount === total

  const scores = useMemo(() => {
    const base: Record<DoshaId, number> = { vata: 0, pitta: 0, kapha: 0 }
    Object.values(answers).forEach((value) => {
      base[value] += 1
    })
    return base
  }, [answers])

  const ranking = useMemo(
    () => [...doshaOrder].sort((a, b) => scores[b] - scores[a]),
    [scores],
  )

  const dominant = ranking[0]
  const tied = scores[ranking[0]] === scores[ranking[1]]
  const profile = dosha.profiles[dominant]

  function select(questionId: string, value: DoshaId) {
    setAnswers((previous) => ({ ...previous, [questionId]: value }))
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isComplete) return
    setSubmitted(true)
    window.requestAnimationFrame(() => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      resultRef.current?.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' })
    })
  }

  function reset() {
    setAnswers({})
    setSubmitted(false)
  }

  return (
    <Section
      id="questionnaire"
      title="Le questionnaire"
      intro={<p>{dosha.subtitle}</p>}
      defer
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
        <form onSubmit={onSubmit} aria-describedby="questionnaire-aide">
          <p id="questionnaire-aide" className="text-sm text-text-muted">
            Douze questions, environ deux minutes. Répondez spontanément, en pensant à vos tendances
            de fond plutôt qu’à la journée d’hier.
          </p>

          <div
            className="mt-6 flex items-center gap-4"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label={`Progression du questionnaire : ${answeredCount} réponses sur ${total}`}
          >
            <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-300 ease-[var(--ease-out-soft)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="shrink-0 text-sm text-text-muted">
              {answeredCount}/{total}
            </span>
          </div>

          <ol className="mt-10 space-y-10">
            {questions.map((question, index) => (
              <li key={question.id}>
                <fieldset className="m-0 border-0 p-0">
                  <legend className="mb-4 flex items-baseline gap-3 font-display text-xl text-text">
                    <span aria-hidden="true" className="text-sm text-text-muted">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {question.label}
                  </legend>
                  <div className="grid gap-2">
                    {question.options.map((option) => {
                      const selected = answers[question.id] === option.dosha
                      return (
                        <label
                          key={option.label}
                          className={[
                            'flex min-h-12 cursor-pointer items-center gap-3 rounded-sm border px-4 py-3 text-sm transition-[border-color,background-color] duration-200',
                            selected
                              ? 'border-accent bg-accent-soft text-text'
                              : 'border-line bg-surface text-text-muted hover:border-line-strong',
                          ].join(' ')}
                        >
                          <input
                            type="radio"
                            name={question.id}
                            value={option.dosha}
                            checked={selected}
                            onChange={() => select(question.id, option.dosha)}
                            className="size-4 shrink-0 accent-[var(--color-accent-text)]"
                          />
                          <span>{option.label}</span>
                        </label>
                      )
                    })}
                  </div>
                </fieldset>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Button type="submit" variant="primary" size="lg" disabled={!isComplete}>
              Voir mon résultat
            </Button>
            {answeredCount > 0 ? (
              <Button variant="link" onClick={reset}>
                Réinitialiser mes réponses
              </Button>
            ) : null}
            {!isComplete ? (
              <p className="m-0 text-sm text-text-muted" aria-live="polite">
                {total - answeredCount} question{total - answeredCount > 1 ? 's' : ''} restante
                {total - answeredCount > 1 ? 's' : ''}.
              </p>
            ) : null}
          </div>
        </form>

        <aside className="lg:sticky lg:top-28">
          <div className="rounded-lg border border-line bg-surface-alt p-7">
            <h3 className="text-lg text-text">Comment lire le résultat</h3>
            <p className="mt-3 text-sm text-text-muted">
              Personne n’est « un seul » dosha : la plupart des profils sont mixtes, avec une ou deux
              tendances dominantes qui évoluent selon les saisons et les périodes de vie.
            </p>
            <p className="mt-4 text-sm text-text-muted">{dosha.disclaimer}</p>
          </div>
        </aside>
      </div>

      {submitted ? (
        <div
          ref={resultRef}
          role="status"
          className="animate-soft-fade mt-16 rounded-xl border border-line bg-surface p-7 md:p-10"
        >
          <p className="text-2xs font-medium tracking-[0.16em] text-accent-text uppercase">
            Votre tendance dominante
          </p>
          <h3 className="mt-3 text-3xl text-text md:text-4xl">
            {tied ? `Profil mixte ${dosha.profiles[ranking[0]].name} – ${dosha.profiles[ranking[1]].name}` : profile.name}
          </h3>
          {!tied ? (
            <p className="mt-2 text-sm text-text-muted">{profile.elements}</p>
          ) : (
            <p className="mt-2 text-sm text-text-muted">{dosha.mixedNote}</p>
          )}

          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {doshaOrder.map((key) => {
              const value = scores[key]
              const width = Math.round((value / total) * 100)
              return (
                <div key={key}>
                  <p className="m-0 flex items-baseline justify-between text-sm font-medium">
                    <span>{dosha.profiles[key].name}</span>
                    <span className="text-text-muted">{value}</span>
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${width}%`, backgroundColor: doshaColor[key] }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-text-muted">{dosha.profiles[key].qualities}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div>
              <h4 className="text-lg text-text">Ce que cela peut expliquer</h4>
              <p className="mt-3 text-sm text-text-muted">{profile.imbalance}</p>
              <h4 className="mt-6 text-lg text-text">Quand c’est équilibré</h4>
              <p className="mt-3 text-sm text-text-muted">{profile.balanced}</p>
            </div>
            <div>
              <h4 className="text-lg text-text">Gestes qui soutiennent l’équilibre</h4>
              <ul className="mt-3 space-y-2 text-sm text-text-muted">
                {profile.advice.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden="true" className="text-accent-text">
                      •
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:items-center">
            <Button to="/coaching" variant="primary" size="lg">
              Approfondir avec un bilan
            </Button>
            <Button variant="secondary" size="lg" onClick={reset}>
              Refaire le test
            </Button>
          </div>

          <p className="mt-6 text-xs text-text-muted">{dosha.disclaimer}</p>
        </div>
      ) : null}
    </Section>
  )
}
