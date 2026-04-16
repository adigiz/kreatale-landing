export const PACKAGE_IMG_FALLBACK =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=3242&auto=format&fit=crop";

export function cmsField(
  value: string | undefined | null,
  fallback: string,
): string {
  if (value === undefined || value === null) return fallback;
  return value.trim();
}
