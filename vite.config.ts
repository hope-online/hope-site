import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Caminhos relativos no build: o site funciona em qualquer subcaminho
  // (GitHub Pages de projeto: usuario.github.io/nome-do-repo/)
  base: './',
  plugins: [react(), tailwindcss()],
})
