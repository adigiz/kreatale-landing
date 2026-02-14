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
  websiteName: "Premium Car Rental",
  heroTitle: "Drive Your Dreams",
  heroSubtitle: "Premium car rental for your special occasions",
  primaryColor: "#0f172a",
  currency: "Rp",
  price: "1,200",
  days: "Daily",
  location: "Jakarta",
  logo: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=100&h=100",
  heroImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80",
  destinations: [
    {
      name: "Luxury Sedan",
      region: "Premium Class",
      description: "Elegant for business meetings.",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80",
      price: "1,000",
    },
    {
      name: "SUV",
      region: "Family Class",
      description: "Comfortable for long trips.",
      image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=400&q=80",
      price: "800",
    },
  ],
  packages: [
    {
      title: "BMW 5 Series",
      slug: "bmw-5-series",
      location: "Jakarta",
      duration: "Automatic",
      feature: "Leather Seats, GPS",
      price: "1,500",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
      itinerary: [
        { title: "M-Sport Package", description: "Sporty aesthetic and suspension." },
        { title: "Premium Sound", description: "Harman Kardon audio system." },
      ],
    },
  ],
};

