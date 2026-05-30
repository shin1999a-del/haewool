import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '해울 | Haeul Tteok — Since 1988',
  description: '1988년부터 이어온 전통 한국 떡 전문점 해울. 서울 강남구 삼성동.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
