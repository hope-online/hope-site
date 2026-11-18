export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-slate-200 pt-16 dark:border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 pb-14 sm:flex-row">
        <a href="#inicio" className="font-display text-lg font-bold lowercase leading-none tracking-tight text-slate-900 dark:text-white">
          igreja <span className="text-brand-500 dark:text-brand-400">esperança</span>
        </a>

        <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
          <a href="#" className="transition-colors hover:text-brand-600 dark:hover:text-brand-400">Instagram</a>
          <a href="#" className="transition-colors hover:text-brand-600 dark:hover:text-brand-400">YouTube</a>
          <a href="#" className="transition-colors hover:text-brand-600 dark:hover:text-brand-400">Facebook</a>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500">
          © 2026 Igreja Esperança
        </p>
      </div>

      <div className="select-none px-2" aria-hidden>
        <p className="texto-vazado translate-y-[18%] text-center font-display text-[18vw] font-bold lowercase leading-[0.8] tracking-tight">
          esperança
        </p>
      </div>
    </footer>
  )
}
