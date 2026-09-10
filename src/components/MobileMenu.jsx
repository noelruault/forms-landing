'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import clsx from 'clsx'

// Matches the sheet on zed.dev: 450 ms with this curve for both the sheet and the scrim.
const DURATION_MS = 450
const EASE = 'ease-[cubic-bezier(0.32,0.72,0,1)]'

// The page shell (see layout.jsx and tailwind.css) reads these to scale itself back behind the sheet and to follow a swipe.
function setShellState({ open, dragging, progress }) {
  let html = document.documentElement
  if (open !== undefined) html.toggleAttribute('data-menu-open', open)
  if (dragging !== undefined) html.toggleAttribute('data-menu-dragging', dragging)
  if (progress === null) html.style.removeProperty('--menu-progress')
  else if (progress !== undefined) html.style.setProperty('--menu-progress', String(progress))
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

function PlusMinus({ open }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="M12 5v14" className={clsx('origin-center transition-transform duration-200', open && 'scale-y-0')} />
    </svg>
  )
}

const rowClass =
  'flex h-8 w-full items-center justify-between rounded-sm px-2 text-sm tracking-tight text-slate-900 transition-colors hover:bg-slate-100 focus-visible:bg-slate-100 focus-visible:outline-none'

function Group({ item, onNavigate }) {
  let [open, setOpen] = useState(false)
  let id = `menu-group-${item.label.toLowerCase().replace(/\s+/g, '-')}`
  return (
    <li>
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)} className={rowClass}>
        {item.label}
        <PlusMinus open={open} />
      </button>
      {/* grid-rows from 0fr to 1fr animates height without measuring it. */}
      <div id={id} className={clsx('grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
        <ul className="min-h-0 overflow-hidden">
          {item.children.map((child) => (
            <li key={child.href} className="ml-2 border-l border-slate-200 pl-2">
              <Link href={child.href} onClick={onNavigate} className={clsx(rowClass, 'text-[13px] text-slate-700')}>
                {child.label}
                <ChevronRight />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}

// Bottom sheet after zed.dev's mobile menu: slides up over a dimmed page that scales back behind it; Escape, the scrim, the close row or a downward swipe dismiss it.
export function MobileMenu({ open, onClose, items, returnFocusTo }) {
  let [mounted, setMounted] = useState(false)
  let [shown, setShown] = useState(false)
  let sheetRef = useRef(null)
  let scrimRef = useRef(null)
  let drag = useRef(null)

  // Opening mounts the sheet off-screen; closing lets the transition finish before unmounting and releases the page shell at once so both animate together.
  useEffect(() => {
    if (open) {
      setMounted(true)
      return
    }
    setShown(false)
    setShellState({ open: false, dragging: false, progress: null })
    let id = setTimeout(() => setMounted(false), DURATION_MS)
    return () => clearTimeout(id)
  }, [open])

  // Runs only once the off-screen node is committed: forcing layout here makes the browser record that position, so the flip to rest is a real transition rather than an instant appearance.
  useEffect(() => {
    if (!mounted || !open) return
    sheetRef.current?.getBoundingClientRect()
    let id = requestAnimationFrame(() => {
      setShown(true)
      setShellState({ open: true, progress: 0 })
    })
    return () => cancelAnimationFrame(id)
  }, [mounted, open])

  useEffect(() => {
    if (!mounted) return
    let toggle = returnFocusTo?.current
    let previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    sheetRef.current?.focus({ preventScroll: true })
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKey)
      setShellState({ open: false, dragging: false, progress: null })
      toggle?.focus({ preventScroll: true })
    }
  }, [mounted, onClose, returnFocusTo])

  function onPointerDown(event) {
    let sheet = sheetRef.current
    if (!sheet || sheet.scrollTop > 0) return
    if (event.pointerType === 'mouse' && event.button !== 0) return
    // Only remember where the finger landed. Capturing here would make the browser deliver the click to the sheet instead of the row under the finger.
    drag.current = { startY: event.clientY, dy: 0, startedAt: performance.now(), active: false, pointerId: event.pointerId }
  }

  function onPointerMove(event) {
    if (!drag.current) return
    let sheet = sheetRef.current
    let dy = Math.max(0, event.clientY - drag.current.startY)
    if (!drag.current.active) {
      // A tap wobbles a few pixels; a drag starts past that.
      if (dy < 6) return
      drag.current.active = true
      try {
        sheet.setPointerCapture(drag.current.pointerId)
      } catch {
        // Synthetic events carry no live pointer; the drag still works without capture.
      }
      sheet.style.transition = 'none'
      scrimRef.current.style.transition = 'none'
      setShellState({ dragging: true })
    }
    drag.current.dy = dy
    let progress = Math.min(1, dy / sheet.offsetHeight)
    sheet.style.transform = `translateY(${dy}px)`
    scrimRef.current.style.opacity = String(1 - progress)
    setShellState({ progress })
  }

  function onPointerUp() {
    if (!drag.current) return
    let sheet = sheetRef.current
    let scrim = scrimRef.current
    let { dy, startedAt, active } = drag.current
    drag.current = null
    // A plain tap never became a drag: leave everything to the click that follows.
    if (!active) return
    sheet.style.transition = ''
    scrim.style.transition = ''
    setShellState({ dragging: false })
    let fast = dy / Math.max(1, performance.now() - startedAt) > 0.6
    // A flick dismisses too, but only after real travel so a jittery tap never closes the sheet.
    if (dy > sheet.offsetHeight * 0.25 || (fast && dy > 48)) {
      // Keep animating from where the finger left the sheet instead of snapping back to the top first.
      sheet.style.transform = 'translateY(100%)'
      scrim.style.opacity = '0'
      onClose()
      return
    }
    sheet.style.transform = ''
    scrim.style.opacity = ''
    setShellState({ progress: 0 })
  }

  if (!mounted) return null

  let groupsStart = items.findIndex((item) => item.children)

  // Portaled to body: the page shell is transformed while open, and a transformed ancestor would turn this fixed layer into a scaled child of it.
  return createPortal(
    <div className="fixed inset-0 z-[100] md:hidden" role="presentation">
      <div
        ref={scrimRef}
        onClick={onClose}
        className={clsx(
          `absolute inset-0 bg-black/40 transition-opacity duration-[450ms] ${EASE} motion-reduce:transition-none`,
          shown ? 'opacity-100' : 'opacity-0',
        )}
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        tabIndex={-1}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ touchAction: 'none' }}
        className={clsx(
          // -mb-12 with pb-12 bleeds the sheet 48 px below the viewport, so a swipe or overscroll never uncovers the page under it.
          `absolute inset-x-0 bottom-0 -mb-12 max-h-[85svh] overflow-y-auto rounded-t-xl border border-slate-300 bg-white pb-12 text-slate-900 shadow-lg outline-none transition-transform duration-[450ms] ${EASE} will-change-transform motion-reduce:transition-none`,
          shown ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <ul className="flex flex-col gap-1 p-2.5">
          {items.map((item, index) =>
            item.children ? (
              <Group key={item.label} item={item} onNavigate={onClose} />
            ) : (
              <li key={item.href} className={clsx(index === groupsStart - 1 && 'mb-1 border-b border-slate-200 pb-2')}>
                <Link href={item.href} onClick={onClose} className={rowClass}>
                  {item.label}
                  <ChevronRight />
                </Link>
              </li>
            ),
          )}
        </ul>
        <div className="border-t border-slate-200 p-2.5">
          <button type="button" onClick={onClose} className="flex h-9 w-full items-center justify-center rounded-sm text-sm tracking-tight text-slate-700 transition-colors hover:bg-slate-100 focus-visible:bg-slate-100 focus-visible:outline-none">
            Cerrar menú
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
