import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { dividirEmLetras } from '../lib/letras'

const ministerios = [
  { nome: 'Kids', descricao: 'Espaço seguro e divertido para as crianças' },
  { nome: 'Jovens', descricao: 'Sexta-feira, 20h — louvor, amigos e palavra' },
  { nome: 'Louvor & Adoração', descricao: 'O time que conduz a igreja na presença de Deus' },
  { nome: 'Ensino', descricao: 'Cursos e turmas para crescer firme na Palavra' },
  { nome: 'Ação Social', descricao: 'Projetos que servem a cidade toda' },
  { nome: 'Intercessão', descricao: 'Quem sustenta tudo em oração' },
]

export function Ministerios() {
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
      gsap.utils.toArray<HTMLElement>('[data-min]', secao.current).forEach((linha) => {
        const borda = linha.querySelector('[data-min-borda]')
        const conteudo = linha.querySelector('[data-min-conteudo]')
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
            { y: 36, opacity: 0 },
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
      id="ministerios"
      className="scroll-mt-16 border-t border-slate-200 py-24 dark:border-white/10 sm:py-36"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div data-min className="group relative">
          <span
            data-min-borda
            className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-slate-200 dark:bg-white/15"
          />
          <div data-min-conteudo className="py-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.5em] text-brand-500 dark:text-brand-400">
              Ministérios
            </p>
            <h2 data-letras className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-6xl">
              Um lugar para o seu chamado
            </h2>
          </div>
        </div>

        <div className="mt-6">
          {ministerios.map((m, i) => (
            <div key={m.nome} data-min className="group relative">
              <span
                data-min-borda
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-slate-200 dark:bg-white/15"
              />
              <div
                data-min-conteudo
                className="grid grid-cols-[auto_1fr] items-baseline gap-x-8 py-7 transition-[padding] duration-500 group-hover:pl-5 sm:grid-cols-[80px_1fr_auto] sm:gap-x-12"
              >
                <span className="font-display text-sm font-semibold text-brand-500 dark:text-brand-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-2xl font-bold tracking-tight transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-400 sm:text-4xl">
                  {m.nome}
                </h3>
                <p className="col-span-2 mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400 sm:col-span-1 sm:mt-0 sm:text-right">
                  {m.descricao}
                </p>
              </div>
            </div>
          ))}
          <span className="block h-px w-full bg-slate-200 dark:bg-white/15" />
        </div>
      </div>
    </section>
  )
}
