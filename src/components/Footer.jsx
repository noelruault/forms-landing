'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import logo from '@/images/logo.webp'
import { APP_URL } from '@/lib/site'

const WORDMARK = ['Educación', 'a Bordo']

const navLinks = [
  { href: '#features', label: 'Características' },
  { href: '#testimonials', label: 'Opiniones' },
  { href: '#pricing', label: 'Precio' },
  { href: APP_URL, label: 'Accede' },
]

// Interactive dot-matrix wordmark: the brand is rasterised into a grid of dots that scatter away from the pointer and ease back, echoing op.al's footer.
function DotMatrix() {
  let canvasRef = useRef(null)

  useEffect(() => {
    let canvas = canvasRef.current
    if (!canvas) return
    let ctx = canvas.getContext('2d')
    let reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let dots = []
    let pointer = { x: -9999, y: -9999 }
    let raf = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    let GAP = 9 // px between dots (CSS space)
    let RADIUS = 90 // pointer influence radius
    let DOT = 1.7 // dot radius

    function build() {
      let rect = canvas.getBoundingClientRect()
      let w = Math.max(1, Math.floor(rect.width))
      let h = Math.max(1, Math.floor(rect.height))
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Rasterise the wordmark into an offscreen buffer at CSS resolution.
      let off = document.createElement('canvas')
      off.width = w
      off.height = h
      let octx = off.getContext('2d')
      let lines = Array.isArray(WORDMARK) ? WORDMARK : [WORDMARK]
      let fontSize = (h / lines.length) * 0.82
      octx.fillStyle = '#fff'
      octx.textAlign = 'center'
      octx.textBaseline = 'middle'
      // Shrink until the widest line fits the available width.
      do {
        octx.font = `700 ${fontSize}px "Lexend", system-ui, sans-serif`
        let widest = Math.max(...lines.map((l) => octx.measureText(l).width))
        if (widest <= w * 0.98) break
        fontSize -= 4
      } while (fontSize > 8)
      let lineH = fontSize * 1.02
      let startY = h / 2 - (lineH * (lines.length - 1)) / 2
      lines.forEach((line, i) => octx.fillText(line, w / 2, startY + i * lineH))

      let data = octx.getImageData(0, 0, w, h).data
      dots = []
      for (let y = 0; y < h; y += GAP) {
        for (let x = 0; x < w; x += GAP) {
          if (data[(y * w + x) * 4 + 3] > 128) {
            dots.push({ x, y, bx: x, by: y })
          }
        }
      }
    }

    function draw() {
      let rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)
      for (let d of dots) {
        let dx = d.bx - pointer.x
        let dy = d.by - pointer.y
        let dist = Math.hypot(dx, dy)
        let active = dist < RADIUS
        if (!reduced && active) {
          let force = (1 - dist / RADIUS) * 26
          let ang = Math.atan2(dy, dx)
          let tx = d.bx + Math.cos(ang) * force
          let ty = d.by + Math.sin(ang) * force
          d.x += (tx - d.x) * 0.2
          d.y += (ty - d.y) * 0.2
        } else {
          d.x += (d.bx - d.x) * 0.12
          d.y += (d.by - d.y) * 0.12
        }
        ctx.fillStyle = active ? 'rgba(96,165,250,0.9)' : 'rgba(255,255,255,0.22)'
        ctx.beginPath()
        ctx.arc(d.x, d.y, DOT, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    function onMove(e) {
      let rect = canvas.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
    }
    function onLeave() {
      pointer.x = -9999
      pointer.y = -9999
    }

    function drawStatic() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let d of dots) {
        ctx.fillStyle = 'rgba(255,255,255,0.22)'
        ctx.beginPath()
        ctx.arc(d.x, d.y, DOT, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    let started = false
    let ro = new ResizeObserver(() => {
      if (started) build()
    })

    function start() {
      started = true
      build()
      ro.observe(canvas)
      if (reduced) {
        drawStatic()
        return
      }
      window.addEventListener('pointermove', onMove)
      canvas.addEventListener('pointerleave', onLeave)
      raf = requestAnimationFrame(draw)
    }

    // The footer is far below the fold: nothing is rasterised or animated until it scrolls near, and the loop pauses when it leaves.
    let io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!started) start()
          else if (!reduced && !raf) raf = requestAnimationFrame(draw)
        } else if (raf) {
          cancelAnimationFrame(raf)
          raf = 0
        }
      },
      { rootMargin: '200px' },
    )
    io.observe(canvas)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-label={WORDMARK.join(' ')}
      role="img"
      className="block h-[52vw] max-h-[36rem] min-h-64 w-full cursor-crosshair"
    />
  )
}

export function Footer() {
  return (
    <footer className="relative z-20 bg-black px-5 py-12 text-white sm:px-8 lg:px-12">
      <div className="py-16 lg:py-8">
        <DotMatrix />
      </div>
      <div className="flex flex-col items-start gap-10 border-t border-white/10 py-20 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="flex items-center gap-5 sm:gap-7">
          <Link href="#" aria-label="Educación a Bordo" className="flex-none">
            <Image src={logo} alt="" unoptimized className="h-16 w-auto sm:h-20" />
          </Link>
          <div className="flex flex-col gap-1">
            <Link href="#" className="font-display text-2xl font-medium tracking-tight text-white">
              Educación a Bordo
            </Link>
            <span className="text-base tracking-wide text-white/60">
              &copy; {new Date().getFullYear()} Educación a Bordo. Todos los derechos reservados.
            </span>
          </div>
        </div>
        <nav
          aria-label="Enlaces del pie"
          className="flex flex-wrap items-center gap-x-10 gap-y-4 text-base tracking-wide text-white/70"
        >
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
