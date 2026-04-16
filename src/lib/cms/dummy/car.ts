/** Sample car-rental CMS config for static demo + admin "fill sample". */
export const DUMMY_CAR_CONFIG = {
  slug: "premium-car-rental-demo",
  websiteName: "Velocitá",
  heroTitle: "Drive Your Dreams",
  heroSubtitle: "Premium daily and weekend rentals in Los Angeles.",
  primaryColor: "#256af4",
  currency: "$",
  price: "1,200",
  days: "Daily from",
  location: "Los Angeles, CA",
  heroImage: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070",
  destinations: [
    {
      name: "Ferrari Roma",
      slug: "ferrari-roma",
      brandSlug: "ferrari",
      region: "Grand Tourer",
      description:
        "Italian V8 grand tourer—striking design with everyday usability for coastal and canyon drives.",
      image:
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80",
      price: "1,200",
      specs: {
        acceleration: "3.4 s",
        topSpeed: "320 km/h",
        power: "620 hp",
        transmission: "8-speed DCT",
      },
      features: [
        "Magnetic dampers & drive-mode selector",
        "Twin digital displays with Apple CarPlay",
        "Front-axle lift for steep driveways",
        "Premium leather & carbon interior trim",
      ],
      inclusions: [
        "200 miles included per rental day",
        "Condition report & photo set at handover",
        "Insurance packages selectable at checkout",
        "Concierge delivery in Greater Los Angeles",
      ],
      gallery: [
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1489827908967-279e45a56f06?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1503736334955-14e9b29e0919?auto=format&fit=crop&w=1600&q=80",
      ],
    },
    {
      name: "Range Rover Autobiography",
      slug: "range-rover-autobiography",
      brandSlug: "range-rover",
      region: "Luxury SUV",
      description:
        "Full-size luxury SUV with commanding presence—ideal for groups and L.A. arrivals.",
      image:
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80",
      price: "900",
      specs: {
        acceleration: "5.3 s",
        topSpeed: "225 km/h",
        power: "523 hp",
        transmission: "8-speed automatic",
      },
      features: [
        "Air suspension & terrain response",
        "Panoramic roof & four-zone climate",
        "Meridian audio & rear entertainment ready",
        "Soft-close doors & heated/cooled seats",
      ],
      inclusions: [
        "200 miles included per rental day",
        "SUV walkaround with height & camera tutorial",
        "Roadside assistance for the rental period",
        "Airport meet options on request",
      ],
      gallery: [
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=80",
      ],
    },
    {
      name: "Porsche 911 GT3",
      slug: "porsche-911-gt3",
      brandSlug: "porsche",
      region: "Track Precision",
      description:
        "Naturally aspirated precision for drivers who want feedback on Angeles Crest and beyond.",
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
      price: "1,100",
      specs: {
        acceleration: "3.2 s",
        topSpeed: "318 km/h",
        power: "502 hp",
        transmission: "7-speed PDK",
      },
      features: [
        "Rear-wheel steering & track-tuned chassis",
        "Full bucket seats & Alcantara trim",
        "Swan-neck rear wing & motorsport aero",
        "Porsche Track Precision app compatible",
      ],
      inclusions: [
        "200 miles included per rental day",
        "Track-use policy explained before keys",
        "Helmet rental partner referrals on request",
        "Performance briefing with Velocitá specialist",
      ],
      gallery: [
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1614162692292-b7ef56ec43e8?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=80",
      ],
    },
    {
      name: "Lamborghini Huracán",
      slug: "lamborghini-huracan",
      brandSlug: "lamborghini",
      region: "Supercar",
      description:
        "A statement supercar for special occasions—delivery and walkthrough included.",
      image:
        "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80",
      price: "1,500",
      specs: {
        acceleration: "2.9 s",
        topSpeed: "325 km/h",
        power: "631 hp",
        transmission: "7-speed DCT",
      },
      features: [
        "ANEMA driving modes & launch control",
        "Carbon-ceramic brakes & forged wheels",
        "Alcantara & contrast stitching throughout",
        "Transparent engine bay cover (model year dependent)",
      ],
      inclusions: [
        "200 miles included per rental day",
        "Event & photo-shoot logistics support",
        "Extended walkthrough for first-time supercar drivers",
        "Garage-height check before delivery",
      ],
      gallery: [
        "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1600&q=80",
      ],
    },
    {
      name: "Mercedes-Benz S-Class",
      slug: "mercedes-benz-s-class",
      brandSlug: "mercedes-benz",
      region: "Executive Sedan",
      description:
        "Flagship sedan for executive transport, evenings out, and airport runs in maximum comfort.",
      image:
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80",
      price: "800",
      specs: {
        acceleration: "4.4 s",
        topSpeed: "250 km/h",
        power: "496 hp",
        transmission: "9G-TRONIC",
      },
      features: [
        "Executive rear seating with massage",
        "Burmester 4D surround & ambient lighting",
        "Rear-wheel steering for tight L.A. turns",
        "MBUX augmented video & driver assists",
      ],
      inclusions: [
        "200 miles included per rental day",
        "Chauffeur introduction available on request",
        "LAX curbside handoff windows supported",
        "Bottled water & phone chargers in cabin",
      ],
      gallery: [
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80",
      ],
    },
    {
      name: "BMW M4",
      slug: "bmw-m4",
      brandSlug: "bmw",
      region: "Sports Coupe",
      description:
        "Balanced M performance for spirited canyon runs and daily L.A. driving.",
      image:
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
      price: "950",
      specs: {
        acceleration: "3.5 s",
        topSpeed: "290 km/h",
        power: "473 hp",
        transmission: "8-speed M Steptronic",
      },
      features: [
        "M Drift Analyzer & M Laptimer",
        "Carbon roof & sport exhaust (where equipped)",
        "Adaptive M suspension",
        "Live Cockpit Professional with HUD",
      ],
      inclusions: [
        "200 miles included per rental day",
        "Tire & brake wear policy explained upfront",
        "Recommended canyon routes from our team",
        "Young-driver screening per insurer rules",
      ],
      gallery: [
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1600&q=80",
      ],
    },
  ],
  packages: [
    {
      title: "Ferrari",
      slug: "ferrari",
      location: "Los Angeles",
      duration: "Roma & stablemates",
      feature: "Italian performance",
      price: "1200",
      image:
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80",
      itinerary: [
        {
          day: 1,
          title: "Fleet highlight",
          description:
            "Prancing Horse models curated for short-term rental with insured, concierge handover in L.A.",
        },
      ],
    },
    {
      title: "Porsche",
      slug: "porsche",
      location: "Los Angeles",
      duration: "911 & GT line",
      feature: "Driver-focused",
      price: "1100",
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
      itinerary: [
        {
          day: 1,
          title: "Fleet highlight",
          description:
            "Rear-engine icons and GT variants available by the day—perfect for coastal and mountain loops.",
        },
      ],
    },
    {
      title: "Lamborghini",
      slug: "lamborghini",
      location: "Los Angeles",
      duration: "Huracán & Urus",
      feature: "Head-turning",
      price: "1500",
      image:
        "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80",
      itinerary: [
        {
          day: 1,
          title: "Fleet highlight",
          description:
            "Bold super-SUV and coupe options for events, shoots, and milestone weekends.",
        },
      ],
    },
    {
      title: "Range Rover",
      slug: "range-rover",
      location: "Los Angeles",
      duration: "Autobiography",
      feature: "Luxury SUV",
      price: "900",
      image:
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80",
      itinerary: [
        {
          day: 1,
          title: "Fleet highlight",
          description:
            "Spacious, refined SUVs for families, airport transfers, and Malibu getaways.",
        },
      ],
    },
    {
      title: "Mercedes-Benz",
      slug: "mercedes-benz",
      location: "Los Angeles",
      duration: "S-Class & AMG",
      feature: "Executive comfort",
      price: "800",
      image:
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80",
      itinerary: [
        {
          day: 1,
          title: "Fleet highlight",
          description:
            "S-Class serenity and AMG muscle—chauffeur-ready or self-drive with full briefing.",
        },
      ],
    },
    {
      title: "BMW",
      slug: "bmw",
      location: "Los Angeles",
      duration: "M models",
      feature: "Balanced performance",
      price: "950",
      image:
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
      itinerary: [
        {
          day: 1,
          title: "Fleet highlight",
          description:
            "M coupes and sedans for drivers who want precision without supercar upkeep.",
        },
      ],
    },
  ],
};
