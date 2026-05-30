'use client'
import { useState, useCallback } from 'react'
import type { Locale } from '@/lib/i18n'
import { CATALOG, nid, submitOrder } from '@/lib/catalog'

type Lang = Locale

const T: Record<string, Record<Lang, string>> = {
  title:   { ko: '온라인 예약', en: 'Online Reservation', ja: 'オンライン予約', zh: '在线预约' },
  since:   { ko: 'Since 1988', en: 'Since 1988', ja: 'Since 1988', zh: 'Since 1988' },
  s1:      { ko: '수령 일시', en: 'Pickup Date & Time', ja: '受取日時', zh: '取货日期/时间' },
  s2:      { ko: '수령 방법', en: 'Pickup Method', ja: '受取方法', zh: '取货方式' },
  s3:      { ko: '상품 선택', en: 'Select Items', ja: '商品選択', zh: '选择商品' },
  s4:      { ko: '예약자 정보', en: 'Your Information', ja: '予約者情報', zh: '预约人信息' },
  ldate:   { ko: '수령 날짜', en: 'Date', ja: '受取日', zh: '日期' },
  ltime:   { ko: '수령 시간', en: 'Time', ja: '受取時間', zh: '时间' },
  hours:   { ko: '영업시간: 09:00 – 18:00', en: 'Business hours: 09:00 – 18:00', ja: '営業時間: 09:00 – 18:00', zh: '营业时间: 09:00 – 18:00' },
  visit:   { ko: '방문수령', en: 'In-Store Pickup', ja: '店頭受取', zh: '到店取货' },
  del:     { ko: '배달', en: 'Delivery', ja: '配達', zh: '配送' },
  laddr:   { ko: '배달 주소', en: 'Delivery Address', ja: '配達住所', zh: '配送地址' },
  addrPh:  { ko: '주소를 입력해주세요', en: 'Enter your address', ja: '住所を入力してください', zh: '请输入配送地址' },
  lname:   { ko: '이름', en: 'Name', ja: 'お名前', zh: '姓名' },
  namePh:  { ko: '홍길동', en: 'John Doe', ja: '山田花子', zh: '张三' },
  lphone:  { ko: '전화번호', en: 'Phone Number', ja: '電話番号', zh: '电话号码' },
  phonePh: { ko: '010-0000-0000', en: '+1-000-000-0000', ja: '090-0000-0000', zh: '188-0000-0000' },
  lnote:   { ko: '요청 사항', en: 'Special Requests', ja: 'ご要望', zh: '特别要求' },
  notePh:  { ko: '알레르기, 포장 방법, 기타 요청사항', en: 'Allergies, packaging, other requests', ja: 'アレルギー・包装方法・その他ご要望', zh: '过敏、包装方式及其他要求' },
  opt:     { ko: ' (선택)', en: ' (optional)', ja: ' (任意)', zh: ' (可选)' },
  total:   { ko: '합계 금액', en: 'Total', ja: '合計金額', zh: '合计' },
  notice:  { ko: '예약 완료 후 담당자가 연락드립니다. 가격은 수량 및 내용에 따라 변동될 수 있습니다.', en: 'Our team will contact you after your reservation is confirmed. Prices may vary based on quantity and content.', ja: 'ご予約完了後、担当者よりご連絡いたします。価格は数量・内容により変動する場合があります。', zh: '预约完成后，工作人员将与您联系。价格可能因数量和内容而有所变动。' },
  submit:  { ko: '예약 신청하기', en: 'Submit Reservation', ja: '予約を申し込む', zh: '提交预约' },
  submitting: { ko: '처리 중...', en: 'Submitting...', ja: '送信中...', zh: '提交中...' },
  sucH:    { ko: '예약이 접수되었습니다!', en: 'Reservation Confirmed!', ja: 'ご予約を受け付けました！', zh: '预约已成功提交！' },
  sucP:    { ko: '담당자가 확인 후 연락드리겠습니다. 아래 예약번호를 메모해두세요.', en: 'Our team will contact you shortly. Please note your reservation number below.', ja: '担当者が確認後ご連絡いたします。下記の予約番号をお控えください。', zh: '工作人员确认后将与您联系，请记录以下预约编号。' },
  newbtn:  { ko: '새 예약하기', en: 'New Reservation', ja: '新しく予約する', zh: '重新预约' },
  edate:   { ko: '날짜를 선택해주세요', en: 'Please select a date', ja: '日付を選択してください', zh: '请选择日期' },
  eitems:  { ko: '상품을 1개 이상 선택해주세요', en: 'Please select at least one item', ja: '商品を1つ以上選択してください', zh: '请至少选择一件商品' },
  ename:   { ko: '이름을 입력해주세요', en: 'Please enter your name', ja: 'お名前を入力してください', zh: '请输入姓名' },
  ephone:  { ko: '전화번호를 입력해주세요', en: 'Please enter your phone number', ja: '電話番号を入力してください', zh: '请输入电话号码' },
  obId:    { ko: '예약번호', en: 'Reservation No.', ja: '予約番号', zh: '预约编号' },
  obDate:  { ko: '수령일시', en: 'Pickup Date/Time', ja: '受取日時', zh: '取货日期' },
  obMethod:{ ko: '수령방법', en: 'Method', ja: '受取方法', zh: '取货方式' },
  obItems: { ko: '주문내역', en: 'Order', ja: '注文内容', zh: '订单详情' },
  obTotal: { ko: '합계', en: 'Total', ja: '合計', zh: '合计' },
  seasonal:{ ko: '계절한정', en: 'Seasonal', ja: '季節限定', zh: '季节限定' },
  custom:  { ko: '주문제작', en: 'Custom', ja: 'オーダーメイド', zh: '定制' },
}

function t(key: string, lang: Lang): string {
  return T[key]?.[lang] ?? key
}

interface Props { lang: Lang }

export default function ReserveClient({ lang }: Props) {
  const [date, setDate]       = useState('')
  const [time, setTime]       = useState('10:00')
  const [delivery, setDelivery] = useState<'pickup' | 'delivery'>('pickup')
  const [addr, setAddr]       = useState('')
  const [qty, setQty]         = useState<Record<string, number>>({})
  const [name, setName]       = useState('')
  const [phone, setPhone]     = useState('')
  const [note, setNote]       = useState('')
  const [errors, setErrors]   = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState<null | { id: string; total: number }>(null)

  const changeQty = useCallback((id: string, delta: number) => {
    setQty((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) }))
  }, [])

  const total = CATALOG.reduce((s, p) => s + (qty[p.id] ?? 0) * p.price, 0)

  const validate = () => {
    const e: Record<string, boolean> = {}
    if (!date) e.date = true
    if (!CATALOG.some((p) => (qty[p.id] ?? 0) > 0)) e.items = true
    if (!name.trim()) e.name = true
    if (!phone.trim()) e.phone = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const id = nid()
      const items = CATALOG.filter((p) => (qty[p.id] ?? 0) > 0).map((p) => ({
        name: p.name.ko,
        qty: qty[p.id],
        price: p.price,
      }))
      await submitOrder({
        id,
        customer_name: name.trim(),
        pickup: `${date}T${time}`,
        delivery_type: delivery === 'pickup' ? '방문수령' : '배달',
        delivery_addr: delivery === 'delivery' ? addr.trim() : '',
        items,
        note: note.trim(),
        total,
        status: 'pending',
        paid: false,
      })
      setDone({ id, total })
    } catch (err) {
      alert('오류가 발생했습니다. 다시 시도해주세요.\n' + (err instanceof Error ? err.message : ''))
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setDate(''); setTime('10:00'); setDelivery('pickup'); setAddr('')
    setQty({}); setName(''); setPhone(''); setNote('')
    setErrors({}); setDone(null)
  }

  const today = new Date().toISOString().split('T')[0]

  /* ── Success Screen ── */
  if (done) {
    const orderItems = CATALOG.filter((p) => (qty[p.id] ?? 0) > 0)
    return (
      <div className="min-h-screen bg-ivory pt-28 px-4 pb-20 flex flex-col items-center">
        <div className="w-full max-w-lg text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✅</div>
          <h2 className="font-display text-3xl text-charcoal mb-3">{t('sucH', lang)}</h2>
          <p className="text-sm text-charcoal/60 mb-8 leading-relaxed">{t('sucP', lang)}</p>
          <div className="bg-white rounded-xl border border-tan-light p-6 text-left space-y-3 mb-8 shadow-sm">
            {[
              [t('obId', lang), done.id],
              [t('obDate', lang), `${date} ${time}`],
              [t('obMethod', lang), t(delivery === 'pickup' ? 'visit' : 'del', lang)],
              [t('obItems', lang), orderItems.map((p) => `${p.name[lang]} ×${qty[p.id]}`).join(', ')],
              [t('obTotal', lang), `₩${done.total.toLocaleString()}`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-start gap-4 py-2 border-b border-ivory-2 last:border-0">
                <span className="text-xs text-charcoal/50 font-sans shrink-0">{label}</span>
                <span className="text-sm text-charcoal font-sans text-right">{value}</span>
              </div>
            ))}
          </div>
          <button
            onClick={reset}
            className="px-8 py-3 bg-charcoal text-ivory text-xs tracking-widest uppercase rounded-full font-sans hover:bg-warm-brown transition-colors duration-300"
          >
            {t('newbtn', lang)}
          </button>
        </div>
      </div>
    )
  }

  /* ── Form ── */
  const labelCls = 'block text-[10px] font-semibold tracking-widest uppercase text-copper mb-1.5 font-sans'
  const inputCls = 'w-full px-4 py-3 border border-tan-light rounded-xl text-sm bg-ivory focus:outline-none focus:border-copper transition-colors duration-200 font-sans'
  const errCls = 'text-[11px] text-red-400 mt-1 font-sans'

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-20">
      {/* Page header */}
      <div className="text-center py-10 px-4">
        <p className="text-[10px] tracking-[0.4em] uppercase text-tan mb-2 font-sans">{t('since', lang)}</p>
        <h1 className="font-display text-4xl md:text-5xl font-light text-charcoal tracking-wide">{t('title', lang)}</h1>
        <div className="mt-4 flex justify-center"><hr className="hr-fade w-20" /></div>
      </div>

      <div className="max-w-lg mx-auto px-4 space-y-5">

        {/* Step 1: Date & Time */}
        <div className="bg-white rounded-2xl border border-tan-light p-6 shadow-sm">
          <h3 className="font-display text-lg text-charcoal mb-5 flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-charcoal text-ivory text-xs flex items-center justify-center font-sans font-semibold shrink-0">1</span>
            {t('s1', lang)}
          </h3>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>{t('ldate', lang)}</label>
              <input type="date" className={inputCls} min={today} value={date} onChange={(e) => setDate(e.target.value)} />
              {errors.date && <p className={errCls}>{t('edate', lang)}</p>}
            </div>
            <div>
              <label className={labelCls}>{t('ltime', lang)}</label>
              <input type="time" className={inputCls} min="09:00" max="18:00" step="900" value={time} onChange={(e) => setTime(e.target.value)} />
              <p className="text-[11px] text-charcoal/40 mt-1 font-sans">{t('hours', lang)}</p>
            </div>
          </div>
        </div>

        {/* Step 2: Pickup Method */}
        <div className="bg-white rounded-2xl border border-tan-light p-6 shadow-sm">
          <h3 className="font-display text-lg text-charcoal mb-5 flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-charcoal text-ivory text-xs flex items-center justify-center font-sans font-semibold shrink-0">2</span>
            {t('s2', lang)}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {(['pickup', 'delivery'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setDelivery(type)}
                className={`p-4 rounded-xl border text-sm font-sans transition-all duration-200 ${
                  delivery === type
                    ? 'border-copper bg-copper/5 text-copper font-semibold'
                    : 'border-tan-light text-charcoal/60 hover:border-tan'
                }`}
              >
                {type === 'pickup' ? `🏪 ${t('visit', lang)}` : `🚚 ${t('del', lang)}`}
              </button>
            ))}
          </div>
          {delivery === 'delivery' && (
            <div className="mt-4">
              <label className={labelCls}>{t('laddr', lang)}</label>
              <input type="text" className={inputCls} placeholder={t('addrPh', lang)} value={addr} onChange={(e) => setAddr(e.target.value)} />
            </div>
          )}
        </div>

        {/* Step 3: Products */}
        <div className="bg-white rounded-2xl border border-tan-light p-6 shadow-sm">
          <h3 className="font-display text-lg text-charcoal mb-5 flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-charcoal text-ivory text-xs flex items-center justify-center font-sans font-semibold shrink-0">3</span>
            {t('s3', lang)}
          </h3>
          {errors.items && <p className={`${errCls} mb-3`}>{t('eitems', lang)}</p>}
          <div className="grid grid-cols-2 gap-3">
            {CATALOG.map((item) => {
              const q = qty[item.id] ?? 0
              const isOn = q > 0
              return (
                <div
                  key={item.id}
                  className={`rounded-xl border p-3 text-center transition-all duration-200 ${
                    isOn ? 'border-copper bg-copper/5' : 'border-tan-light bg-ivory'
                  }`}
                >
                  {item.note && (
                    <span className="text-[9px] tracking-wider bg-tan/20 text-copper px-2 py-0.5 rounded-full font-sans">
                      {item.note[lang]}
                    </span>
                  )}
                  <div className="text-3xl my-1.5">{item.emoji}</div>
                  <div className="text-xs font-semibold text-charcoal mb-0.5 font-sans">{item.name[lang]}</div>
                  <div className="text-[11px] text-copper mb-2 font-sans">₩{item.price.toLocaleString()}</div>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => changeQty(item.id, -1)}
                      className="w-7 h-7 rounded-full border border-tan-light flex items-center justify-center text-charcoal/60 hover:border-copper hover:text-copper transition-colors duration-150 text-base leading-none font-sans"
                    >−</button>
                    <span className="text-sm font-semibold min-w-[1.25rem] text-center font-sans">{q}</span>
                    <button
                      onClick={() => changeQty(item.id, 1)}
                      className="w-7 h-7 rounded-full border border-tan-light flex items-center justify-center text-charcoal/60 hover:border-copper hover:text-copper transition-colors duration-150 text-base leading-none font-sans"
                    >＋</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Step 4: Customer Info */}
        <div className="bg-white rounded-2xl border border-tan-light p-6 shadow-sm">
          <h3 className="font-display text-lg text-charcoal mb-5 flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-charcoal text-ivory text-xs flex items-center justify-center font-sans font-semibold shrink-0">4</span>
            {t('s4', lang)}
          </h3>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>{t('lname', lang)}</label>
              <input type="text" className={inputCls} placeholder={t('namePh', lang)} value={name} onChange={(e) => setName(e.target.value)} />
              {errors.name && <p className={errCls}>{t('ename', lang)}</p>}
            </div>
            <div>
              <label className={labelCls}>{t('lphone', lang)}</label>
              <input type="tel" className={inputCls} placeholder={t('phonePh', lang)} value={phone} onChange={(e) => setPhone(e.target.value)} />
              {errors.phone && <p className={errCls}>{t('ephone', lang)}</p>}
            </div>
            <div>
              <label className={labelCls}>{t('lnote', lang)}<span className="text-charcoal/40 normal-case">{t('opt', lang)}</span></label>
              <textarea rows={3} className={`${inputCls} resize-none`} placeholder={t('notePh', lang)} value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Total bar */}
        <div className="bg-charcoal rounded-2xl px-6 py-5 flex justify-between items-center">
          <span className="text-ivory/60 text-xs tracking-widest uppercase font-sans">{t('total', lang)}</span>
          <span className="text-ivory text-2xl font-display font-light">₩{total.toLocaleString()}</span>
        </div>

        {/* Notice */}
        <p className="text-xs text-charcoal/50 bg-ivory-2 rounded-xl px-5 py-4 leading-relaxed font-sans">
          ※ {t('notice', lang)}
        </p>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-warm-brown to-copper text-ivory text-sm tracking-widest uppercase rounded-2xl font-sans font-semibold hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 shadow-lg shadow-copper/20"
        >
          {loading ? t('submitting', lang) : t('submit', lang)}
        </button>

        <p className="text-center text-[10px] text-charcoal/30 font-sans pb-4">
          해울 HAEUL — Since 1988
        </p>
      </div>
    </div>
  )
}
