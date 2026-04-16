export function tourDemoPaths(locale: string, slug: string) {
  const base = `/${locale}/demos/${slug}`;
  return {
    home: base,
    destinations: `${base}/destinations`,
    experiences: `${base}/experiences`,
    travelTips: `${base}/travel-tips`,
    packages: `${base}/packages`,
  } as const;
}
