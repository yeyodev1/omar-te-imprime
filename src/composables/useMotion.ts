import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)
// Evita recálculos (y saltos) cuando la barra del navegador móvil aparece/desaparece.
ScrollTrigger.config({ ignoreMobileResize: true })

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis: Lenis | null = null

export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return lenis
  lenis = new Lenis({ duration: 1.1, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis?.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function scrollToTarget(target: string | HTMLElement) {
  if (lenis) lenis.scrollTo(target, { offset: -10, duration: 1.4 })
  else {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    el?.scrollIntoView({ behavior: 'smooth' })
  }
}

export function lockScroll(locked: boolean) {
  document.body.classList.toggle('is-locked', locked)
  if (!lenis) return
  if (locked) lenis.stop()
  else lenis.start()
}

// Parte un texto en palabras envueltas para revelados tipo máscara.
export function splitWords(el: HTMLElement) {
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = (child.textContent ?? '').split(/(\s+)/)
        const frag = document.createDocumentFragment()
        parts.forEach((part) => {
          if (!part) return
          if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part))
          else {
            const mask = document.createElement('span')
            mask.className = 'w-mask'
            const word = document.createElement('span')
            word.className = 'w'
            word.textContent = part
            mask.appendChild(word)
            frag.appendChild(mask)
          }
        })
        child.replaceWith(frag)
      } else if (child.nodeType === Node.ELEMENT_NODE && !(child as HTMLElement).classList.contains('w-mask')) {
        walk(child)
      }
    })
  }
  walk(el)
  return el.querySelectorAll<HTMLElement>('.w')
}

export { gsap, ScrollTrigger }
