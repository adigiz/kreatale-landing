export interface TourConfig {
  logo?: string;
  primaryColor?: string;
  accentColor?: string;
  accentHoverColor?: string;
  websiteName?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroHeadline?: string;
  heroHeadlineItalic?: string;
  heroImage?: string;
  price?: string;
  currency?: string;
  days?: string;
  location?: string;
  destinations?: {
    name: string;
    slug?: string;
    image?: string;
    price?: string;
    region?: string;
    description?: string;
  }[];
  itinerary?: { day: number; title: string; description?: string }[];
  packages?: {
    title: string;
    slug?: string;
    image?: string;
    location?: string;
    duration?: string;
    feature?: string;
    price?: string;
    itinerary?: { day: number; title: string; description?: string }[];
  }[];
  experienceList?: {
    name: string;
    slug?: string;
    category?: string;
    description?: string;
    image?: string;
  }[];
  travelTips?: {
    title: string;
    slug?: string;
    excerpt?: string;
    image?: string;
    body?: string;
  }[];
  language?: "en" | "id";
}
