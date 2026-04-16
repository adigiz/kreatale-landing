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
    entityTitle: "Popular tour packages",
    entityItemLabel: "Package",
    entityFields: {
      title: { label: "Title", placeholder: "6D3N VD Best of Tokyo + Iyashi No Sato" },
      slug: { label: "Slug", placeholder: "vdjaptok6-best-tokyo-iyashi" },
      location: { label: "Location", placeholder: "Japan" },
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
  /** Admin form labels reuse tour/car shape; bakery template reads hero + branding from config. */
  bakery: {
    id: "bakery",
    name: "Bakery / food blog",
    heroFields: {
      heroTitle: { label: "Featured recipe title", placeholder: "e.g. Strawberry Crunch Cake" },
      heroSubtitle: { label: "Short tagline / excerpt", placeholder: "Shown on demo cards and meta..." },
      price: { label: "Unused (bakery)", placeholder: "—" },
      currency: { label: "Unused (bakery)", placeholder: "—" },
      days: { label: "Unused (bakery)", placeholder: "—" },
      location: { label: "Unused (bakery)", placeholder: "—" },
    },
    collectionTitle: "Recipe categories (optional)",
    collectionItemLabel: "Category",
    collectionFields: {
      name: { label: "Name", placeholder: "e.g. Cookies" },
      description: { label: "Description", placeholder: "Optional" },
    },
    entityTitle: "Featured posts (optional)",
    entityItemLabel: "Post",
    entityFields: {
      title: { label: "Title", placeholder: "Recipe name" },
      slug: { label: "Slug", placeholder: "recipe-slug" },
      feature: { label: "Excerpt", placeholder: "Short blurb" },
    },
    nestedTitle: "Details",
    nestedItemLabel: "Step",
    nestedFields: {
      title: { label: "Title", placeholder: "Step title" },
      description: { label: "Description", placeholder: "..." },
    },
  },
  bedding: {
    id: "bedding",
    name: "Bedding / home shop",
    heroFields: {
      heroTitle: { label: "Hero title (listing card fallback)", placeholder: "Restful Linen Co." },
      heroSubtitle: { label: "Hero subtitle", placeholder: "Organic cotton bedding demo..." },
      price: { label: "Unused", placeholder: "—" },
      currency: { label: "Currency", placeholder: "$" },
      days: { label: "Unused", placeholder: "—" },
      location: { label: "Unused", placeholder: "—" },
    },
    collectionTitle: "Products (SKU rows)",
    collectionItemLabel: "Product",
    collectionFields: {
      name: { label: "Product name", placeholder: "Oat stripe duvet set" },
      region: { label: "Fabric / variant", placeholder: "Percale" },
      description: { label: "Description", placeholder: "Short PDP copy..." },
      price: { label: "Price", placeholder: "189" },
    },
    entityTitle: "Collections (PLP categories)",
    entityItemLabel: "Collection",
    entityFields: {
      title: { label: "Title", placeholder: "Classic sheets" },
      slug: { label: "Slug", placeholder: "classic-sheets" },
      location: { label: "Department", placeholder: "Bedding" },
      duration: { label: "Line detail", placeholder: "Percale & sateen" },
      feature: { label: "Highlight", placeholder: "100% organic cotton" },
      price: { label: "From price", placeholder: "89" },
    },
    nestedTitle: "Collection notes",
    nestedItemLabel: "Block",
    nestedFields: {
      title: { label: "Title", placeholder: "Collection" },
      description: { label: "Description", placeholder: "..." },
      day: { label: "Order", placeholder: "1" },
    },
  },
  fortes: {
    id: "fortes",
    name: "Fortes-style arch viz",
    heroFields: {
      heroTitle: { label: "Hero title", placeholder: "3D Rendering & Architectural Visualization" },
      heroSubtitle: { label: "Hero subtitle", placeholder: "Award-winning studio demo..." },
      price: { label: "Unused", placeholder: "—" },
      currency: { label: "Unused", placeholder: "—" },
      days: { label: "Unused", placeholder: "—" },
      location: { label: "Unused", placeholder: "—" },
    },
    collectionTitle: "Unused for this template",
    collectionItemLabel: "Item",
    collectionFields: {
      name: { label: "Name", placeholder: "—" },
      description: { label: "Description", placeholder: "—" },
    },
    entityTitle: "Unused",
    entityItemLabel: "Item",
    entityFields: {
      title: { label: "Title", placeholder: "—" },
      slug: { label: "Slug", placeholder: "—" },
    },
    nestedTitle: "Unused",
    nestedItemLabel: "Block",
    nestedFields: {
      title: { label: "Title", placeholder: "—" },
      description: { label: "Description", placeholder: "—" },
    },
  },
};

export { DUMMY_CAR_CONFIG } from "@/lib/cms/dummy/car";
