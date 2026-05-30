import { getDictionary, type Locale, locales } from '@/lib/i18n'
import { notFound } from 'next/navigation'
import Navbar from '@/components/navigation/Navbar'
import ReserveClient from './ReserveClient'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const titles: Record<Locale, string> = {
    ko: '온라인 예약 | 해울',
    en: 'Online Reservation | Haeul',
    ja: 'オンライン予約 | 해울',
    zh: '在线预约 | 해울',
  }
  return { title: titles[lang] }
}

interface Props {
  params: { lang: Locale }
}

export default async function ReservePage({ params: { lang } }: Props) {
  if (!locales.includes(lang)) notFound()
  const dict = await getDictionary(lang)

  return (
    <main className="bg-ivory min-h-screen">
      <Navbar lang={lang} dict={dict} />
      <ReserveClient lang={lang} />
    </main>
  )
}
