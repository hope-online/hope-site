// Divide o texto de um elemento em spans por letra (preserva espaços,
// quebras de linha e spans aninhados, ex.: o trecho verde dos títulos).
// Idempotente: se o elemento já foi dividido, retorna os spans existentes
// (o StrictMode remonta o efeito e não pode re-dividir).
export function dividirEmLetras(el: HTMLElement): HTMLElement[] {
  if (el.dataset.dividido === '1') {
    return Array.from(el.querySelectorAll<HTMLElement>('span[data-letra]'))
  }

  const letras: HTMLElement[] = []

  const percorrer = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const texto = node.textContent ?? ''
      const frag = document.createDocumentFragment()
      for (const ch of texto) {
        if (ch === ' ') {
          frag.appendChild(document.createTextNode(' '))
          continue
        }
        const span = document.createElement('span')
        span.textContent = ch
        span.dataset.letra = '1'
        span.style.display = 'inline-block'
        frag.appendChild(span)
        letras.push(span)
      }
      node.parentNode?.replaceChild(frag, node)
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(percorrer)
    }
  }

  Array.from(el.childNodes).forEach(percorrer)
  el.dataset.dividido = '1'
  return letras
}
