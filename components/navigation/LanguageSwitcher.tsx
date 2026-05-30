'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { Locale } from '@/lib/i18n'

const LANG_LABELS: Record<Locale, { short: string; native: string }> = {
  ko: { short: 'KO', native: '한국어' },
  en: { short: 'EN', native: 'English' },
  ja: { short: 'JA', native: '日本語' },
  zh: { short: 'ZH', native: '中文' },
}

interface Props {
  currentLang: Locale
}

export default function LanguageSwitcher({ currentLang }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const switchLang = (lang: Locale) => {
    // Replace the locale segment in the current path
    const segments = pathname.split('/')
    segments[1] = lang
    router.push(segments.join('/'))
    setOpen(false)
  }

  const current = LANG_LABELS[currentLang]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Switch language"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-tan text-xs tracking-widest text-charcoal hover:bg-tan-light transition-colors duration-200"
      >
        <span className="font-sans font-medium">{current.short}</span>
        <svg
          className={`w-2.5 h-2.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 10 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M1 1l4 4 4-4" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-ivory border border-tan-light rounded-xl shadow-lg overflow-hidden z-50 animate-fadeIn">
          {(Object.entries(LANG_LABELS) as [Locale, { short: string; native: string }][]).map(
            ([lang, labels]) => (
              <button
                key={lang}
                onClick={() => switchLang(lang)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-xs hover:bg-ivory-2 transition-colors duration-150 ${
                  lang === currentLang ? 'text-copper font-semibold' : 'text-charcoal'
                }`}
              >
                <span className="tracking-wider">{labels.short}</span>
                <span className="opacity-60 text-[11px]">{labels.native}</span>
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}
