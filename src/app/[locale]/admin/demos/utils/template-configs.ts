export interface TemplateFieldConfig {
  label: string;
  placeholder: string;
}

export interface TemplateConfig {
  id: string;
  name: string;
  // Hero Section
  heroFields: {
    heroTitle: TemplateFieldConfig;
    heroSubtitle: TemplateFieldConfig;
    price: TemplateFieldConfig;
    currency: TemplateFieldConfig;
    days: TemplateFieldConfig;
    location: TemplateFieldConfig;
  };
  // Collection (Destinations / Categories)
  collectionTitle: string;
  collectionItemLabel: string;
  collectionFields: {
    name: TemplateFieldConfig;
    region?: TemplateFieldConfig;
    description?: TemplateFieldConfig;
    price?: TemplateFieldConfig;
  };
  // Entities (Packages / Cars)
  entityTitle: string;
  entityItemLabel: string;
  entityFields: {
    title: TemplateFieldConfig;
    slug: TemplateFieldConfig;
    location?: TemplateFieldConfig;
    duration?: TemplateFieldConfig;
    feature?: TemplateFieldConfig;
    price?: TemplateFieldConfig;
  };
  // Nested (Itinerary / Specs / Features)
  nestedTitle: string;
  nestedItemLabel: string;
  nestedFields: {
    title: TemplateFieldConfig;
    description?: TemplateFieldConfig;
    day?: TemplateFieldConfig;
  };
}

export const TEMPLATE_CONFIGS: Record<string, TemplateConfig> = {
  tour: {
    id: "tour",
    name: "Tour & Travel",
    heroFields: {
      heroTitle: { label: "Hero Title", placeholder: "Experience the Extraordinary" },
      heroSubtitle: { label: "Hero Subtitle", placeholder: "Your journey begins here..." },
      price: { label: "Spotlight Price", placeholder: "e.g. 14,200" },
      currency: { label: "Global Currency", placeholder: "Rp" },
      days: { label: "Spotlight Duration", placeholder: "7 Days" },
      location: { label: "Spotlight Location", placeholder: "Bali, Indonesia" },
    },
    collectionTitle: "Destinations / Collections",
    collectionItemLabel: "Destination",
    collectionFields: {
      name: { label: "Name", placeholder: "e.g. Ubud" },
      region: { label: "Region", placeholder: "e.g. Europe" },
      description: { label: "Description", placeholder: "Short description..." },
      price: { label: "Starting Price", placeholder: "e.g. 1,000" },
    },
    entityTitle: "Curated Tour Packages",
    entityItemLabel: "Package",
    entityFields: {
      title: { label: "Title", placeholder: "Amalfi Coast Escape" },
      slug: { label: "Slug", placeholder: "amalfi-coast" },
      location: { label: "Location", placeholder: "Italy" },
      duration: { label: "Duration", placeholder: "10 Days" },
      feature: { label: "Features", placeholder: "Business Class, 5* Hotel" },
      price: { label: "Price", placeholder: "14,200" },
    },
    nestedTitle: "Package Itinerary",
    nestedItemLabel: "Day",
    nestedFields: {
      title: { label: "Day Title", placeholder: "e.g. Arrival in Amalfi" },
      description: { label: "Description", placeholder: "e.g. Check in to your luxury hotel..." },
      day: { label: "Day Number", placeholder: "1" },
    },
  },
  car: {
    id: "car",
    name: "Car Rental",
    heroFields: {
      heroTitle: { label: "Hero Title", placeholder: "Drive Your Dreams" },
      heroSubtitle: { label: "Hero Subtitle", placeholder: "Explore the roads with comfort..." },
      price: { label: "Featured Daily Rate", placeholder: "e.g. 800" },
      currency: { label: "Currency", placeholder: "Rp" },
      days: { label: "Service Availability", placeholder: "24/7 Support" },
      location: { label: "Pickup Location", placeholder: "Jakarta International Airport" },
    },
    collectionTitle: "Car Categories",
    collectionItemLabel: "Category",
    collectionFields: {
      name: { label: "Category Name", placeholder: "e.g. Luxury SUV" },
      region: { label: "Class", placeholder: "e.g. Premium" },
      description: { label: "Benefits", placeholder: "e.g. Unlimited mileage..." },
      price: { label: "Base Daily Rate", placeholder: "e.g. 500" },
    },
    entityTitle: "Vehicle Fleet",
    entityItemLabel: "Vehicle",
    entityFields: {
      title: { label: "Model Name", placeholder: "BMW X5" },
      slug: { label: "Slug", placeholder: "bmw-x5-2024" },
      location: { label: "Availability", placeholder: "Jakarta, Bali" },
      duration: { label: "Engine / Fuel", placeholder: "Petrol / Diesel" },
      feature: { label: "Specifications", placeholder: "Automatic, Leather Seats" },
      price: { label: "Daily Rate", placeholder: "1,200" },
    },
    nestedTitle: "Vehicle Features / Highlights",
    nestedItemLabel: "Feature",
    nestedFields: {
      title: { label: "Feature Title", placeholder: "e.g. Panoramic Sunroof" },
      description: { label: "Details", placeholder: "e.g. Electric sliding glass..." },
    },
  },
};

export const DUMMY_CAR_CONFIG = {
  slug: "premium-car-rental-demo",
  websiteName: "Velocitá",
  heroTitle: "Drive Your Dreams",
  heroSubtitle: "Premium car rental for your special occasions",
  primaryColor: "#256af4",
  currency: "$",
  price: "1,200",
  days: "Daily",
  location: "Los Angeles",
  heroImage: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070",
  destinations: [
    {
      name: "Ferrari Roma",
      region: "Grand Tourer",
      description: "Maranello's finest. A legacy of racing DNA infused into every curve.",
      image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80",
      price: "1,200",
    },
    {
      name: "Range Rover Autobiography",
      region: "Luxury SUV",
      description: "British luxury refined. Commanding presence with sophisticated capability.",
      image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80",
      price: "900",
    },
    {
      name: "Porsche 911 GT3",
      region: "Track Precision",
      description: "Stuttgart's engineering marvel. Timeless design meets track performance.",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
      price: "1,100",
    },
    {
      name: "Lamborghini Huracán",
      region: "Supercar",
      description: "Sant'Agata's raging bull. Bold, aggressive, undeniably powerful.",
      image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80",
      price: "1,500",
    },
    {
      name: "Mercedes-Benz S-Class",
      region: "Executive Sedan",
      description: "German precision. The pinnacle of automotive luxury and technology.",
      image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80",
      price: "800",
    },
    {
      name: "BMW M4",
      region: "Sports Coupe",
      description: "Bavarian performance. Perfect balance of power and elegance.",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
      price: "950",
    },
  ],
  packages: [
    {
      title: "Ferrari",
      slug: "ferrari",
      location: "Maranello",
      duration: "V8 / V12",
      feature: "Racing Heritage",
      price: "1,200",
      image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80",
      itinerary: [
        { day: 1, title: "Racing DNA", description: "Maranello's finest. A legacy of racing DNA infused into every curve and engine note." },
      ],
    },
    {
      title: "Porsche",
      slug: "porsche",
      location: "Stuttgart",
      duration: "Flat-6",
      feature: "Track Performance",
      price: "1,100",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
      itinerary: [
        { day: 1, title: "Engineering Excellence", description: "Stuttgart's engineering marvels. Timeless design meets unparalleled track performance." },
      ],
    },
    {
      title: "Lamborghini",
      slug: "lamborghini",
      location: "Sant'Agata",
      duration: "V10 / V12",
      feature: "Aggressive Design",
      price: "1,500",
      image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80",
      itinerary: [
        { day: 1, title: "Raging Bull", description: "Sant'Agata's raging bulls. Bold, aggressive, and undeniably powerful statement pieces." },
      ],
    },
    {
      title: "Range Rover",
      slug: "range-rover",
      location: "United Kingdom",
      duration: "V6 / V8",
      feature: "Luxury SUV",
      price: "900",
      image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80",
      itinerary: [
        { day: 1, title: "British Luxury", description: "British luxury refined. Commanding presence with sophisticated off-road capability." },
      ],
    },
  ],
};

