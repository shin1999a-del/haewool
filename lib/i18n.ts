export const locales = ['ko', 'en', 'ja', 'zh'] as const
export type Locale = (typeof locales)[number]

export interface MenuItem {
  name: string
  desc: string
  tag: string
}

export interface Dictionary {
  nav: {
    story: string
    menu: string
    access: string
    reserve: string
  }
  hero: {
    since: string
    tagline: string
    subtitle: string
    cta: string
  }
  story: {
    title: string
    since: string
    p1: string
    p2: string
    stat1_num: string
    stat1_label: string
    stat2_num: string
    stat2_label: string
    stat3_num: string
    stat3_label: string
  }
  menu: {
    title: string
    subtitle: string
    items: MenuItem[]
  }
  info: {
    title: string
    address: string
    hours: string
    phone: string
    map_btn: string
    reserve_btn: string
    reserve_note: string
  }
}

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ko: () => import('@/dictionaries/ko.json').then((m) => m.default as Dictionary),
  en: () => import('@/dictionaries/en.json').then((m) => m.default as Dictionary),
  ja: () => import('@/dictionaries/ja.json').then((m) => m.default as Dictionary),
  zh: () => import('@/dictionaries/zh.json').then((m) => m.default as Dictionary),
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]()
}
