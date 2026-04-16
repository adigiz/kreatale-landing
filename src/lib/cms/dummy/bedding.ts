/**
 * Bedding storefront demo — visual alignment with live SOJAO (sojao.shop):
 * brand colors from their theme CSS, Shopify + sojao.shop CDN imagery, and
 * product names/prices drawn from their public catalog. For portfolio/demo use.
 */
export const DUMMY_BEDDING_CONFIG = {
  slug: "organic-bedding-demo",
  websiteName: "SOJAO",
  /** Header / nav logo (SOJAO master mark). */
  logo: "https://sojao.shop/cdn/shop/files/SOJAO_Master_Logo-06_500x_df0e9ff4-b2e0-4807-afaa-24552a6c156f.png?v=1672930756&width=320",
  heroSubtitle: "Organic cotton bedding & bath — demo styled to match sojao.shop.",
  heroImage:
    "https://sojao.shop/cdn/shop/files/SOJAO-cedar-brown-cedar-pinstripes-organic-cotton-sheets-homepage-desktop.jpg?v=1768607459&width=1600",
  /** Theme tokens: --button-background-primary / --header-text on sojao.shop */
  primaryColor: "#29378c",
  currency: "S$",
  language: "en" as const,

  announcements: [
    "Free express shipping to APAC countries on orders above SGD 450*",
    "Same day in-store pick up available",
    "New in — Classic Cedar & Cedar Pinstripes",
    "Free delivery in Singapore with no minimum spend",
  ],

  heroSlides: [
    {
      title: "Cedar & Cedar Pinstripes",
      subtitle: "A refined take on a timeless look",
      kicker: "New in",
      image:
        "https://sojao.shop/cdn/shop/files/SOJAO-cedar-brown-cedar-pinstripes-organic-cotton-sheets-homepage-desktop.jpg?v=1768607459&width=2400",
      ctaLabel: "Shop now",
      collectionSlug: "classic-sheets",
    },
    {
      title: "Life & Lounge",
      subtitle: "Soft versatile pieces for everyday living",
      kicker: "Life & lounge",
      image:
        "https://sojao.shop/cdn/shop/files/SOJAO-organic-loungewear-tote-bags-homepage-desktop.jpg?v=1774950078&width=2400",
      ctaLabel: "Shop now",
      collectionSlug: "loungewear",
    },
    {
      title: "Navy Pinstripes & Cedar",
      subtitle: "A crowd favourite restocked",
      kicker: "Bedding",
      image:
        "https://sojao.shop/cdn/shop/files/SOJAO-navy-pinstripes-blue-cedar-brown-organic-cotton-sheets-homepage-mobile.jpg?v=1774863308&width=2400",
      ctaLabel: "Shop now",
      collectionSlug: "classic-sheets",
    },
    {
      title: "Chestnut & Sage",
      subtitle: "Comfort-rooted throws for your everyday",
      kicker: "Home",
      image:
        "https://sojao.shop/cdn/shop/files/SOJAO-fringe-ombre-throws-sage-green-chestnut-homepage-desktop.jpg?v=1774863818&width=2400",
      ctaLabel: "Shop now",
      collectionSlug: "throws",
    },
  ],

  bestsellerBlocks: [
    {
      title: "Classic Sheets",
      tagline: "Soft and breathable for everyday rest",
      image:
        "https://sojao.shop/cdn/shop/files/SOJAO-Bestseller-Image-Sheets-Stack.jpg?v=1768607758&width=1600",
      ctaLabel: "Shop bedding",
      collectionSlug: "classic-sheets",
    },
    {
      title: "Plush Towels",
      tagline: "To luxuriously elevate your shower routine",
      image:
        "https://sojao.shop/cdn/shop/files/SOJAO-Bestseller-Image-Towels.jpg?v=1752119506&width=1600",
      ctaLabel: "Shop towels",
      collectionSlug: "bath-towels",
    },
    {
      title: "Loungewear",
      tagline: "Everyday essentials for home or out",
      image:
        "https://sojao.shop/cdn/shop/files/SOJAO-Bestseller-Image-Loungewear-Moss.jpg?v=1768607766&width=1600",
      ctaLabel: "Shop loungewear",
      collectionSlug: "loungewear",
    },
  ],

  mixMatchSection: {
    eyebrow: "Mix & match your sets",
    title: "Endless possibilities await.",
    body: "Build sheet sets, bundles, and layers in the tones you love — same spirit as SOJAO’s bed builder.",
    ctaLabel: "Let's start building",
    collectionSlug: "classic-sheets",
    imageSrc:
      "https://sojao.shop/cdn/shop/files/SOJAO-Homepage-Grid-Image.jpg?v=1752119506&width=1800",
  },

  valuesSection: {
    title: "Our sheets are ethically-made and organic, with people and planet in mind",
    body: "GOTS-certified organic cotton, thoughtful mills, and packaging designed to tread lighter — mirrored from the live storefront story.",
    ctaLabel: "Read more about our pledge to sustainability",
    href: "https://sojao.shop/pages/sustainability",
    imageSrc:
      "https://sojao.shop/cdn/shop/files/SOJAO-sustainability-organic-cotton-blue.png?v=1680752241&width=900",
  },

  socialSection: {
    hashtag: "#hustlehardsleepeasy",
    body: "Join our tribe and share SOJAO in the wild.",
    handle: "@sojaoshop",
    instagramUrl: "https://www.instagram.com/sojaoshop",
  },

  navCategories: [
    {
      label: "Bedding",
      slug: "classic-sheets",
      mega: {
        columns: [
          {
            title: "All bed sheets",
            links: [
              { label: "Fitted sheets", collectionSlug: "classic-sheets" },
              { label: "Duvet covers", collectionSlug: "classic-sheets" },
              { label: "Quilts & duvets", collectionSlug: "classic-sheets" },
              { label: "Pillow cases", collectionSlug: "classic-sheets" },
              { label: "Bolster cases", collectionSlug: "classic-sheets" },
              { label: "Body pillow cases", collectionSlug: "classic-sheets" },
              { label: "Flat sheets", collectionSlug: "classic-sheets" },
              { label: "Baby cot sheets", collectionSlug: "classic-sheets" },
              { label: "Shop all", collectionSlug: "classic-sheets" },
            ],
          },
          {
            title: "Shop by fabric",
            links: [
              {
                label: "Classic Sateen",
                description: "Buttery-smooth and super soft organic cotton bedding",
                collectionSlug: "classic-sheets",
              },
              {
                label: "Crisp Percale",
                description: "Extra breathable and lightweight",
                collectionSlug: "classic-sheets",
              },
              { label: "Last call!", collectionSlug: "classic-sheets" },
            ],
          },
          {
            title: "Bedding sets",
            links: [
              { label: "Build your set", collectionSlug: "classic-sheets" },
              { label: "Duvet bundle sets", collectionSlug: "classic-sheets" },
              { label: "Quilt bundle sets", collectionSlug: "classic-sheets" },
              { label: "Fitted sheet sets", collectionSlug: "classic-sheets" },
              { label: "Duvet sets", collectionSlug: "classic-sheets" },
              { label: "Quilt sets", collectionSlug: "classic-sheets" },
              { label: "Flat sheet sets", collectionSlug: "classic-sheets" },
            ],
          },
        ],
        featured: {
          image:
            "https://sojao.shop/cdn/shop/files/CEDAR_PINSTRIPES_61a8ddd5-e301-47c3-be79-5ec18b1702b7.jpg?v=1761967452&width=1200",
          title: "New in — Cedar & Cedar Pinstripes",
          collectionSlug: "classic-sheets",
        },
        featuredSecondary: {
          image:
            "https://cdn.shopify.com/s/files/1/2125/3819/files/sojao-organic-cotton-classic-sateen-cedar-red-duvet-cover_fc24c90b-2408-4de1-a1d4-14aa7ab62d19.jpg?v=1761881329&width=1200",
          title: "Shop quilts & blankets",
          collectionSlug: "classic-sheets",
        },
      },
    },
    {
      label: "Bath",
      slug: "bath-towels",
      mega: {
        columns: [
          {
            title: "Bath",
            links: [
              { label: "Bath towels", collectionSlug: "bath-towels" },
              { label: "Hand towels", collectionSlug: "bath-towels" },
              { label: "Face towels", collectionSlug: "bath-towels" },
              { label: "Towel bundles", collectionSlug: "bath-towels" },
              { label: "Shop all bath", collectionSlug: "bath-towels" },
            ],
          },
        ],
        featured: {
          image:
            "https://sojao.shop/cdn/shop/files/SOJAO-shop-face-towels.jpg?v=1768788611&width=900",
          title: "Face towels · towel bundles",
          subtitle: "Frost towels",
          collectionSlug: "bath-towels",
        },
      },
    },
    {
      label: "Loungewear",
      slug: "loungewear",
      mega: {
        columns: [
          {
            title: "Life & lounge",
            links: [
              { label: "Women’s loungewear", collectionSlug: "loungewear" },
              { label: "Men’s loungewear", collectionSlug: "loungewear" },
              { label: "Shop all", collectionSlug: "loungewear" },
            ],
          },
          {
            title: "More",
            links: [
              { label: "Tote bags", collectionSlug: "loungewear" },
              { label: "Pet quilts", collectionSlug: "throws" },
            ],
          },
        ],
        featured: {
          image:
            "https://sojao.shop/cdn/shop/files/SOJAO-loungewear-Mens.png?v=1774835212&width=900",
          title: "Shop men’s loungewear",
          subtitle: "Soft layers for every day",
          collectionSlug: "loungewear",
        },
      },
    },
    {
      label: "Home decor",
      slug: "throws",
      mega: {
        columns: [
          {
            title: "Home decor",
            links: [
              { label: "Throws", collectionSlug: "throws" },
              { label: "Floor mats", collectionSlug: "throws" },
              { label: "Cushion covers", collectionSlug: "throws" },
              { label: "Table cloth & napkins", collectionSlug: "throws" },
              { label: "Shop all", collectionSlug: "throws" },
            ],
          },
        ],
        featured: {
          image:
            "https://sojao.shop/cdn/shop/files/SOJAO-home-decor-throws-mustard.jpg?v=1713919561&width=900",
          title: "Shop home collection",
          subtitle: "Organic cotton layers",
          collectionSlug: "throws",
        },
      },
    },
  ],

  packages: [
    {
      title: "Bedding",
      slug: "classic-sheets",
      location: "Sheets & duvets",
      duration: "Classic Sateen & Percale",
      feature: "Organic cotton",
      price: "89",
      image:
        "https://sojao.shop/cdn/shop/files/SOJAO-Bestseller-Image-Sheets-Stack.jpg?v=1768607758&width=1000",
      collectionIntro:
        "GOTS-certified organic cotton sheets and layers — Classic Sateen for a buttery drape, Crisp Percale when you want a cooler hand-feel. Build sets or shop pieces à la carte.",
      itinerary: [
        {
          day: 1,
          title: "Collection",
          description: "Fitted sheets, duvet covers, pillowcases, and bundles.",
        },
      ],
    },
    {
      title: "Bath",
      slug: "bath-towels",
      location: "Towels",
      duration: "Plush organic terry",
      feature: "600 GSM feel",
      price: "60",
      image:
        "https://sojao.shop/cdn/shop/files/SOJAO-Bestseller-Image-Towels.jpg?v=1752119506&width=1000",
      collectionIntro:
        "Transform your bathroom with our plush organic cotton towels that are soft and hypoallergenic. Organic cotton can hold up to 24–27 times its weight in water, making SOJAO towels the best when it comes to absorbency.",
      itinerary: [
        {
          day: 1,
          title: "Collection",
          description: "Bath sheets, face towels, and towel bundles.",
        },
      ],
    },
    {
      title: "Loungewear",
      slug: "loungewear",
      location: "Life & lounge",
      duration: "Organic jersey & sateen",
      feature: "New season",
      price: "48",
      image:
        "https://sojao.shop/cdn/shop/files/SOJAO-Bestseller-Image-Loungewear-Moss.jpg?v=1768607766&width=1000",
      collectionIntro:
        "Organic cotton loungewear for slow mornings and easy evenings — breathable layers in the same fabrics you trust for bed.",
      itinerary: [
        {
          day: 1,
          title: "Collection",
          description: "Shirts, shorts, and sets for slow days.",
        },
      ],
    },
    {
      title: "Throws & decor",
      slug: "throws",
      location: "Home",
      duration: "Throws & layers",
      feature: "Texture & warmth",
      price: "188",
      image:
        "https://sojao.shop/cdn/shop/files/SOJAO-home-decor-throws-mustard.jpg?v=1713919561&width=1000",
      collectionIntro:
        "Texture-forward throws and home layers — cable knits, ombre fringes, and organic cotton you can feel good about in every room.",
      itinerary: [
        {
          day: 1,
          title: "Collection",
          description: "Cable knits, ombre throws, and more.",
        },
      ],
    },
  ],

  destinations: [
    {
      name: "Classic Cedar Duvet Cover",
      slug: "classic-cedar-duvet-cover",
      brandSlug: "classic-sheets",
      region: "Classic Sateen",
      description:
        "Buttery-smooth organic cotton sateen in Cedar — coconut shell buttons and internal ties.",
      image:
        "https://cdn.shopify.com/s/files/1/2125/3819/files/sojao-organic-cotton-classic-sateen-cedar-red-duvet-cover_fc24c90b-2408-4de1-a1d4-14aa7ab62d19.jpg?v=1761881329",
      price: "144",
    },
    {
      name: "Classic Navy Pinstripes Fitted Sheet (Last Call)",
      slug: "classic-navy-pinstripes-fitted-sheet-last-call",
      brandSlug: "classic-sheets",
      region: "Classic Sateen",
      description:
        "Deep pockets, labeled sides, and the signature navy pinstripe — a SOJAO bestseller.",
      image:
        "https://cdn.shopify.com/s/files/1/2125/3819/files/sojao-organic-cotton-sheet-set-classic-sateen-navy-pinstripes-blue-ms.jpg?v=1725245678",
      price: "124.80",
    },
    {
      name: "Classic Cedar Fitted Sheet",
      slug: "classic-cedar-fitted-sheet",
      brandSlug: "classic-sheets",
      region: "Classic Sateen",
      description: "Warm cedar tone with the same soft drape as the rest of the Classic line.",
      image:
        "https://cdn.shopify.com/s/files/1/2125/3819/files/sojao-organic-cotton-classic-sateen-cedar-red-fitted-sheet-pillow-case-midshot_fcdf750e-4eee-425c-92a3-7e68d0ecb078.jpg?v=1761881717",
      price: "106",
    },
    {
      name: "Classic Cedar Pillow Case Pair",
      slug: "classic-cedar-pillow-case-pair",
      brandSlug: "classic-sheets",
      region: "Classic Sateen",
      description: "Envelope closure and a finish that stays smooth wash after wash.",
      image:
        "https://cdn.shopify.com/s/files/1/2125/3819/files/sojao-organic-cotton-classic-sateen-cedar-red-pillow-case_5242d47f-5da7-45fb-b17a-f7cc8f202430.jpg?v=1761881537",
      price: "48",
    },
    {
      name: "Organic Bath Towel",
      slug: "organic-cotton-bath-towels",
      brandSlug: "bath-towels",
      region: "Frost",
      description:
        "Dense loops and a quick-drying core — the everyday SOJAO bath towel in plush organic terry.",
      image:
        "https://cdn.shopify.com/s/files/1/2125/3819/files/sojao-organic-cotton-bath-towel-frost-cu.jpg?v=1773375383",
      gallery: [
        "https://cdn.shopify.com/s/files/1/2125/3819/files/sojao-organic-cotton-bath-towel-frost-cu.jpg?v=1773375383",
        "https://cdn.shopify.com/s/files/1/2125/3819/files/sojao-organic-cotton-mix-and-match-couple-towel-bundle.jpg?v=1725256784",
      ],
      swatches: ["Frost", "White", "Stone", "Natural"],
      price: "60",
    },
    {
      name: "Organic Hand Towel",
      slug: "organic-hand-towel",
      brandSlug: "bath-towels",
      region: "Stone",
      description: "Generous hand towel with the same organic terry as our bath line — soft, absorbent, and made to last.",
      image:
        "https://sojao.shop/cdn/shop/files/SOJAO-Bestseller-Image-Towels.jpg?v=1752119506&width=1000",
      gallery: [
        "https://sojao.shop/cdn/shop/files/SOJAO-Bestseller-Image-Towels.jpg?v=1752119506&width=1000",
        "https://cdn.shopify.com/s/files/1/2125/3819/files/sojao-organic-cotton-bath-towel-frost-cu.jpg?v=1773375383",
      ],
      swatches: ["Stone", "Frost", "White", "Natural"],
      price: "32",
    },
    {
      name: "Organic Face Towel Pair",
      slug: "organic-face-towel-pair",
      brandSlug: "bath-towels",
      region: "Frost",
      description: "Two face towels — compact, quick-drying, and gentle on sensitive skin.",
      image:
        "https://sojao.shop/cdn/shop/files/SOJAO-shop-face-towels.jpg?v=1768788611&width=1200",
      gallery: [
        "https://sojao.shop/cdn/shop/files/SOJAO-shop-face-towels.jpg?v=1768788611&width=1200",
        "https://cdn.shopify.com/s/files/1/2125/3819/files/sojao-organic-cotton-bath-towel-frost-cu.jpg?v=1773375383",
      ],
      swatches: ["Stone", "Frost", "White", "Natural"],
      price: "20",
    },
    {
      name: "Organic Essentials Towel Bundle",
      slug: "organic-essentials-towel-bundle",
      brandSlug: "bath-towels",
      region: "Bundle",
      badgeLabel: "8% OFF",
      description: "Curated bundle of bath and hand towels — everything you need to refresh a bathroom in one go.",
      image:
        "https://cdn.shopify.com/s/files/1/2125/3819/files/sojao-organic-cotton-mix-and-match-couple-towel-bundle.jpg?v=1725256784",
      gallery: [
        "https://cdn.shopify.com/s/files/1/2125/3819/files/sojao-organic-cotton-mix-and-match-couple-towel-bundle.jpg?v=1725256784",
        "https://cdn.shopify.com/s/files/1/2125/3819/files/sojao-organic-cotton-mix-and-match-family-towel-bundle.jpg?v=1763438446",
      ],
      swatches: ["White", "Natural", "Stone", "Frost"],
      price: "103.04",
    },
    {
      name: "Organic Bath Towel Couple (Bundle of 2)",
      slug: "organic-towel-couple-bundle",
      brandSlug: "bath-towels",
      region: "Bundle",
      badgeLabel: "6% OFF",
      description: "Mix-and-match couple set for his & hers or guest baths.",
      image:
        "https://cdn.shopify.com/s/files/1/2125/3819/files/sojao-organic-cotton-mix-and-match-couple-towel-bundle.jpg?v=1725256784",
      gallery: [
        "https://cdn.shopify.com/s/files/1/2125/3819/files/sojao-organic-cotton-mix-and-match-couple-towel-bundle.jpg?v=1725256784",
        "https://cdn.shopify.com/s/files/1/2125/3819/files/sojao-organic-cotton-bath-towel-frost-cu.jpg?v=1773375383",
      ],
      swatches: ["Frost", "White", "Stone", "Natural"],
      price: "112.80",
    },
    {
      name: "Organic Bath Towel Family (Bundle of 4)",
      slug: "organic-towel-family-bundle",
      brandSlug: "bath-towels",
      region: "Bundle",
      badgeLabel: "10% OFF",
      description: "Full household refresh in coordinated frost tones.",
      image:
        "https://cdn.shopify.com/s/files/1/2125/3819/files/sojao-organic-cotton-mix-and-match-family-towel-bundle.jpg?v=1763438446",
      gallery: [
        "https://cdn.shopify.com/s/files/1/2125/3819/files/sojao-organic-cotton-mix-and-match-family-towel-bundle.jpg?v=1763438446",
        "https://cdn.shopify.com/s/files/1/2125/3819/files/sojao-organic-cotton-bath-towel-frost-cu.jpg?v=1773375383",
      ],
      swatches: ["Frost", "White", "Stone", "Natural"],
      price: "216",
    },
    {
      name: "Organic Cotton Women's Loungewear Shirt",
      slug: "womens-loungewear-shirt",
      brandSlug: "loungewear",
      region: "Cloud grey",
      description: "Classic sateen shirt cut for lounging — breathable organic cotton.",
      image:
        "https://cdn.shopify.com/s/files/1/2125/3819/files/sojao-organic-cotton-women-shirt-classic-sateen-cloud-grey.jpg?v=1773372284",
      price: "80",
    },
    {
      name: "Organic Cotton Men's Loungewear Shirt",
      slug: "mens-loungewear-shirt",
      brandSlug: "loungewear",
      region: "Navy",
      description: "Relaxed tailoring in navy Classic Sateen — desk to sofa.",
      image:
        "https://cdn.shopify.com/s/files/1/2125/3819/files/sojao-organic-cotton-men-shirt-classic-sateen-navy-blue_140976c5-2b0b-4737-aea7-8cbcdbe7db81.jpg?v=1773368087",
      price: "80",
    },
    {
      name: "Organic Cotton Women's Loungewear Shorts",
      slug: "womens-loungewear-shorts",
      brandSlug: "loungewear",
      region: "Navy",
      description: "Soft shorts with the same hand-feel as the women’s shirt line.",
      image:
        "https://cdn.shopify.com/s/files/1/2125/3819/files/sojao-organic-cotton-women-shorts-classic-sateen-navy-blue.jpg?v=1773373048",
      price: "48",
    },
    {
      name: "Cable Knit Throw",
      slug: "cable-knit-throw",
      brandSlug: "throws",
      region: "Maroon",
      description: "Chunky cable knit for cool rooms and movie nights.",
      image:
        "https://cdn.shopify.com/s/files/1/2125/3819/files/sojao-cable-knit-throw-maroon-2024-01.jpg?v=1725263480",
      price: "202",
    },
    {
      name: "Fringed Ombre Throw",
      slug: "fringe-ombre-throw",
      brandSlug: "throws",
      region: "Ombre",
      description: "Gradient fringe throw — sage, chestnut, and fog tones.",
      image:
        "https://cdn.shopify.com/s/files/1/2125/3819/files/sojao-fringed-ombre-throw-group-2025.jpg?v=1765272934",
      price: "188",
    },
  ],
};
