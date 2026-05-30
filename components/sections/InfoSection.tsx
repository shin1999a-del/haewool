import type { Locale, Dictionary } from '@/lib/i18n'
import FadeIn from '@/components/ui/FadeIn'
import Link from 'next/link'

interface Props {
  lang: Locale
  dict: Dictionary
}

const NAVER_MAP_URL = 'https://map.naver.com/v5/search/%EC%82%BC%EC%84%B1%EB%8F%99%20%EB%96%A1'

export default function InfoSection({ lang, dict }: Props) {
  const { info } = dict
  return (
    <section id="access" className="py-28 md:py-36 bg-ivory-2">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <FadeIn direction="up" className="text-center mb-16">
          <p className="text-[10px] tracking-[0.4em] uppercase text-tan mb-3 font-sans">
            Seoul · Gangnam
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-charcoal tracking-wide">
            {info.title}
          </h2>
          <div className="mt-5 flex justify-center">
            <hr className="hr-fade w-24" />
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Info block */}
          <FadeIn delay={100} direction="left">
            <div className="space-y-8">
              {/* Address */}
              <div className="flex gap-5">
                <div className="shrink-0 mt-1 w-8 h-8 rounded-full border border-tan flex items-center justify-center text-tan text-xs">
                  📍
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-tan mb-1 font-sans">Address</p>
                  <p className="font-display text-lg text-charcoal font-light leading-snug">
                    {info.address}
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-5">
                <div className="shrink-0 mt-1 w-8 h-8 rounded-full border border-tan flex items-center justify-center text-tan text-xs">
                  🕘
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-tan mb-1 font-sans">Hours</p>
                  <p className="font-display text-lg text-charcoal font-light">
                    {info.hours}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-5">
                <div className="shrink-0 mt-1 w-8 h-8 rounded-full border border-tan flex items-center justify-center text-tan text-xs">
                  📞
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-tan mb-1 font-sans">Phone</p>
                  <p className="font-display text-lg text-charcoal font-light">
                    {info.phone}
                  </p>
                </div>
              </div>

              {/* Naver Map button */}
              <a
                href={NAVER_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#03C75A] text-white text-xs tracking-widest uppercase rounded-full font-sans hover:bg-[#02a84c] transition-colors duration-300 shadow-sm"
              >
                {info.map_btn}
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 2h8v8M10 2 2 10" />
                </svg>
              </a>
            </div>
          </FadeIn>

          {/* Reservation / order panel */}
          <FadeIn delay={200} direction="up">
            <div className="relative">
              <div className="absolute -top-3 -left-3 w-full h-full border border-tan/20 rounded-sm" />
              <div className="relative bg-ivory rounded-sm p-8 md:p-10 border border-tan-light">
                {/* Decorative corner lines */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-tan/40" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-tan/40" />

                <p className="text-[10px] tracking-[0.4em] uppercase text-tan mb-3 font-sans">
                  Reservation
                </p>
                <h3 className="font-display text-2xl font-light text-charcoal mb-4 leading-snug">
                  온라인 예약 및<br />특별 주문
                </h3>
                <p className="text-xs text-charcoal/50 font-sans leading-relaxed mb-8">
                  {info.reserve_note}
                </p>

                <Link
                  href="/reserve"
                  className="group w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-charcoal text-ivory text-xs tracking-[0.25em] uppercase rounded-full font-sans hover:bg-warm-brown transition-colors duration-500"
                >
                  {info.reserve_btn}
                  <svg
                    className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M2 6h8M6 2l4 4-4 4" />
                  </svg>
                </Link>

                <div className="mt-6 pt-6 border-t border-tan-light flex items-center justify-center gap-6 text-[10px] text-charcoal/40 font-sans tracking-wider">
                  <span>KakaoTalk</span>
                  <span className="text-tan">·</span>
                  <span>Instagram</span>
                  <span className="text-tan">·</span>
                  <span>Email</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
