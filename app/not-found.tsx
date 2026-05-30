import Link from 'next/link'

export default function NotFound() {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-ivory flex flex-col items-center justify-center text-charcoal px-6">
        <p className="text-[10px] tracking-[0.4em] uppercase text-tan mb-4 font-sans">404</p>
        <h1 className="font-display text-5xl font-light mb-4 tracking-wide">해울</h1>
        <div className="h-px w-16 bg-tan mb-6" />
        <p className="text-sm text-charcoal/50 font-sans mb-8 text-center leading-relaxed">
          요청하신 페이지를 찾을 수 없습니다.<br />
          The page you requested could not be found.
        </p>
        <Link
          href="/ko"
          className="px-6 py-2.5 border border-charcoal text-charcoal text-xs tracking-widest uppercase rounded-full font-sans hover:bg-charcoal hover:text-ivory transition-all duration-300"
        >
          홈으로 / Home
        </Link>
      </body>
    </html>
  )
}
