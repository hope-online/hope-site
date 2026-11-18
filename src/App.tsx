import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useTema } from './hooks/useTema'
import { Preloader } from './components/Preloader'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Sobre } from './components/Sobre'
import { Cultos } from './components/Cultos'
import { Galeria } from './components/Galeria'
import { Ministerios } from './components/Ministerios'
import { Contato } from './components/Contato'
import { Footer } from './components/Footer'

const RUIDO =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")"

export default function App() {
  const { dark, toggle } = useTema()

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    const ctx = gsap.context(() => {
      gsap.to('#progresso-scroll', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.4,
        },
      })
    })

    const aoCarregar = () => ScrollTrigger.refresh()
    window.addEventListener('load', aoCarregar)
    // Recalcula quando as fontes terminarem de carregar (evita posições defasadas)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    return () => {
      ctx.revert()
      gsap.ticker.remove(raf)
      lenis.destroy()
      window.removeEventListener('load', aoCarregar)
    }
  }, [])

  return (
    <div className="relative">
      {/* Grão de filme por cima de tudo */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90] opacity-[0.05] dark:opacity-[0.08]"
        style={{ backgroundImage: RUIDO }}
      />

      <Preloader />
      <div id="progresso-scroll" className="fixed left-0 top-0 z-40 h-0.5 w-full bg-brand-500" />
      <Navbar dark={dark} onToggleTema={toggle} />

      <main>
        <Hero dark={dark} />
        <Sobre />
        <Cultos />
        <Galeria />
        <Ministerios />
        <Contato />
      </main>
      <Footer />
    </div>
  )
}
