import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { dividirEmLetras } from '../lib/letras'

export function Contato() {
  const secao = useRef<HTMLElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    if (!secao.current) return

    const ctx = gsap.context(() => {
      // Título gigante: letras aparecem uma a uma no scroll (e somem voltando)
      gsap.utils.toArray<HTMLElement>('[data-letras]', secao.current).forEach((h) => {
        const letras = dividirEmLetras(h)
        gsap.fromTo(
          letras,
          { opacity: 0.08, y: 24 },
          {
            opacity: 1,
            y: 0,
            ease: 'none',
            stagger: 0.06,
            scrollTrigger: { trigger: h, start: 'top 90%', end: 'top 25%', scrub: 0.6 },
          },
        )
      })

      gsap.fromTo(
        '[data-contato-meta]',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-contato-meta-wrap]', start: 'top 88%' },
        },
      )
    }, secao)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={secao}
      id="contato"
      className="scroll-mt-16 border-t border-slate-200 py-24 dark:border-white/10 sm:py-36"
    >
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.5em] text-brand-500 dark:text-brand-400">
          Contato
        </p>

        <h2 data-letras className="mt-8 font-display font-bold uppercase leading-[0.92] tracking-tight text-[11vw] sm:text-[8vw]">
          Nos vemos
          <br />
          no <span className="text-brand-500 dark:text-brand-400">domingo.</span>
        </h2>

        <div data-contato-meta-wrap className="mt-16 grid gap-10 sm:grid-cols-3">
          <div data-contato-meta>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Endereço
            </p>
            <p className="mt-3 text-base leading-relaxed">
              R. Santa Catarina, 715 — Maranhão Novo
              <br />
              Imperatriz/MA · 65903-090
            </p>
          </div>
          <div data-contato-meta>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Horários
            </p>
            <p className="mt-3 text-base leading-relaxed">
              Domingo 9h30 e 18h
              <br />
              Quarta 19h30 · Sexta 20h
            </p>
          </div>
          <div data-contato-meta>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Fale conosco
            </p>
            <a
              href="https://wa.me/5585999990000"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-noite transition-all hover:-translate-y-0.5 hover:bg-brand-400"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
