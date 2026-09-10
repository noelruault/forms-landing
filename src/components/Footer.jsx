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

// One full crossing of the light band, edge to edge, including the dark gap before it re-enters.
const SWEEP_MS = 6500
// Dot brightness from resting (0.3) to fully lit (0.85), quantised so the loop never builds colour strings per dot.
const SHADES = Array.from({ length: 17 }, (_, i) => `rgba(255,255,255,${(0.3 + (0.55 * i) / 16).toFixed(3)})`)

// Interactive dot-matrix wordmark after op.al's footer: the brand is rasterised into dots; a soft band of light sweeps across them on a loop (phones have no pointer to hover with), and a pointer scatters them.
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

    let RADIUS = 90 // pointer influence radius
    // Pitch and dot radius are set per build from the canvas width: a fixed 9 px grid leaves a nine-letter word with four dots of height on a phone.
    let GAP = 9
    let DOT = 2.4

    // Returns the horizontal extent of the ink in an RGBA buffer, sampled coarsely.
    function inkBounds(data, w, h) {
      let minX = w
      let maxX = -1
      for (let x = 0; x < w; x += 2) {
        for (let y = 0; y < h; y += 4) {
          if (data[(y * w + x) * 4 + 3] > 128) {
            if (x < minX) minX = x
            if (x > maxX) maxX = x
            break
          }
        }
      }
      return { minX, maxX }
    }

    function build() {
      let rect = canvas.getBoundingClientRect()
      let w = Math.max(1, Math.floor(rect.width))
      let h = Math.max(1, Math.floor(rect.height))
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // ~4.4 px on a 350 px phone, 9 px from tablets up; dot radius at op.al's ratio to the pitch.
      GAP = Math.max(4, Math.min(9, w / 80))
      DOT = GAP * 0.27

      // Rasterise the wordmark into an offscreen buffer at CSS resolution.
      let off = document.createElement('canvas')
      off.width = w
      off.height = h
      let octx = off.getContext('2d')
      let lines = Array.isArray(WORDMARK) ? WORDMARK : [WORDMARK]
      let fontSize = (h / lines.length) * 0.94
      octx.fillStyle = '#fff'
      octx.textAlign = 'center'
      octx.textBaseline = 'middle'
      let data
      // Fit by measurement first, then confirm on the rendered pixels: measureText has misreported on some mobile browsers, and the ink cannot.
      for (let attempt = 0; attempt < 10; attempt++) {
        do {
          octx.font = `700 ${fontSize}px "Lexend", system-ui, sans-serif`
          let widest = Math.max(...lines.map((l) => octx.measureText(l).width))
          if (widest <= w * 0.98) break
          fontSize -= 4
        } while (fontSize > 8)
        let lineH = fontSize * 1.02
        let startY = h / 2 - (lineH * (lines.length - 1)) / 2
        octx.clearRect(0, 0, w, h)
        lines.forEach((line, i) => octx.fillText(line, w / 2, startY + i * lineH))
        data = octx.getImageData(0, 0, w, h).data
        let { minX, maxX } = inkBounds(data, w, h)
        if (minX >= w * 0.01 && maxX <= w * 0.99) break
        fontSize *= 0.9
      }

      dots = []
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          if (data[(Math.floor(y) * w + Math.floor(x)) * 4 + 3] > 128) {
            dots.push({ x, y, bx: x, by: y })
          }
        }
      }
    }

    function draw(now) {
      let rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)
      // The band runs from beyond the left edge to beyond the right one, tilted so it reads as light rather than a scanline.
      let phase = (now % SWEEP_MS) / SWEEP_MS
      let bandX = -0.25 * rect.width + phase * 1.5 * rect.width
      let half = 0.22 * rect.width
      let tilt = 0.35
      let midY = rect.height / 2
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
        let offset = Math.abs(d.bx + (d.by - midY) * tilt - bandX)
        let glow = offset < half ? (1 - offset / half) ** 2 : 0
        ctx.fillStyle = active ? 'rgba(96,165,250,0.9)' : SHADES[Math.round(glow * 16)]
        ctx.beginPath()
        ctx.arc(d.x, d.y, DOT, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    function drawStatic() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let d of dots) {
        ctx.fillStyle = SHADES[0]
        ctx.beginPath()
        ctx.arc(d.x, d.y, DOT, 0, Math.PI * 2)
        ctx.fill()
      }
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

    let started = false
    function rebuild() {
      if (!started) return
      build()
      if (reduced) drawStatic()
    }
    let ro = new ResizeObserver(rebuild)

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
    // If the web font lands after the first raster, redo it with the real glyphs.
    document.fonts.addEventListener('loadingdone', rebuild)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.fonts.removeEventListener('loadingdone', rebuild)
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
      {/* Below lg everything stacks and centres; from lg the brand sits left and the links right. */}
      <div className="flex flex-col items-center gap-10 border-t border-white/10 py-16 text-center lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:py-20 lg:text-left">
        <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-7">
          <Link href="#" aria-label="Educación a Bordo" className="flex-none">
            <Image src={logo} alt="" unoptimized className="h-16 w-auto sm:h-20" />
          </Link>
          <div className="flex flex-col items-center gap-1 lg:items-start">
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
          className="flex flex-col items-center gap-2.5 text-base tracking-wide text-white/70 lg:flex-row lg:flex-wrap lg:gap-x-10 lg:gap-y-4"
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
