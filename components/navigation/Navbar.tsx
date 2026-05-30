'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Locale, Dictionary } from '@/lib/i18n'
import LanguageSwitcher from './LanguageSwitcher'

interface Props {
  lang: Locale
  dict: Dictionary
}

export default function Navbar({ lang, dict }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { href: `#story`, label: dict.nav.story },
    { href: `#menu`,  label: dict.nav.menu },
    { href: `#access`, label: dict.nav.access },
  ]

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-ivory/90 backdrop-blur-md border-b border-tan-light shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo wordmark */}
        <Link
          href={`/${lang}`}
          className="font-display text-xl tracking-[0.2em] text-charcoal hover:text-copper transition-colors duration-200 select-none"
        >
          해울
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className="text-xs tracking-widest uppercase text-charcoal/70 hover:text-charcoal transition-colors duration-200 font-sans"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right: reserve + language */}
        <div className="flex items-center gap-3">
          <Link
            href="/reserve"
            className="hidden md:inline-flex items-center px-4 py-1.5 text-xs tracking-widest uppercase border border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory transition-all duration-300 rounded-full font-sans"
          >
            {dict.nav.reserve}
          </Link>
          <LanguageSwitcher currentLang={lang} />

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-px bg-charcoal transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-5 h-px bg-charcoal transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-px bg-charcoal transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-ivory/95 backdrop-blur-md border-t border-tan-light px-6 py-6 flex flex-col gap-5">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-sm tracking-widest uppercase text-charcoal/70 hover:text-charcoal transition-colors duration-200 font-sans"
            >
              {label}
            </a>
          ))}
          <Link
            href="/reserve"
            className="self-start px-5 py-2 text-xs tracking-widest uppercase border border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory transition-all duration-300 rounded-full font-sans"
          >
            {dict.nav.reserve}
          </Link>
        </div>
      )}
    </header>
  )
}
