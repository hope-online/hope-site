import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { dividirEmLetras } from '../lib/letras'

type Item =
  | { tipo: 'foto'; src: string; alt: string }
  | { tipo: 'texto'; principal: string; secundario: string }
  | { tipo: 'cta' }

const itens: Item[] = [
  { tipo: 'foto', src: '/fotos/DSC00051.jpg', alt: 'Congregação em adoração' },
  { tipo: 'foto', src: '/fotos/DSC00021.jpg', alt: 'Ministério de dança com bandeiras' },
  { tipo: 'texto', principal: '“ninguém caminha sozinho.”', secundario: 'a mesma mensagem há mais de 30 anos' },
  { tipo: 'foto', src: '/fotos/DSC00095.jpg', alt: 'Louvor e adoração no palco' },
  { tipo: 'foto', src: '/fotos/DSC00071.jpg', alt: 'Família adorando no culto' },
  { tipo: 'foto', src: '/fotos/DSC00001.jpg', alt: 'Momento de acolhimento' },
  { tipo: 'texto', principal: 'sua cadeira', secundario: 'já está guardada pra você' },
  { tipo: 'foto', src: '/fotos/DSC00121.jpg', alt: 'Igreja em momento de louvor' },
  { tipo: 'cta' },
]

export function Galeria() {
  const secao = useRef<HTMLElement>(null)
  const palco = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    if (!secao.current || !palco.current) return

    const ctx = gsap.context(() => {
      // Título (fora do palco): letras aparecem uma a uma no scroll
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

      const paineis = gsap.utils.toArray<HTMLElement>('[data-painel]', palco.current)
      const total = paineis.length
      const durTrans = 1
      const header = document.querySelector('header')

      // Sequência pinada: o palco cobre a tela o tempo todo (preso no pin) e o
      // efeito de cartão é um recorte que abre; cada painel sobe isolando a imagem
      // em fullscreen; no fim o recorte fecha de volta
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: palco.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * (total - 1) + window.innerHeight * 0.6}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      tl.fromTo(
        palco.current,
        { clipPath: 'inset(11% 11% 11% 11% round 56px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 0.15 },
        0,
      )
        .set(palco.current, { zIndex: 70 }, 0.145)

      // A navbar sai de cena enquanto a galeria está em fullscreen
      if (header) {
        tl.to(header, { yPercent: -110, duration: 0.1, ease: 'power1.out' }, 0.05)
      }

      // Cada painel (a partir do segundo) sobe cobrindo o anterior em fullscreen;
      // a imagem que fica para trás dá um zoom de despedida
      for (let i = 1; i < total; i++) {
        const pos = 0.15 + (i - 1) * durTrans
        tl.fromTo(paineis[i], { yPercent: 100 }, { yPercent: 0, duration: durTrans }, pos)
        const imgAnterior = paineis[i - 1].querySelector('img')
        if (imgAnterior) {
          tl.to(imgAnterior, { scale: 1.18, duration: durTrans, ease: 'power1.in' }, pos)
        }
      }

      const fim = 0.15 + (total - 1) * durTrans
      tl.set(palco.current, { zIndex: 10 }, fim + 0.1)
        .to(palco.current, { clipPath: 'inset(11% 11% 11% 11% round 56px)', duration: 0.15 }, fim + 0.1)
      if (header) {
        tl.to(header, { yPercent: 0, duration: 0.12, ease: 'power1.out' }, fim + 0.14)
      }
    }, secao)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={secao} id="galeria" className="scroll-mt-16">
      <div className="mx-auto w-full max-w-7xl px-6 pb-12 pt-24 sm:pt-32">
        <p className="text-[11px] font-semibold uppercase tracking-[0.5em] text-brand-500 dark:text-brand-400">
          Galeria
        </p>
        <h2 data-letras className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-6xl">
          Nossa casa<span className="text-brand-500 dark:text-brand-400">.</span>
        </h2>
      </div>

      <div
        ref={palco}
        className="relative z-10 h-[100svh] overflow-hidden bg-noite"
      >
        {itens.map((item, i) => {
          if (item.tipo === 'foto') {
            return (
              <div key={i} data-painel className="absolute inset-0 will-change-transform">
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover will-change-transform"
                />
              </div>
            )
          }
          if (item.tipo === 'texto') {
            return (
              <div
                key={i}
                data-painel
                className="absolute inset-0 flex flex-col items-center justify-center bg-noite px-6 text-center will-change-transform"
              >
                <p className="font-display text-[11vw] font-bold leading-[0.95] tracking-tight text-white sm:text-[7vw]">
                  {item.principal}
                </p>
                <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.4em] text-brand-400">
                  {item.secundario}
                </p>
              </div>
            )
          }
          return (
            <a
              key={i}
              data-painel
              href="#contato"
              className="group absolute inset-0 flex flex-col items-center justify-center gap-10 bg-brand-500 px-6 text-center text-noite will-change-transform"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.5em]">O próximo capítulo</p>
              <p className="max-w-4xl font-display text-[11vw] font-bold leading-[0.95] tracking-tight sm:text-[7vw]">
                A próxima foto pode ser a sua.
              </p>
              <span className="inline-flex items-center gap-2 rounded-full bg-noite px-7 py-3.5 text-sm font-bold text-brand-400 transition-transform group-hover:-translate-y-0.5">
                Venha no domingo
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                  <path d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </span>
            </a>
          )
        })}
      </div>
    </section>
  )
}
