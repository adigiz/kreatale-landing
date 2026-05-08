export const MAXIMA_PROGRAM_SLIDES = [
  {
    key: "0-to-3",
    /** Matches maximatherapy program slug + hero art filename. */
    slug: "0-to-3",
    /** Raster illu pair (local); SSR SVG shell from prod is identical on all routes — see download script. */
    heroIlluBg: "/maxima/reverse/illu/illu-0-to-3-bg.webp",
    heroIlluFg: "/maxima/reverse/illu/illu-0-to-3.webp",
    /** Full-bleed field behind art (matches production program tint). */
    heroBackdrop: "var(--color-yellow)",
    image: "/maxima/nav/programs/0-to-3.jpg",
    title: "Early Intervention",
    tag: "AGES 0-3",
    blurb: "Nurturing growth through play, therapy, and parent support.",
    panelBg: "var(--color-yellow-pale)",
  },
  {
    key: "3-to-18",
    slug: "3-to-18",
    heroIlluBg: "/maxima/reverse/illu/illu-3-to-18-bg.webp",
    heroIlluFg: "/maxima/reverse/illu/illu-3-to-18.webp",
    heroBackdrop: "var(--color-green)",
    image: "/maxima/nav/programs/3-to-18.jpg",
    title: "Adaptive Skills Training",
    tag: "AGES 3-18",
    blurb:
      "Helping kids help themselves through the development of essential life skills.",
    panelBg: "var(--color-green-pale)",
  },
  {
    key: "18-to-65",
    slug: "18-to-65",
    heroIlluBg: "/maxima/reverse/illu/illu-18-to-65-bg.webp",
    heroIlluFg: "/maxima/reverse/illu/illu-18-to-65.webp",
    heroBackdrop: "var(--color-pink)",
    image: "/maxima/nav/programs/18-to-65.jpg",
    title: "Workforce Development",
    tag: "AGES 18-65",
    blurb:
      "Providing individualized guidance and support that empowers people through every step of their career journey.",
    panelBg: "var(--color-pink-pale)",
  },
  {
    key: "65-plus",
    slug: "65-and-plus",
    heroIlluBg: "/maxima/reverse/illu/illu-65-and-plus-bg.webp",
    heroIlluFg: "/maxima/reverse/illu/illu-65-and-plus.webp",
    heroBackdrop: "var(--color-turquoise)",
    image: "/maxima/nav/programs/65-and-plus.jpg",
    title: "Residential Support",
    tag: "AGES 65+",
    blurb:
      "Providing compassionate support that promotes dignity, independence, and well-being.",
    panelBg: "var(--color-blue-pale)",
  },
] as const;

export const MAXIMA_NAV_PAGES = [
  { label: "Our Story", image: "/maxima/nav/pages/our-story.jpg", href: "#" },
  { label: "Careers", image: "/maxima/nav/pages/careers.jpg", href: "#" },
  { label: "FAQ", image: "/maxima/nav/pages/faq.jpg", href: "#" },
  { label: "Shop", image: "/maxima/nav/pages/shop.jpg", href: "#" },
  { label: "Contact", image: "/maxima/nav/pages/contact.jpg", href: "#contact" },
] as const;

export const MAXIMA_SERVICES = [
  {
    title: "Child Development Services",
    body:
      "Our Child Development Specialists support every child's specific developmental needs through play and partnership with families.",
  },
  {
    title: "Speech Therapy",
    body:
      "Pediatric speech therapy is a specialized intervention designed to help children develop and improve their communication skills, including speech, language, and social communication.",
  },
  {
    title: "Physical Therapy",
    body:
      "Pediatric physical therapy focuses on improving a child's movement, strength, balance, coordination, and overall physical function to support their growth and daily activities.",
  },
  {
    title: "Occupational Therapy",
    body:
      "Pediatric occupational therapy focuses on developing the foundational skills needed for daily activities, play, and independence.",
  },
] as const;

export const MAXIMA_PLAY_LEARN_GROW = [
  "p",
  "l",
  "a",
  "y",
  "l",
  "e",
  "a",
  "r",
  "n",
  "g",
  "r",
  "o",
  "w",
] as const;

export const MAXIMA_PROCESS = [
  {
    title: "Start with a Referral",
    body: "Have your Regional Center refer your child to our program to begin services.",
  },
  {
    title: "Create a Customized Plan",
    body:
      "We collaborate with families and the Individual Family Service Planning (IFSP) Team to design a plan focused on meaningful progress and everyday skills.",
  },
  {
    title: "Learn and Grow Together",
    body:
      "Services take place where your child lives, learns, and plays, ensuring skills are meaningful and functional.",
  },
] as const;
