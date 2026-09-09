'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Button } from '@/components/Button'
import { Logo } from '@/components/Logo'
import backgroundImage from '@/images/background-call-to-action.webp'
import { APP_URL, DEMO_URL } from '@/lib/site'

const VIDEO_SRC = '/media/tour.mp4'
const VIDEO_POSTER = '/media/tour-poster.webp'

const text = {
  eyebrow: 'Tu titulación náutica, a tu ritmo',
  headline: 'Domina tu estudio con métodos ',
  headlineHighlighted: 'inteligentes',
  subHeadline:
    'Elige tus temas, practica con simulacros cronometrados y deja que el algoritmo se adapte a tu ritmo. Sencillo, medible, tuyo.',
  primaryButton: 'Prueba la aplicación',
  scroll: 'Descubre más',
}

const navLinks = [
  { href: '#features', label: 'Características' },
  { href: '#testimonials', label: 'Opiniones' },
  { href: '#pricing', label: 'Precio' },
]

function OverlayNav() {
  let [open, setOpen] = useState(false)

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10 lg:py-6">
        <div className="hidden flex-1 items-center gap-x-8 text-sm font-medium tracking-wide text-white/80 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          aria-label="Abrir menú"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center text-white md:hidden"
        >
          <svg viewBox="0 0 20 14" fill="none" className="h-4 w-5" aria-hidden="true">
            <path d="M0 1h20M0 7h20M0 13h20" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>

        <Link
          href="#"
          aria-label="Educación a Bordo"
          className="flex flex-none items-center justify-center text-white [&_span]:text-white"
        >
          <Logo
            variant="nav"
            className="flex items-center gap-2.5 [&_img]:h-10 [&_span]:text-base [&_span]:font-medium sm:[&_img]:h-12 sm:[&_span]:text-lg"
          />
        </Link>

        <div className="flex flex-1 items-center justify-end gap-x-6">
          <Link
            href={APP_URL}
            className="hidden text-sm font-medium tracking-wide text-white/80 transition hover:text-white lg:block"
          >
            Accede
          </Link>
          <Button href="#pricing" color="white">
            Únete<span className="hidden lg:inline">&nbsp;ahora</span>
          </Button>
        </div>
      </nav>

      <div
        className={clsx(
          'origin-top border-t border-white/10 bg-slate-950/70 backdrop-blur-md transition md:hidden',
          open ? 'block' : 'hidden',
        )}
      >
        <div className="flex flex-col gap-y-1 px-6 py-4 text-base text-white/90">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2 transition hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={APP_URL}
            onClick={() => setOpen(false)}
            className="rounded-lg px-2 py-2 transition hover:bg-white/10"
          >
            Accede
          </Link>
        </div>
      </div>
    </header>
  )
}

function HeroVideo() {
  let videoRef = useRef(null)
  let [playing, setPlaying] = useState(true)
  let [muted, setMuted] = useState(true)

  useEffect(() => {
    let video = videoRef.current
    if (!video) return
    // No autoplay for reduced motion, Save-Data, or slow connections: the poster stands in and the play button still works.
    let connection = navigator.connection
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      connection?.saveData ||
      ['slow-2g', '2g', '3g'].includes(connection?.effectiveType)
    ) {
      setPlaying(false)
      return
    }
    // The poster carries the first paint. The 3.4 MB source starts 1.5 s after load, once CSS, fonts and hydration have settled, so it never competes with them.
    function start() {
      video.src = VIDEO_SRC
      video.play().catch(() => setPlaying(false))
    }
    let timer = 0
    function whenSettled() {
      timer = window.setTimeout(start, 1500)
    }
    if (document.readyState === 'complete') whenSettled()
    else window.addEventListener('load', whenSettled, { once: true })
    return () => {
      window.removeEventListener('load', whenSettled)
      clearTimeout(timer)
    }
  }, [])

  function togglePlay() {
    let video = videoRef.current
    if (!video) return
    if (video.paused) {
      if (!video.src) video.src = VIDEO_SRC
      video.play()
      setPlaying(true)
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  function toggleMute() {
    let video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }

  return (
    <div className="relative aspect-[9/16] h-[50svh] min-h-[22rem] overflow-hidden rounded-3xl bg-black shadow-2xl ring-1 ring-white/20 lg:h-[64vh] lg:max-h-[42rem]">
      {/* React hoists this to <head>: the poster is the LCP image, so it is fetched first. */}
      <link rel="preload" as="image" href={VIDEO_POSTER} fetchPriority="high" />
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        poster={VIDEO_POSTER}
        muted
        loop
        playsInline
        preload="none"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
        <span className="font-display text-base font-medium text-white drop-shadow">A bordo</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? 'Pausar vídeo' : 'Reproducir vídeo'}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
          >
            {playing ? (
              <svg viewBox="0 0 12 14" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                <rect x="0" width="4" height="14" rx="1" />
                <rect x="8" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 12 14" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                <path d="M0 1.3v11.4a1 1 0 0 0 1.5.87l9.5-5.7a1 1 0 0 0 0-1.74L1.5.43A1 1 0 0 0 0 1.3Z" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? 'Activar sonido' : 'Silenciar'}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
          >
            {muted ? (
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                <path d="M11 5 6 9H3v6h3l5 4V5Z" />
                <path d="m16 9 5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                <path d="M11 5 6 9H3v6h3l5 4V5Z" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8 8 0 0 1 0 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[linear-gradient(150deg,#1e3a8a_0%,#2563eb_42%,#7c3aed_100%)] text-white">
      {/* Mesh photo adds texture; the diagonal gradient carries the brand's blue-to-purple identity. */}
      <Image
        src={backgroundImage}
        alt=""
        fill
        priority
        unoptimized
        sizes="100vw"
        className="-z-10 object-cover opacity-40 mix-blend-soft-light"
      />
      {/* Darken toward the edges so light overlay text stays legible. */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_50%_0%,transparent_30%,rgba(15,23,42,0.5)_100%)]" />

      <OverlayNav />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-6 pb-16 pt-28 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:px-10 lg:pt-32">
        {/* Video first on mobile so brand, logo and video share the first glance; right column on desktop. */}
        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <HeroVideo />
        </div>

        <div className="order-2 text-center lg:order-1 lg:text-left">
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.22em] text-white/70">
            {text.eyebrow}
          </p>
          <h1 className="font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            {text.headline}
            <span className="text-blue-200">{text.headlineHighlighted}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/85 lg:mx-0">
            {text.subHeadline}
          </p>
          <div className="mt-9 flex justify-center lg:justify-start">
            <Button href={DEMO_URL} color="white" className="px-6 py-2.5 text-base">
              {text.primaryButton}
            </Button>
          </div>
        </div>
      </div>

      <Link
        href="#features"
        className="relative z-10 mb-8 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60 transition hover:text-white"
      >
        {text.scroll}
        <svg viewBox="0 0 16 24" fill="none" className="h-6 w-4 animate-bounce" aria-hidden="true">
          <path d="M8 1v22M1 16l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </section>
  )
}
