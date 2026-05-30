export type CatalogItem = {
  id: string
  name: Record<'ko' | 'en' | 'ja' | 'zh', string>
  price: number
  emoji: string
  note?: Record<'ko' | 'en' | 'ja' | 'zh', string>
}

export const CATALOG: CatalogItem[] = [
  {
    id: 'baekseolgi',
    name: { ko: '백설기', en: 'Baekseolgi', ja: 'ペクソルギ', zh: '白雪糕' },
    price: 3000, emoji: '🍚',
  },
  {
    id: 'sirutteok',
    name: { ko: '시루떡', en: 'Sirutteok', ja: 'シルトッ', zh: '蒸糕' },
    price: 3500, emoji: '🥮',
  },
  {
    id: 'injeolmi',
    name: { ko: '인절미', en: 'Injeolmi', ja: 'インジョルミ', zh: '引绝米糕' },
    price: 3000, emoji: '🍡',
  },
  {
    id: 'mujigaetteok',
    name: { ko: '무지개떡', en: 'Rainbow Tteok', ja: 'レインボー餅', zh: '彩虹糕' },
    price: 4000, emoji: '🌈',
  },
  {
    id: 'kongseolgi',
    name: { ko: '콩설기', en: 'Kongseolgi', ja: 'コンソルギ', zh: '豆蒸糕' },
    price: 3000, emoji: '🫘',
  },
  {
    id: 'garaetteok',
    name: { ko: '가래떡', en: 'Garaetteok', ja: 'ガレトッ', zh: '棒形糕' },
    price: 2500, emoji: '🥢',
  },
  {
    id: 'kkultteok',
    name: { ko: '꿀떡', en: 'Honey Tteok', ja: 'ハチミツ餅', zh: '蜂蜜糕' },
    price: 2000, emoji: '🍯',
  },
  {
    id: 'hobak',
    name: { ko: '호박인절미', en: 'Pumpkin Injeolmi', ja: 'かぼちゃ餅', zh: '南瓜糕' },
    price: 3000, emoji: '🎃',
  },
  {
    id: 'heukimja',
    name: { ko: '흑임자인절미', en: 'Black Sesame Injeolmi', ja: '黒ゴマ餅', zh: '黑芝麻糕' },
    price: 3500, emoji: '⚫',
  },
  {
    id: 'patsirutteok',
    name: { ko: '팥시루떡', en: 'Red Bean Sirutteok', ja: '小豆蒸餅', zh: '红豆蒸糕' },
    price: 3500, emoji: '❤️',
  },
  {
    id: 'modeum',
    name: { ko: '모듬찰떡', en: 'Assorted Chaltteok', ja: '盛合せ餅', zh: '什锦糯米糕' },
    price: 4500, emoji: '🧆',
  },
  {
    id: 'yakshik',
    name: { ko: '약식', en: 'Yakshik', ja: '薬食', zh: '药食' },
    price: 5000, emoji: '🍯',
  },
  {
    id: 'tteokkeiki',
    name: { ko: '떡케이크', en: 'Tteok Cake', ja: '餅ケーキ', zh: '年糕蛋糕' },
    price: 45000, emoji: '🎂',
    note: { ko: '주문제작', en: 'Custom Order', ja: 'オーダーメイド', zh: '定制' },
  },
  {
    id: 'songpyeon',
    name: { ko: '송편', en: 'Songpyeon', ja: 'ソンピョン', zh: '松饼' },
    price: 3000, emoji: '🌙',
    note: { ko: '계절한정', en: 'Seasonal', ja: '季節限定', zh: '季节限定' },
  },
]

export function nid() {
  return ('ID-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5)).toUpperCase()
}

const SB_URL = 'https://adkfwhkneptmndzgrsfq.supabase.co'
const SB_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFka2Z3aGtuZXB0bW5kemdyc2ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMTA4MzAsImV4cCI6MjA5Mzg4NjgzMH0.sYmgBSGGVMWWxzNo6qa9f2eTM1tfNG1ULrrH3jyRhJA'

export async function submitOrder(data: Record<string, unknown>) {
  const res = await fetch(`${SB_URL}/rest/v1/orders`, {
    method: 'POST',
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(await res.text())
  const text = await res.text()
  return text ? JSON.parse(text) : []
}
