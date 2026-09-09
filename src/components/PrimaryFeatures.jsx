'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import screenshotApp from '@/images/app/dashboard.webp'

const text = {
  eyebrow: 'La aplicación',
  title: 'Mira la plataforma por dentro.',
  description:
    'Una sola herramienta para estudiar, medir y repasar. Cada función se adapta a lo que necesitas en cada momento.',
}

// One real product screenshot, framed differently per tab so each feature highlights the region of the UI it describes. No mock data is invented.
const features = [
  {
    title: 'Seguimiento de progreso',
    description: 'Controla tus avances y asegúrate de que estás aprendiendo.',
    position: 'left top',
  },
  {
    title: 'Personalización',
    description:
      'La plataforma se adapta a tus necesidades, para que estudies como más te convenga.',
    position: '38% center',
  },
  {
    title: 'Algoritmo adaptativo',
    description:
      'El algoritmo se ajusta a tu ritmo de aprendizaje para que tu estudio sea más eficiente.',
    position: '70% center',
  },
  {
    title: 'Evaluaciones y repaso',
    description:
      'Tu historial de exámenes resueltos siempre a mano, para medir el progreso y repasar.',
    position: 'right center',
  },
]

const AUTO_ADVANCE_MS = 5000

export function PrimaryFeatures() {
  let [active, setActive] = useState(0)
  let [playing, setPlaying] = useState(true)
  let [inView, setInView] = useState(false)
  let sectionRef = useRef(null)
  let reducedMotion = useRef(false)
  // The carousel only advances (and its progress bar only fills) while on screen.
  let running = playing && inView

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reducedMotion.current) setPlaying(false)
  }, [])

  useEffect(() => {
    let io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    )
    if (sectionRef.current) io.observe(sectionRef.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!running) return
    let id = setInterval(
      () => setActive((i) => (i + 1) % features.length),
      AUTO_ADVANCE_MS,
    )
    return () => clearInterval(id)
  }, [running])

  function select(index) {
    setActive(index)
    setPlaying(false)
  }

  return (
    <section
      ref={sectionRef}
      id="features"
      aria-label="Características de la plataforma"
      className="bg-slate-950 py-24 sm:py-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-blue-400">
            {text.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
            {text.title}
          </h2>
          <p className="mt-4 text-lg text-slate-400">{text.description}</p>
        </div>

        <div className="mt-14 overflow-hidden rounded-2xl border border-white/10 bg-[#1a181c] p-2 shadow-2xl sm:p-3">
          <div className="flex flex-col gap-2 lg:h-[30rem] lg:flex-row">
            {features.map((feature, index) => {
              let isActive = index === active
              return (
                <button
                  key={feature.title}
                  type="button"
                  onClick={() => select(index)}
                  aria-expanded={isActive}
                  style={{ flexGrow: isActive ? 5 : 1 }}
                  className={clsx(
                    'group relative flex min-w-0 basis-auto flex-col overflow-hidden rounded-xl text-left outline-none transition-[flex-grow] duration-500 ease-out focus-visible:ring-2 focus-visible:ring-blue-500 lg:basis-0',
                    isActive ? 'bg-white/[0.04]' : 'bg-transparent hover:bg-white/[0.02]',
                  )}
                >
                  <div className="flex flex-none items-center gap-3 px-4 pt-4 pb-3">
                    <span
                      className={clsx(
                        'font-display text-sm tabular-nums transition-colors',
                        isActive ? 'text-blue-400' : 'text-slate-400',
                      )}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={clsx(
                        'truncate text-sm font-medium transition-colors',
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200',
                      )}
                    >
                      {feature.title}
                    </span>
                  </div>
                  <span
                    className={clsx(
                      'mx-4 h-px flex-none origin-left bg-blue-500 transition-transform duration-500',
                      isActive ? 'scale-x-100' : 'scale-x-0',
                    )}
                  />

                  <div
                    className={clsx(
                      'relative mt-3 overflow-hidden rounded-lg lg:block lg:h-auto lg:min-h-40 lg:flex-1',
                      isActive ? 'block h-56' : 'hidden',
                    )}
                  >
                    <Image
                      src={screenshotApp}
                      alt={`Educación a Bordo: ${feature.title}`}
                      fill
                      unoptimized
                      sizes="(min-width: 768px) 60vw, 100vw"
                      style={{ objectPosition: feature.position }}
                      className={clsx(
                        'object-cover transition-opacity duration-500',
                        isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-60',
                      )}
                    />
                    <div
                      className={clsx(
                        'absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1a181c] via-[#1a181c]/70 to-transparent p-4 transition-opacity duration-300',
                        isActive ? 'opacity-100' : 'opacity-0',
                      )}
                    >
                      <p className="max-w-md text-sm leading-relaxed text-slate-200">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between px-3 pb-1 pt-3">
            <div className="flex items-center gap-1.5">
              {features.map((feature, index) => (
                <span
                  key={feature.title}
                  className={clsx(
                    'h-1 overflow-hidden rounded-full bg-white/20 transition-all duration-500',
                    index === active ? 'w-10' : 'w-2',
                  )}
                >
                  {index === active && (
                    <span
                      // Remount on every tab change or play/pause so the fill restarts in step with the interval.
                      key={`${active}-${running}`}
                      style={running ? { animationDuration: `${AUTO_ADVANCE_MS}ms` } : undefined}
                      className={clsx(
                        'block h-full rounded-full bg-blue-500',
                        running ? 'animate-progress' : 'w-full',
                      )}
                    />
                  )}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPlaying((v) => !v)}
              aria-label={playing ? 'Pausar' : 'Reproducir'}
              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-white/10 hover:text-white"
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
          </div>
        </div>
      </Container>
    </section>
  )
}
