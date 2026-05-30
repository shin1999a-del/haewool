import type { Locale, Dictionary, MenuItem } from '@/lib/i18n'
import FadeIn from '@/components/ui/FadeIn'

interface Props {
  lang: Locale
  dict: Dictionary
}

const TAG_CONFIG: Record<string, { label: string; bg: string; text: string; gradient: string }> = {
  CLASSIC:   { label: 'Classic',   bg: 'bg-stone-50',  text: 'text-stone-500',  gradient: 'from-stone-100 via-amber-50 to-stone-100' },
  SIGNATURE: { label: 'Signature', bg: 'bg-amber-50',  text: 'text-copper',     gradient: 'from-amber-100 via-orange-50 to-amber-100' },
  SPECIAL:   { label: 'Special',   bg: 'bg-rose-50',   text: 'text-rose-400',   gradient: 'from-rose-100 via-purple-50 via-amber-50 to-emerald-50' },
  PREMIUM:   { label: 'Premium',   bg: 'bg-red-50',    text: 'text-red-700',    gradient: 'from-red-100 via-rose-50 to-red-50' },
  SEASONAL:  { label: 'Seasonal',  bg: 'bg-green-50',  text: 'text-green-600',  gradient: 'from-green-100 via-emerald-50 to-amber-50' },
}

const MOTIFS = ['✦', '◇', '✧', '❋', '◈', '✤']

function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  const cfg = TAG_CONFIG[item.tag] ?? TAG_CONFIG.CLASSIC
  const delay = (index % 3) * 80

  return (
    <FadeIn delay={delay} direction="up">
      <article className="group relative bg-ivory border border-tan-light rounded-sm overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5">
        {/* Thumbnail */}
        <div className={`relative aspect-[4/3] bg-gradient-to-br ${cfg.gradient} flex items-center justify-center overflow-hidden`}>
          {/* Decorative background rings */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-32 h-32 rounded-full border border-charcoal" />
            <div className="absolute w-20 h-20 rounded-full border border-charcoal" />
          </div>
          {/* Motif */}
          <span className="relative text-5xl text-charcoal/20 font-serif select-none transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12">
            {MOTIFS[index]}
          </span>
          {/* Hover reveal */}
          <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/4 transition-colors duration-500" />
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-display text-lg font-normal text-charcoal tracking-wide leading-tight">
              {item.name}
            </h3>
            <span className={`shrink-0 text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full font-sans ${cfg.bg} ${cfg.text}`}>
              {item.tag}
            </span>
          </div>
          <p className="text-xs text-charcoal/55 font-sans leading-relaxed">
            {item.desc}
          </p>
        </div>

        {/* Bottom accent on hover */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-copper to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </article>
    </FadeIn>
  )
}

export default function MenuGallery({ lang, dict }: Props) {
  const { menu } = dict
  return (
    <section id="menu" className="py-28 md:py-36 bg-ivory">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <FadeIn direction="up" className="text-center mb-16">
          <p className="text-[10px] tracking-[0.4em] uppercase text-tan mb-3 font-sans">Haeul Tteok</p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-charcoal tracking-wide mb-3">
            {menu.title}
          </h2>
          <p className="font-display italic text-charcoal/50 text-lg">{menu.subtitle}</p>
          <div className="mt-5 flex justify-center"><hr className="hr-fade w-24" /></div>
        </FadeIn>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {menu.items.map((item, i) => (
            <MenuCard key={i} item={item} index={i} />
          ))}
        </div>

        {/* Reserve CTA */}
        <FadeIn delay={300} direction="up" className="mt-14 text-center">
          <a
            href={`/${lang}/reserve`}
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-ivory-2 border border-tan text-charcoal/70 text-xs tracking-widest uppercase rounded-full font-sans hover:bg-charcoal hover:text-ivory hover:border-charcoal transition-all duration-500"
          >
            {lang === 'ko' ? '온라인 예약 · 주문' :
             lang === 'ja' ? 'オンライン予約・注文' :
             lang === 'zh' ? '在线预约·订购' :
             'Online Reservation · Order'}
            <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 6h8M6 2l4 4-4 4" />
            </svg>
          </a>
        </FadeIn>
      </div>
    </section>
  )
}
