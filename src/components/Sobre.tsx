import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { dividirEmLetras } from '../lib/letras'

const colagem = [
  {
    src: './fotos/DSC00051.jpg',
    alt: 'Congregação da Igreja Esperança em adoração',
    classe: 'left-0 top-0 aspect-[3/2] w-[68%] sm:w-[56%] rotate-[-1deg]',
    vel: 0.5,
    legenda: 'Domingo de manhã',
  },
  {
    src: './fotos/DSC00071.jpg',
    alt: 'Pai com filho no colo durante o culto',
    classe: 'right-0 top-[16%] aspect-[3/4] w-[56%] rotate-[2deg] sm:top-[10%] sm:w-[40%]',
    vel: 1.3,
    legenda: 'Famílias inteiras',
  },
  {
    src: './fotos/DSC00061.jpg',
    alt: 'Mulher em adoração com as mãos levantadas',
    classe: 'left-[14%] bottom-[0%] aspect-[3/4] w-[52%] rotate-[-2deg] sm:bottom-[4%] sm:left-[24%] sm:w-[36%]',
    vel: 0.8,
    legenda: 'Culto com vida',
  },
]

function FotoInline({ src, alt }: { src: string; alt: string }) {
  return (
    <span
      data-inline-img
      className="mx-1 inline-block h-[0.85em] w-[1.9em] overflow-hidden rounded-full align-middle ring-1 ring-slate-200 dark:ring-white/15"
    >
      <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 hover:scale-125" />
    </span>
  )
}

export function Sobre() {
  const secao = useRef<HTMLElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    if (!secao.current) return

    const ctx = gsap.context(() => {
      // Título: letras aparecem uma a uma no scroll (e somem voltando)
      gsap.utils.toArray<HTMLElement>('[data-letras]', secao.current).forEach((h) => {
        const letras = dividirEmLetras(h)
        gsap.fromTo(
          letras,
          { opacity: 0.08, y: 16 },
          {
            opacity: 1,
            y: 0,
            ease: 'none',
            stagger: 0.05,
            scrollTrigger: { trigger: h, start: 'top 88%', end: 'top 30%', scrub: 0.6 },
          },
        )
      })

      // Fotos embutidas no parágrafo abrem como cortinas
      gsap.utils.toArray<HTMLElement>('[data-inline-img]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.8,
            delay: i * 0.12,
            ease: 'back.out(1.6)',
            scrollTrigger: { trigger: el, start: 'top 88%' },
          },
        )
      })

      // Colagem: cada foto com velocidade de parallax diferente + revelação com clip
      gsap.utils.toArray<HTMLElement>('[data-colagem-foto]').forEach((fig) => {
        const img = fig.querySelector('img')
        const vel = Number(fig.dataset.vel || 1)
        const legenda = fig.querySelector('[data-legenda]')

        gsap.fromTo(
          fig,
          { clipPath: 'inset(100% 0% 0% 0% round 24px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 24px)',
            duration: 1.2,
            ease: 'power4.inOut',
            scrollTrigger: { trigger: fig, start: 'top 92%' },
          },
        )
        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.3 },
            { scale: 1.02, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: fig, start: 'top 92%' } },
          )
          gsap.fromTo(
            img,
            { y: vel * 50 },
            {
              y: vel * -50,
              ease: 'none',
              scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        }
        if (legenda) {
          gsap.fromTo(
            legenda,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.7, delay: 0.5, scrollTrigger: { trigger: fig, start: 'top 92%' } },
          )
        }
      })
    }, secao)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={secao} id="sobre" className="scroll-mt-16 overflow-hidden py-24 sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.5em] text-brand-500 dark:text-brand-400">
          Quem somos
        </p>
        <h2 data-letras className="mt-6 font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-6xl">
          Mais que um culto,
          <br />
          um lugar de <span className="text-brand-500 dark:text-brand-400">pertencimento.</span>
        </h2>

        <p className="mt-12 max-w-4xl font-display text-2xl font-medium leading-snug tracking-tight sm:text-4xl">
          Uma igreja
          <FotoInline src="./fotos/DSC00001.jpg" alt="Abraço entre duas pessoas no culto" />
          viva — gente de toda história
          <FotoInline src="./fotos/DSC00021.jpg" alt="Ministério de dança com bandeiras" />
          , cultos com vida
          <FotoInline src="./fotos/DSC00095.jpg" alt="Louvor no palco" />
          e uma mesa sempre preparada pra você.
        </p>

        {/* Colagem com parallax em velocidades diferentes */}
        <div data-colagem className="relative mt-24 h-[75vh] min-h-[480px] sm:h-[95vh]">
          <p
            aria-hidden
            className="texto-vazado pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-6 select-none whitespace-nowrap font-display text-[18vw] font-bold uppercase leading-none opacity-60"
          >
            Acolher
          </p>
          {colagem.map((f) => (
            <figure
              key={f.src}
              data-colagem-foto
              data-vel={f.vel}
              className={`group absolute overflow-hidden rounded-3xl shadow-2xl shadow-black/20 ring-1 ring-slate-200 dark:ring-white/10 ${f.classe}`}
            >
              <img src={f.src} alt={f.alt} loading="lazy" className="absolute left-0 top-[-18%] h-[136%] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <figcaption
                data-legenda
                className="absolute bottom-4 left-4 rounded-full bg-black/55 px-4 py-1.5 text-xs font-medium text-white backdrop-blur"
              >
                {f.legenda}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
