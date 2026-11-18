import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import gsap from 'gsap'

const links = [
  { href: '#inicio', label: 'Início' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#cultos', label: 'Cultos' },
  { href: '#galeria', label: 'Galeria' },
  { href: '#ministerios', label: 'Ministérios' },
  { href: '#contato', label: 'Contato' },
]

// Preview exibido ao passar o mouse sobre cada opção do menu
const detalhes: Record<string, { img: string; tags: string[] }> = {
  '#inicio': { img: './fotos/DSC00051.jpg', tags: ['fé', 'adoração', 'comunidade'] },
  '#sobre': { img: './fotos/DSC00001.jpg', tags: ['acolher', 'família', 'pertencimento'] },
  '#cultos': { img: './fotos/DSC00061.jpg', tags: ['louvor', 'palavra', 'comunhão'] },
  '#galeria': { img: './fotos/DSC00021.jpg', tags: ['celebração', 'momentos', 'nossa casa'] },
  '#ministerios': { img: './fotos/DSC00071.jpg', tags: ['servir', 'chamado', 'times'] },
  '#contato': { img: './fotos/DSC00095.jpg', tags: ['domingo', '9h30', 'esperança'] },
}

const posicoesTags = [
  { top: '-12%', left: '-16%' },
  { top: '28%', left: '104%' },
  { top: '90%', left: '-10%' },
]
const rotacoesTags = [-5, 4, -3]

export function Navbar({ dark, onToggleTema }: { dark: boolean; onToggleTema: () => void }) {
  const [aberto, setAberto] = useState(false)
  const [ativo, setAtivo] = useState<string | null>(null)
  const overlay = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(overlay.current, { autoAlpha: 0 })
      gsap.set('[data-menu-link] > span', { yPercent: 115 })
      gsap.set('[data-menu-extra]', { opacity: 0, y: 16 })

      tlRef.current = gsap
        .timeline({ paused: true })
        .to(overlay.current, { autoAlpha: 1, duration: 0.35, ease: 'power2.out' })
        .to('[data-menu-link] > span', { yPercent: 0, duration: 0.8, stagger: 0.07, ease: 'power4.out' }, '-=0.1')
        .to('[data-menu-extra]', { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, '-=0.5')
    })
    return () => ctx.revert()
  }, [])

  const alternar = (proximo?: boolean) => {
    const estado = proximo ?? !aberto
    setAberto(estado)
    document.body.style.overflow = estado ? 'hidden' : ''
    if (estado) tlRef.current?.play()
    else tlRef.current?.reverse()
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') alternar(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto])

  const irPara = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    alternar(false)
    window.setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }, 380)
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-noite/70">
        <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <button
            onClick={() => alternar()}
            aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
            className="group flex cursor-pointer items-center gap-3 text-slate-900 dark:text-white"
          >
            <span className="relative flex h-3 w-6 flex-col justify-between">
              <span
                className={`h-0.5 w-full bg-current transition-transform duration-300 ${
                  aberto ? 'translate-y-[5px] rotate-45' : 'group-hover:scale-x-75'
                }`}
              />
              <span
                className={`h-0.5 w-full bg-current transition-transform duration-300 ${
                  aberto ? '-translate-y-[5.5px] -rotate-45' : 'group-hover:scale-x-50'
                }`}
              />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em]">
              {aberto ? 'Close' : 'Menu'}
            </span>
          </button>

          <a
            href="#inicio"
            onClick={(e) => irPara(e, '#inicio')}
            className="absolute left-1/2 -translate-x-1/2 font-display text-lg font-bold lowercase leading-none tracking-tight text-slate-900 dark:text-white"
          >
            igreja <span className="text-brand-500 dark:text-brand-400">esperança</span>
          </a>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleTema}
              aria-label={dark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
              className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:text-brand-600 dark:border-white/15 dark:text-slate-300 dark:hover:text-brand-400"
            >
              {dark ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </button>
            <a
              href="#cultos"
              onClick={(e) => irPara(e, '#cultos')}
              className="hidden rounded-full bg-brand-500 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-noite transition-colors hover:bg-brand-400 sm:block"
            >
              Visite-nos
            </a>
          </div>
        </nav>
      </header>

      {/* Menu fullscreen */}
      <div
        ref={overlay}
        className="invisible fixed inset-0 z-[80] flex flex-col bg-noite text-white opacity-0"
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-6">
          <button
            onClick={() => alternar(false)}
            className="flex cursor-pointer items-center gap-3 text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-5">
              <path d="m5 5 14 14M19 5 5 19" />
            </svg>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em]">Close</span>
          </button>
          <p className="absolute left-1/2 -translate-x-1/2 font-display text-lg font-bold lowercase leading-none tracking-tight">
            igreja <span className="text-brand-400">esperança</span>
          </p>
          <a
            href="#cultos"
            onClick={(e) => irPara(e, '#cultos')}
            className="hidden rounded-full border border-white/40 px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-colors hover:border-brand-400 hover:text-brand-400 sm:block"
          >
            Visite-nos
          </a>
        </div>

        <nav
          className="relative z-10 flex flex-1 flex-col items-center justify-center gap-1 overflow-visible px-6"
          onMouseLeave={() => setAtivo(null)}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => irPara(e, l.href)}
              onMouseEnter={() => setAtivo(l.href)}
              data-menu-link
              className="relative block py-1"
            >
              {/* Preview flutuante: fica atrás das letras do item com hover */}
              {ativo === l.href && detalhes[l.href] && (
                <div
                  key={l.href}
                  className="pointer-events-none absolute left-1/2 top-1/2 z-0 -mt-20 hidden w-64 animate-aparecer sm:block md:-mt-24 md:w-80"
                >
                  <img
                    src={detalhes[l.href].img}
                    alt=""
                    className="h-40 w-full rounded-xl object-cover shadow-2xl shadow-black/60 ring-1 ring-white/25 md:h-48"
                  />
                  {detalhes[l.href].tags.map((t, i) => (
                    <span
                      key={t}
                      className="absolute animate-tag whitespace-nowrap border border-white/30 bg-noite/90 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-white backdrop-blur"
                      style={{
                        ...posicoesTags[i],
                        transform: `rotate(${rotacoesTags[i]}deg)`,
                        animationDelay: `${0.15 + i * 0.09}s`,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <span className="relative z-10 block overflow-hidden">
                <span className="block font-display text-[11vw] font-bold uppercase leading-[0.95] tracking-tight transition-all duration-300 hover:translate-x-3 hover:text-brand-400 sm:text-7xl lg:text-8xl">
                  {l.label}
                </span>
              </span>
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 flex-col gap-4 border-t border-white/10 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div data-menu-extra className="flex gap-6 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">
            <a href="#" className="transition-colors hover:text-brand-400">Instagram</a>
            <a href="#" className="transition-colors hover:text-brand-400">YouTube</a>
            <a href="#" className="transition-colors hover:text-brand-400">Facebook</a>
          </div>
          <p data-menu-extra className="text-xs text-slate-500">
            © 2026 Igreja Esperança — Imperatriz/MA
          </p>
        </div>
      </div>
    </>
  )
}
