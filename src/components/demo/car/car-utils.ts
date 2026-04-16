/** Parse display prices like "1,200", "$899", "Rp 2.500.000" into an integer amount. */
export function parseMoneyAmount(price: string | undefined, fallback = 0): number {
  if (price == null || price === "") return fallback;
  const digits = price.replace(/[^\d]/g, "");
  if (!digits) return fallback;
  const n = parseInt(digits, 10);
  return Number.isFinite(n) ? n : fallback;
}

/** Rental days from pick-up / drop-off; defaults to 1 when dates missing or invalid. */
export function rentalDayCount(pickup: string, dropoff: string): number {
  if (!pickup || !dropoff) return 1;
  const start = new Date(pickup);
  const end = new Date(dropoff);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 1;
  const ms = end.getTime() - start.getTime();
  if (ms <= 0) return 1;
  return Math.max(1, Math.ceil(ms / 86_400_000));
}
