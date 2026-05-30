import { NextRequest, NextResponse } from 'next/server'

const locales = ['ko', 'en', 'ja', 'zh'] as const
const defaultLocale = 'ko'

function getPreferredLocale(request: NextRequest): string {
  const acceptLang = request.headers.get('accept-language') ?? ''
  for (const locale of locales) {
    if (acceptLang.toLowerCase().includes(locale)) return locale
  }
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Already prefixed with a locale → pass through
  const hasLocale = locales.some(
    (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
  )
  if (hasLocale) return NextResponse.next()

  // Skip assets / API / internal Next.js routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.match(/\.\w+$/)
  ) {
    return NextResponse.next()
  }

  const locale = getPreferredLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
}
