'use client'
import dynamic from 'next/dynamic'
import { useRef, useCallback, useState } from 'react'
import Link from 'next/link'
import type { Locale, Dictionary } from '@/lib/i18n'

const HaeulScene = dynamic(() => import('@/components/three/HaeulScene'), { ssr: false })

function LogoMark({ size = 80 }: { size?: number }) {
  const r = 22
  const d = 30
  const petals = [0, 72, 144, 216, 288].map((deg) => {
    const rad = ((deg - 90) * Math.PI) / 180
    return { cx: Math.cos(rad) * d, cy: Math.sin(rad) * d }
  })
  return (
    <svg
      width={size}
      height={size}
      viewBox="-65 -65 130 130"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
    >
      {petals.map((p, i) => <circle key={i} cx={p.cx} cy={p.cy} r={r} />)}
      <circle cx="0" cy="0" r="5" />
      {petals.map((p, i) => (
        <line key={`s${i}`} x1="0" y1="0" x2={p.cx * 0.42} y2={p.cy * 0.42} strokeWidth="0.7" opacity="0.5" />
      ))}
    </svg>
  )
}

interface Props {
  lang: Locale
  dict: Dictionary
}

export default function HeroSection({ lang, dict }: Props) {
  const mouseRef = useRef({ x: 0, y: 0 })
  const [parallax, setParallax] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const nx = (e.clientX / window.innerWidth - 0.5) * 2
    const ny = (e.clientY / window.innerHeight - 0.5) * 2
    mouseRef.current = { x: nx, y: ny }
    setParallax({ x: nx * 10, y: ny * 6 })
  }, [])

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center overflow-hidden bg-ivory"
    >
      {/* ── Left: Text content ── */}
      <div className="relative z-20 w-full md:w-1/2 flex flex-col items-center md:items-start justify-center px-10 md:px-16 lg:px-24 pt-24 pb-20 md:py-0">
        <div
          style={{
            transform: `translate(${parallax.x * 0.5}px, ${parallax.y * 0.5}px)`,
            transition: 'transform 0.15s ease-out',
          }}
          className="flex flex-col items-center md:items-start text-center md:text-left"
        >
          {/* Logo mark */}
          <div className="text-charcoal/70 mb-5">
            <LogoMark size={72} />
          </div>

          {/* Since */}
          <p className="text-[10px] tracking-[0.4em] uppercase text-tan font-sans mb-4">
            {dict.hero.since}
          </p>

          {/* Brand name */}
          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-light text-charcoal tracking-normal leading-none mb-4">
            해울
          </h1>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-tan" />
            <span className="text-tan text-xs">✦</span>
            <div className="h-px w-10 bg-tan" />
          </div>

          {/* Tagline */}
          <p className="font-display italic text-xl md:text-2xl text-charcoal/75 mb-3 tracking-wide">
            {dict.hero.tagline}
          </p>

          {/* Subtitle */}
          <p className="text-sm text-charcoal/45 font-sans tracking-wide mb-10 max-w-xs">
            {dict.hero.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href="#menu"
              className="group inline-flex items-center gap-2 px-7 py-3 text-xs tracking-[0.25em] uppercase bg-charcoal text-ivory hover:bg-warm-brown transition-all duration-500 rounded-full font-sans"
            >
              {dict.hero.cta}
              <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 6h8M6 2l4 4-4 4" />
              </svg>
            </a>
            <Link
              href={`/${lang}/reserve`}
              className="inline-flex items-center gap-2 px-7 py-3 text-xs tracking-[0.25em] uppercase border border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory transition-all duration-500 rounded-full font-sans"
            >
              {dict.nav.reserve}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Right: 3D Canvas (desktop) / Background (mobile) ── */}
      {/* Mobile: translucent 3D behind everything */}
      <div className="absolute inset-0 z-0 md:hidden opacity-30">
        <HaeulScene mouseRef={mouseRef} />
      </div>

      {/* Desktop: right half canvas */}
      <div
        className="hidden md:block absolute right-0 top-0 w-1/2 h-full z-10"
        style={{
          transform: `translate(${parallax.x * 0.8}px, ${parallax.y * 0.8}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <HaeulScene mouseRef={mouseRef} />
      </div>

      {/* Right edge fade for desktop — blends 3D into ivory */}
      <div
        className="hidden md:block absolute right-0 top-0 w-24 h-full z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #FDFBF7, transparent)' }}
      />
      {/* Left edge fade for desktop — separates text from 3D */}
      <div
        className="hidden md:block absolute left-[48%] top-0 w-24 h-full z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #FDFBF7 20%, transparent)' }}
      />

      {/* Mobile bottom gradient */}
      <div
        className="md:hidden absolute bottom-0 inset-x-0 h-1/2 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #FDFBF7 60%, transparent)' }}
      />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 md:left-[25%] -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <div className="w-px h-10 bg-gradient-to-b from-tan to-transparent animate-pulse" />
      </div>
    </section>
  )
}
