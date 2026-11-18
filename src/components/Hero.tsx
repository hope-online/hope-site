import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Cena3D, type ProgressRef } from './three/Cena3D'

export function Hero({ dark }: { dark: boolean }) {
  const secao = useRef<HTMLElement>(null)
  const progressRef: ProgressRef = useRef(0)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    if (!secao.current) return

    const ctx = gsap.context(() => {
      const linhas = gsap.utils.toArray<HTMLElement>('[data-hero-linha]')
      const l1 = linhas[0]
      const l2 = linhas[1]
      const l3 = linhas[2]

      // Estado inicial: linhas 2 e 3 escondidas abaixo da máscara
      if (l2) gsap.set(l2, { yPercent: 110 })
      if (l3) gsap.set(l3, { yPercent: 110 })

      // Intro: linha 1 sobe quando o preloader termina (evento) — com fallback
      const intro = gsap
        .timeline({ paused: true, defaults: { ease: 'power4.out' } })
        .fromTo(l1, { yPercent: 110 }, { yPercent: 0, duration: 1.1 })
        .fromTo(
          '[data-hero-meta]',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 },
          '-=0.6',
        )

      const comecar = () => intro.play()
      const fallback = window.setTimeout(comecar, 3200)
      const aoTermarPreloader = () => {
        window.clearTimeout(fallback)
        comecar()
      }
      window.addEventListener('preloader-fim', aoTermarPreloader, { once: true })

      // Seção pinada: conforme rola, uma linha some e a próxima aparece —
      // no sentido contrário, reverte (volta montando para o topo)
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: secao.current,
          start: 'top top',
          end: '+=260%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            progressRef.current = self.progress
          },
        },
      })

      tl.to(l1, { yPercent: -110, duration: 0.18, ease: 'power2.in' }, 0.12)
        .to(l2, { yPercent: 0, duration: 0.18, ease: 'power2.out' }, 0.26)
        .to(l2, { yPercent: -110, duration: 0.18, ease: 'power2.in' }, 0.54)
        .to(l3, { yPercent: 0, duration: 0.18, ease: 'power2.out' }, 0.68)
        .to(l3, { yPercent: -110, duration: 0.16, ease: 'power2.in' }, 0.96)
        .to('[data-hero-meta]', { opacity: 0, y: -40, duration: 0.14, stagger: 0.04 }, 0.94)
        .to('[data-hero-vinheta]', { opacity: 0.75, duration: 0.3 }, 0.75)

      return () => {
        window.removeEventListener('preloader-fim', aoTermarPreloader)
        window.clearTimeout(fallback)
      }
    }, secao)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={secao} id="inicio" className="relative h-[100svh] min-h-[520px] overflow-hidden">
      <div className="absolute inset-0">
        <Cena3D progressRef={progressRef} dark={dark} />
      </div>
      <div
        data-hero-vinheta
        className="pointer-events-none absolute inset-0 bg-noite opacity-0"
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        <p
          data-hero-meta
          className="mb-6 text-[11px] font-semibold uppercase tracking-[0.5em] text-brand-500 dark:text-brand-400"
        >
          Igreja Esperança
        </p>

        <h1 className="text-center font-display font-bold leading-[1.05] tracking-tight">
          <span className="block overflow-hidden pb-1">
            <span data-hero-linha className="block text-[6vw] lg:text-7xl xl:text-8xl">
              Fé que acolhe,
            </span>
          </span>
          <span className="block overflow-hidden pb-1">
            <span data-hero-linha className="block text-[6vw] lg:text-7xl xl:text-8xl">
              amor que serve,
            </span>
          </span>
          <span className="block overflow-hidden pb-2">
            <span data-hero-linha className="block text-[6vw] lg:text-7xl xl:text-8xl">
              <span className="text-brand-500 dark:text-brand-400">esperança</span> que transforma.
            </span>
          </span>
        </h1>

        <p
          data-hero-meta
          className="mt-8 max-w-md text-center text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base"
        >
          Cultos de domingo, 9h30 e 18h.
          <br />
          R. Santa Catarina, 715 — Maranhão Novo, Imperatriz/MA.
        </p>

        <div data-hero-meta className="mt-10">
          <a
            href="#cultos"
            className="group inline-flex items-center gap-3 rounded-full border border-slate-300 px-7 py-3.5 text-sm font-semibold transition-colors hover:border-brand-500 hover:text-brand-600 dark:border-white/20 dark:hover:border-brand-400 dark:hover:text-brand-400"
          >
            Planeje sua visita
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 transition-transform group-hover:translate-x-1">
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      <div
        data-hero-meta
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-slate-400 dark:text-slate-500"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5 animate-bounce">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </section>
  )
}
