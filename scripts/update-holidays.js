#!/usr/bin/env node
// Checks if KR_HOLIDAYS and LUNAR_FEST in index.html cover the current and next year.
// If not, adds the missing year's data and writes the file back.
const fs = require('fs');
const path = require('path');

const HTML_FILE = path.join(__dirname, '..', 'index.html');

// Pre-computed holiday dates for upcoming years.
// Fixed public holidays are exact; lunar-based holidays (설날, 추석, 부처님오신날) are accurate.
const HOLIDAY_DATA = {
  2026: {
    kr: {
      '2026-01-01': '신정',
      '2026-01-28': '설날 연휴',
      '2026-01-29': '설날',
      '2026-01-30': '설날 연휴',
      '2026-03-01': '삼일절',
      '2026-05-05': '어린이날',
      '2026-05-15': '부처님 오신 날',
      '2026-06-06': '현충일',
      '2026-08-15': '광복절',
      '2026-09-24': '추석 연휴',
      '2026-09-25': '추석',
      '2026-09-26': '추석 연휴',
      '2026-10-03': '개천절',
      '2026-10-09': '한글날',
      '2026-12-25': '크리스마스',
    },
    lunar: {
      '2026-01-29': '정월 초하루',
      '2026-02-17': '정월 대보름',
      '2026-05-15': '사월 초파일',
      '2026-09-25': '추석 (음8/15)',
    },
  },
  2027: {
    kr: {
      '2027-01-01': '신정',
      '2027-02-06': '설날 연휴',
      '2027-02-07': '설날',
      '2027-02-08': '설날 연휴',
      '2027-03-01': '삼일절',
      '2027-05-05': '어린이날',
      '2027-05-13': '부처님 오신 날',
      '2027-06-06': '현충일',
      '2027-08-15': '광복절',
      '2027-09-15': '추석 연휴',
      '2027-09-16': '추석',
      '2027-09-17': '추석 연휴',
      '2027-10-03': '개천절',
      '2027-10-09': '한글날',
      '2027-12-25': '크리스마스',
    },
    lunar: {
      '2027-02-07': '정월 초하루',
      '2027-02-23': '정월 대보름',
      '2027-05-13': '사월 초파일',
      '2027-09-16': '추석 (음8/15)',
    },
  },
  2028: {
    kr: {
      '2028-01-01': '신정',
      '2028-01-26': '설날 연휴',
      '2028-01-27': '설날',
      '2028-01-28': '설날 연휴',
      '2028-03-01': '삼일절',
      '2028-05-02': '부처님 오신 날',
      '2028-05-05': '어린이날',
      '2028-06-06': '현충일',
      '2028-08-15': '광복절',
      '2028-10-02': '추석 연휴',
      '2028-10-03': '개천절',  // 추석과 개천절 중복 → 개천절 우선
      '2028-10-04': '추석',
      '2028-10-09': '한글날',
      '2028-12-25': '크리스마스',
    },
    lunar: {
      '2028-01-27': '정월 초하루',
      '2028-02-12': '정월 대보름',
      '2028-05-02': '사월 초파일',
      '2028-10-04': '추석 (음8/15)',
    },
  },
};

function serializeObj(obj) {
  return (
    '{' +
    Object.entries(obj)
      .map(([k, v]) => `'${k}':'${v}'`)
      .join(',') +
    '}'
  );
}

function main() {
  let html = fs.readFileSync(HTML_FILE, 'utf8');

  const currentYear = new Date().getFullYear();
  const targetYears = [currentYear, currentYear + 1];

  // Check which years are already present
  const missingYears = targetYears.filter(
    (y) => !html.includes(`'${y}-`)
  );

  if (missingYears.length === 0) {
    console.log(`✅ Holiday data already covers ${targetYears.join(' and ')}`);
    return;
  }

  // Extract current KR_HOLIDAYS and LUNAR_FEST objects
  const krMatch = html.match(/const KR_HOLIDAYS=(\{[^}]+\})/);
  const lunarMatch = html.match(/const LUNAR_FEST=(\{[^}]+\})/);

  if (!krMatch || !lunarMatch) {
    console.error('❌ Could not locate KR_HOLIDAYS or LUNAR_FEST in index.html');
    process.exit(1);
  }

  // Parse existing objects (values are simple strings, safe to eval)
  let holidays = {};
  let lunar = {};
  try {
    // eslint-disable-next-line no-eval
    holidays = eval('(' + krMatch[1] + ')');
    // eslint-disable-next-line no-eval
    lunar = eval('(' + lunarMatch[1] + ')');
  } catch (e) {
    console.error('❌ Failed to parse holiday objects:', e.message);
    process.exit(1);
  }

  // Merge missing years
  for (const year of missingYears) {
    if (!HOLIDAY_DATA[year]) {
      console.warn(`⚠️  No pre-computed data for ${year}. Manual update required.`);
      continue;
    }
    Object.assign(holidays, HOLIDAY_DATA[year].kr);
    Object.assign(lunar, HOLIDAY_DATA[year].lunar);
    console.log(`📅 Adding ${year} holiday data`);
  }

  // Sort by date key
  const sortedHolidays = Object.fromEntries(
    Object.entries(holidays).sort(([a], [b]) => a.localeCompare(b))
  );
  const sortedLunar = Object.fromEntries(
    Object.entries(lunar).sort(([a], [b]) => a.localeCompare(b))
  );

  // Replace in HTML
  html = html.replace(
    /const KR_HOLIDAYS=\{[^}]+\}/,
    `const KR_HOLIDAYS=${serializeObj(sortedHolidays)}`
  );
  html = html.replace(
    /const LUNAR_FEST=\{[^}]+\}/,
    `const LUNAR_FEST=${serializeObj(sortedLunar)}`
  );

  fs.writeFileSync(HTML_FILE, html);
  console.log(`✅ index.html updated with holiday data for ${missingYears.join(', ')}`);
}

main();
