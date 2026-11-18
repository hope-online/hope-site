import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { dividirEmLetras } from '../lib/letras'

const cultos = [
  { dia: 'Domingo', hora: '9h30', nome: 'Culto da Família', tag: 'Todos' },
  { dia: 'Domingo', hora: '18h00', nome: 'Culto da Noite', tag: 'Todos' },
  { dia: 'Quarta', hora: '19h30', nome: 'Culto de Oração', tag: 'Intercessão' },
  { dia: 'Sexta', hora: '20h00', nome: 'Encontro de Jovens', tag: 'Jovens' },
]

export function Cultos() {
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

      // Linhas: borda desenha e conteúdo sobe amarrados ao scroll —
      // aparece descendo, some subindo
      gsap.utils.toArray<HTMLElement>('[data-culto]', secao.current).forEach((linha) => {
        const borda = linha.querySelector('[data-culto-borda]')
        const conteudo = linha.querySelector('[data-culto-conteudo]')
        if (borda) {
          gsap.fromTo(
            borda,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: 'none',
              scrollTrigger: { trigger: linha, start: 'top 92%', end: 'top 55%', scrub: 0.5 },
            },
          )
        }
        if (conteudo) {
          gsap.fromTo(
            conteudo,
            { y: 48, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              ease: 'none',
              scrollTrigger: { trigger: linha, start: 'top 95%', end: 'top 55%', scrub: 0.5 },
            },
          )
        }
      })
    }, secao)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={secao}
      id="cultos"
      className="scroll-mt-16 border-t border-slate-200 py-24 dark:border-white/10 sm:py-36"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.5em] text-brand-500 dark:text-brand-400">
              Agenda
            </p>
            <h2 data-letras className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-6xl">
              Cultos & encontros
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Todos abertos ao público. Chegue alguns minutos antes — a recepção cuida de
            você e das crianças.
          </p>
        </div>

        <div className="mt-16">
          {cultos.map((c) => (
            <div key={c.nome} data-culto className="group relative">
              <span
                data-culto-borda
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-slate-200 dark:bg-white/15"
              />
              <div
                data-culto-conteudo
                className="grid grid-cols-[auto_1fr_auto] items-center gap-x-6 gap-y-2 py-8 transition-[padding] duration-500 group-hover:pl-4 sm:grid-cols-[140px_120px_1fr_auto] sm:gap-x-10"
              >
                <span className="font-display text-2xl font-bold sm:text-3xl">{c.hora}</span>
                <span className="text-sm font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  {c.dia}
                </span>
                <span className="col-span-2 text-lg font-medium sm:col-span-1 sm:text-2xl">
                  {c.nome}
                </span>
                <span className="hidden items-center gap-3 sm:flex">
                  <span className="rounded-full border border-slate-300 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-white/15 dark:text-slate-400">
                    {c.tag}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5 -translate-x-2 text-brand-500 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  >
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
          <span className="block h-px w-full bg-slate-200 dark:bg-white/15" />
        </div>
      </div>
    </section>
  )
}
