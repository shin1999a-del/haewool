import type { Metadata } from 'next'
import { locales, type Locale } from '@/lib/i18n'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export const metadata: Metadata = {
  title: '해울 | Haeul Tteok — Since 1988',
  description: 'Traditional Korean rice cake shop since 1988. Samseong-dong, Gangnam-gu, Seoul.',
}

interface Props {
  children: React.ReactNode
  params: { lang: Locale }
}

export default function LangLayout({ children, params: { lang } }: Props) {
  if (!locales.includes(lang)) notFound()

  return (
    <html lang={lang} className="scroll-smooth">
      <body>{children}</body>
    </html>
  )
}
