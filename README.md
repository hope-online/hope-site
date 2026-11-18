# arca-site

Site institucional da igreja (landing page) com scroll animation 3D. Stack: **Vite + React 19 + TypeScript + TailwindCSS v4 + GSAP ScrollTrigger + Lenis + Three.js (react-three-fiber)**.

## Comandos

```bash
npm install
npm run dev        # desenvolvimento (porta 5173)
npm run build      # produção → dist/
npm run preview    # serve do build
npm run typecheck  # tsc --noEmit
```

## Estrutura

- `src/App.tsx` — composição da página + setup global (Lenis smooth scroll, ScrollTrigger, reveals, contadores, barra de progresso)
- `src/components/three/Cena3D.tsx` — cena 3D do hero com detecção automática pelo `public/panorama/igreja.jpg`: proporção ~2:1 (equiretangular) → esfera 360°; proporção diferente (panorâmica parcial) → cilindro imersivo sem distorção (arraste para olhar ao redor, scroll varre a cena); sem arquivo → cruz 3D com anéis e partículas
- `src/components/` — Navbar (com toggle dark/light), Hero, Sobre, Cultos, Ministérios, Contato, Footer
- `src/hooks/useTema.ts` — tema dark/light (persistido em `localStorage`, chave `tema`)

## Decisões

- **Tema**: verde (`brand-*`, base emerald) como cor da marca; dark e light com toggle fixo na navbar; tema inicial respeita `prefers-color-scheme` e é aplicado antes da primeira pintura (script inline no `index.html`).
- **Scroll**: Lenis (smooth) integrado ao ticker do GSAP; hero é `100svh` com scrub — a cena 3D gira/afunda e a câmera sobe conforme o scroll; seções usam `data-reveal` / `data-reveal-group` (fade + translate via ScrollTrigger) e `data-count` (contadores).
- **Conteúdo**: textos, horários, endereço, telefone e nome "Igreja Esperança" são **placeholders** — trocar antes de publicar.

## Integração futura com o sistema

Placeholder para quando o site passar a puxar dados do back-arca (cultos, cursos/inscrições do módulo de Ensino, eventos): criar `src/lib/api.ts` apontando para a API e substituir os conteúdos estáticos.

## Publicação

Build estático em `dist/` — pode ser servido em qualquer CDN/nginx. Não há Dockerfile ainda; quando precisar, seguir o padrão do `arca-front` (build node → nginx).
