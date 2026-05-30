'use client'
import dynamic from 'next/dynamic'
import { useRef, useCallback, useEffect, useState } from 'react'
import type { Locale, Dictionary } from '@/lib/i18n'

// Three.js canvas must be client-only (no SSR)
const HaeulScene = dynamic(() => import('@/components/three/HaeulScene'), { ssr: false })

/* SVG logo mark — stylised 5-petal plum blossom outline */
function LogoMark({ size = 160 }: { size?: number }) {
  const r = 22   // petal radius
  const d = 30   // distance from center
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
      strokeWidth="1.3"
      aria-hidden="true"
    >
      {petals.map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r={r} />
      ))}
      {/* Centre dot */}
      <circle cx="0" cy="0" r="5" />
      {/* Stamens */}
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

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const nx = (e.clientX / window.innerWidth - 0.5) * 2
    const ny = (e.clientY / window.innerHeight - 0.5) * 2
    mouseRef.current = { x: nx, y: ny }
    setParallax({ x: nx * 12, y: ny * 8 })
  }, [])

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-ivory"
    >
      {/* 3D canvas — fills the background */}
      <div className="absolute inset-0 z-0">
        <HaeulScene mouseRef={mouseRef} />
      </div>

      {/* Radial gradient vignette so text pops */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, #FDFBF7 100%)',
        }}
      />

      {/* Hero content — parallax shift on mouse move */}
      <div
        className="relative z-20 flex flex-col items-center text-center px-6 select-none"
        style={{
          transform: `translate(${parallax.x}px, ${parallax.y}px)`,
          transition: 'transform 0.12s ease-out',
        }}
      >
        {/* Logo mark */}
        <div className="mb-6 text-charcoal/80">
          <LogoMark size={96} />
        </div>

        {/* Since badge */}
        <p className="mb-4 text-[10px] tracking-[0.4em] uppercase text-tan font-sans">
          {dict.hero.since}
        </p>

        {/* Brand name */}
        <h1 className="font-display text-6xl md:text-8xl font-light text-charcoal tracking-wider mb-3 leading-none">
          해울
        </h1>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px w-12 bg-tan" />
          <span className="text-tan text-xs">✦</span>
          <div className="h-px w-12 bg-tan" />
        </div>

        {/* Tagline — from dictionary */}
        <p className="font-display italic text-xl md:text-2xl text-charcoal/80 mb-3 tracking-wide">
          {dict.hero.tagline}
        </p>

        {/* Subtitle */}
        <p className="text-sm text-charcoal/50 font-sans tracking-wider mb-10 max-w-xs">
          {dict.hero.subtitle}
        </p>

        {/* CTA button */}
        <a
          href="#menu"
          className="group inline-flex items-center gap-2 px-7 py-3 text-xs tracking-[0.25em] uppercase border border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory transition-all duration-500 rounded-full font-sans"
        >
          {dict.hero.cta}
          <svg
            className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M2 6h8M6 2l4 4-4 4" />
          </svg>
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-10 bg-gradient-to-b from-tan to-transparent" />
      </div>
    </section>
  )
}
