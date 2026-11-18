import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function Preloader() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      const contador = el.querySelector('[data-contador]')
      const obj = { v: 0 }
      const tl = gsap.timeline()
      tl.fromTo(
        '[data-loader-logo]',
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' },
      )
        .to(obj, {
          v: 100,
          duration: 1.3,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (contador) contador.textContent = String(Math.round(obj.v)).padStart(3, '0')
          },
        }, '-=0.3')
        .add(() => {
          window.dispatchEvent(new Event('preloader-fim'))
        })
        .to('[data-loader-painel]', { yPercent: -100, duration: 0.85, ease: 'power4.inOut' }, '+=0.15')
        .to(el, { yPercent: -100, duration: 0.85, ease: 'power4.inOut' }, '-=0.6')
        .set(el, { display: 'none' })
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[200] flex flex-col justify-between bg-noite p-8 text-slate-100"
    >
      <div data-loader-painel className="flex h-full flex-col justify-between">
        <img
          src="./logo.jpg"
          alt="Igreja Esperança"
          data-loader-logo
          className="w-44 mix-blend-lighten sm:w-60"
        />
        <div className="flex items-end justify-between gap-6">
          <p className="max-w-52 text-sm leading-relaxed text-slate-400">
            Preparando um lugar de encontro.
          </p>
          <p className="font-display text-7xl font-bold leading-none tracking-tight sm:text-9xl">
            <span data-contador>000</span>
            <span className="text-brand-400">%</span>
          </p>
        </div>
      </div>
    </div>
  )
}
