import type { Locale, Dictionary, MenuItem } from '@/lib/i18n'
import FadeIn from '@/components/ui/FadeIn'

interface Props {
  lang: Locale
  dict: Dictionary
}

const TAG_STYLES: Record<string, string> = {
  CLASSIC:   'bg-charcoal/8 text-charcoal/60',
  SIGNATURE: 'bg-copper/10 text-copper',
  SPECIAL:   'bg-tan/20 text-copper',
  PREMIUM:   'bg-warm-brown/10 text-warm-brown',
  SEASONAL:  'bg-tan-light text-charcoal/60',
}

const CARD_ICONS: string[] = ['◇', '◈', '◉', '◇', '◈', '◉']

function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  const tagStyle = TAG_STYLES[item.tag] ?? 'bg-tan-light text-charcoal/60'
  const delay = (index % 3) * 80

  return (
    <FadeIn delay={delay} direction="up">
      <article className="group relative bg-ivory border border-tan-light rounded-sm overflow-hidden hover:shadow-lg transition-all duration-500 hover:-translate-y-1">
        {/* Image placeholder */}
        <div className="relative aspect-square bg-ivory-2 flex items-center justify-center overflow-hidden">
          <span className="text-6xl text-tan/30 select-none transition-transform duration-700 group-hover:scale-110">
            {CARD_ICONS[index]}
          </span>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/5 transition-colors duration-500" />
        </div>

        {/* Card body */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-display text-lg font-normal text-charcoal tracking-wide leading-tight">
              {item.name}
            </h3>
            <span className={`shrink-0 text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full font-sans ${tagStyle}`}>
              {item.tag}
            </span>
          </div>
          <p className="text-xs text-charcoal/55 font-sans leading-relaxed">
            {item.desc}
          </p>
        </div>

        {/* Bottom border accent on hover */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-tan scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </article>
    </FadeIn>
  )
}

export default function MenuGallery({ lang, dict }: Props) {
  const { menu } = dict
  return (
    <section id="menu" className="py-28 md:py-36 bg-ivory">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <FadeIn direction="up" className="text-center mb-16">
          <p className="text-[10px] tracking-[0.4em] uppercase text-tan mb-3 font-sans">
            Haeul Tteok
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-charcoal tracking-wide mb-3">
            {menu.title}
          </h2>
          <p className="font-display italic text-charcoal/50 text-lg">
            {menu.subtitle}
          </p>
          <div className="mt-5 flex justify-center">
            <hr className="hr-fade w-24" />
          </div>
        </FadeIn>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {menu.items.map((item, i) => (
            <MenuCard key={i} item={item} index={i} />
          ))}
        </div>

        {/* View all CTA */}
        <FadeIn delay={300} direction="up" className="mt-14 text-center">
          <a
            href="#access"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-charcoal/50 hover:text-charcoal transition-colors duration-200 font-sans border-b border-tan/50 pb-0.5"
          >
            온라인 주문 문의
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 6h8M6 2l4 4-4 4" />
            </svg>
          </a>
        </FadeIn>
      </div>
    </section>
  )
}
