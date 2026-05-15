const WEEKDAYS_ZH = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

export function dateKey(isoString: string): string {
  return String(isoString).slice(0, 10);
}

export function parseDateKey(key: string): Date {
  return new Date(key + "T00:00:00");
}

export function formatCnDate(key: string): string {
  const [, m, d] = key.split("-");
  return `${parseInt(m, 10)} 月 ${parseInt(d, 10)} 日`;
}

export function weekdayCn(key: string): string {
  return WEEKDAYS_ZH[parseDateKey(key).getDay()];
}

export function yearOf(key: string): string {
  return key.slice(0, 4);
}

export function monthOf(key: string): string {
  return key.slice(0, 7);
}

export function todayKeyLocal(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export function relativeLabel(key: string, todayKey: string = todayKeyLocal()): string | null {
  if (key === todayKey) return "今天";
  const day = 86_400_000;
  const diff = Math.round(
    (parseDateKey(todayKey).getTime() - parseDateKey(key).getTime()) / day,
  );
  if (diff === 1) return "昨天";
  if (diff > 1 && diff <= 6) return `${diff} 天前`;
  return null;
}

export function formatCnLongDate(key: string): string {
  const [y, m, d] = key.split("-");
  return `${y} 年 ${parseInt(m, 10)} 月 ${parseInt(d, 10)} 日`;
}

const CHINESE_DIGITS = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

function digitsToChinese(s: string): string {
  return s
    .split("")
    .map((c) => (/\d/.test(c) ? CHINESE_DIGITS[parseInt(c, 10)] : c))
    .join("");
}

function smallChineseNumber(n: number): string {
  // 1-31 范围内,适用月/日
  if (n === 10) return "十";
  if (n < 10) return CHINESE_DIGITS[n];
  if (n < 20) return "十" + CHINESE_DIGITS[n - 10];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return CHINESE_DIGITS[tens] + "十" + (ones === 0 ? "" : CHINESE_DIGITS[ones]);
}

/** "2026-05-14" → "二〇二六年五月十四日" */
export function formalChineseDate(key: string): string {
  const [y, m, d] = key.split("-");
  return `${digitsToChinese(y)}年${smallChineseNumber(parseInt(m, 10))}月${smallChineseNumber(parseInt(d, 10))}日`;
}
