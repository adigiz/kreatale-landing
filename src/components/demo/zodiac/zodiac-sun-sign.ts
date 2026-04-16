export function getSunSignAngle(date: Date): number {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const md = m * 100 + d;

  if (md >= 1222 || md <= 119) return 270;
  if (md <= 218) return 300;
  if (md <= 320) return 330;
  if (md <= 419) return 0;
  if (md <= 520) return 30;
  if (md <= 620) return 60;
  if (md <= 722) return 90;
  if (md <= 822) return 120;
  if (md <= 922) return 150;
  if (md <= 1022) return 180;
  if (md <= 1121) return 210;
  return 240;
}

export function isValidCalendarDate(
  year: number,
  month: number,
  day: number,
): boolean {
  const dt = new Date(year, month - 1, day);
  return (
    dt.getFullYear() === year &&
    dt.getMonth() === month - 1 &&
    dt.getDate() === day
  );
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}
