import { getDictionary, type Locale, locales } from '@/lib/i18n'
import { notFound } from 'next/navigation'
import Navbar from '@/components/navigation/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import BrandStory from '@/components/sections/BrandStory'
import MenuGallery from '@/components/sections/MenuGallery'
import InfoSection from '@/components/sections/InfoSection'

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

interface Props {
  params: { lang: Locale }
}

export default async function Home({ params: { lang } }: Props) {
  if (!locales.includes(lang)) notFound()

  const dict = await getDictionary(lang)

  return (
    <main className="bg-ivory min-h-screen">
      <Navbar lang={lang} dict={dict} />
      <HeroSection lang={lang} dict={dict} />
      <BrandStory lang={lang} dict={dict} />
      <MenuGallery lang={lang} dict={dict} />
      <InfoSection lang={lang} dict={dict} />
      <footer className="py-10 text-center text-sm text-tan border-t border-tan-light">
        <p className="font-display tracking-widest text-xs">해울 HAEUL © 1988 – {new Date().getFullYear()}</p>
        <p className="mt-1 text-xs opacity-60">Samseong-dong, Gangnam-gu, Seoul</p>
      </footer>
    </main>
  )
}
