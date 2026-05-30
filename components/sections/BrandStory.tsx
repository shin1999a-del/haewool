import type { Locale, Dictionary } from '@/lib/i18n'
import FadeIn from '@/components/ui/FadeIn'

interface Props {
  lang: Locale
  dict: Dictionary
}

interface StatProps {
  num: string
  label: string
  delay: number
}

function Stat({ num, label, delay }: StatProps) {
  return (
    <FadeIn delay={delay} direction="up" className="flex flex-col items-center text-center">
      <span className="font-display text-4xl md:text-5xl font-light text-copper tracking-wide">
        {num}
      </span>
      <span className="mt-1 text-xs tracking-widest uppercase text-charcoal/50 font-sans">
        {label}
      </span>
    </FadeIn>
  )
}

export default function BrandStory({ lang, dict }: Props) {
  const { story } = dict
  return (
    <section id="story" className="py-28 md:py-36 bg-ivory-2">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <FadeIn direction="up" className="text-center mb-20">
          <p className="text-[10px] tracking-[0.4em] uppercase text-tan mb-3 font-sans">
            {story.since}
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-charcoal tracking-wide">
            {story.title}
          </h2>
          <div className="mt-5 flex justify-center">
            <hr className="hr-fade w-24" />
          </div>
        </FadeIn>

        {/* Two-column: text + decorative panel */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center mb-20">
          {/* Text column */}
          <div className="space-y-6">
            <FadeIn delay={100} direction="left">
              <p className="font-display text-lg md:text-xl font-light text-charcoal/80 leading-loose tracking-wide">
                {story.p1}
              </p>
            </FadeIn>
            <FadeIn delay={220} direction="left">
              <p className="font-display text-lg md:text-xl font-light text-charcoal/80 leading-loose tracking-wide">
                {story.p2}
              </p>
            </FadeIn>
          </div>

          {/* Decorative right panel */}
          <FadeIn delay={150} direction="up">
            <div className="relative flex justify-center">
              {/* Layered background squares — Japanese/Korean aesthetic */}
              <div className="absolute top-4 right-4 w-full h-full border border-tan/30 rounded-sm" />
              <div className="relative w-full aspect-[4/5] bg-tan-light rounded-sm overflow-hidden flex items-center justify-center">
                <div className="text-center px-10 py-12">
                  {/* Large kanji/hangul numeral decoration */}
                  <div className="font-display text-8xl font-light text-tan/30 leading-none mb-4 select-none">
                    해울
                  </div>
                  <div className="h-px w-16 mx-auto bg-tan/50 mb-4" />
                  <p className="text-xs tracking-[0.3em] uppercase text-charcoal/40 font-sans">
                    Since 1988
                  </p>
                  <p className="mt-6 font-display italic text-base text-charcoal/60">
                    떡과 마음을 잇다
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-6 pt-12 border-t border-tan/30">
          <Stat num={story.stat1_num} label={story.stat1_label} delay={0} />
          <Stat num={story.stat2_num} label={story.stat2_label} delay={100} />
          <Stat num={story.stat3_num} label={story.stat3_label} delay={200} />
        </div>
      </div>
    </section>
  )
}
