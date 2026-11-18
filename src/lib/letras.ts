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
      // Agrupa as letras por palavra: com cada letra em um inline-block, o
      // navegador poderia quebrar a linha no meio da palavra (ex.: "chama /
      // do"). O wrapper nowrap torna a palavra atômica — a quebra só ocorre
      // nos espaços entre palavras.
      for (const parte of texto.split(/(\s+)/)) {
        if (!parte) continue
        if (/^\s+$/.test(parte)) {
          frag.appendChild(document.createTextNode(' '))
          continue
        }
        const palavra = document.createElement('span')
        palavra.style.display = 'inline-block'
        palavra.style.whiteSpace = 'nowrap'
        for (const ch of parte) {
          const span = document.createElement('span')
          span.textContent = ch
          span.dataset.letra = '1'
          span.style.display = 'inline-block'
          palavra.appendChild(span)
          letras.push(span)
        }
        frag.appendChild(palavra)
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
