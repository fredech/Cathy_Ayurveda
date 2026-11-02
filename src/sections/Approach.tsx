import { Container } from '../components/ui/Container'
import { Picture } from '../components/ui/Picture'
import { Reveal } from '../components/ui/Reveal'
import { spicesImage } from '../lib/images'
import { home } from '../lib/data'

export function Approach() {
  return (
    <section className="py-section defer-paint bg-bg-alt" id="philosophie" aria-labelledby="philosophie-titre">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-20">
          <Reveal>
            <figure className="m-0">
              <div className="arch-mask bg-surface-alt">
                <Picture
                  image={spicesImage}
                  sizes="(min-width: 1024px) 34rem, 92vw"
                  imgClassName="h-full w-full object-cover"
                />
              </div>
              {spicesImage.caption ? (
                <figcaption className="mt-4 text-xs text-text-muted">{spicesImage.caption}</figcaption>
              ) : null}
            </figure>
          </Reveal>

          <Reveal delay={120}>
            <p className="text-xs font-medium tracking-[0.18em] text-accent-text uppercase">
              {home.approach.eyebrow}
            </p>
            <h2 id="philosophie-titre" className="mt-5 text-3xl text-text md:text-4xl">
              {home.approach.title}
            </h2>
            <div className="mt-6 space-y-4 text-base text-text-muted">
              {home.approach.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="m-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
