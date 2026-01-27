import { db, locations, categories } from "../src/lib/cms/db";

async function seed() {
  console.log("Seeding locations...");
  
  await db.insert(locations).values([
    { name: "Samarinda", slug: "samarinda", country: "Indonesia" },
    { name: "Queensland", slug: "queensland", country: "Australia" },
    { name: "Cibubur", slug: "cibubur", country: "Indonesia" }
  ]).onConflictDoNothing();

  console.log("Seeding categories...");
  
  await db.insert(categories).values([
    { name: "Coffee Shop", slug: "coffee-shop", searchTerm: "Coffee shop" },
    { name: "Restaurant", slug: "restaurant", searchTerm: "Restaurant" },
    { name: "Hotel", slug: "hotel", searchTerm: "Hotel" },
    { name: "Gym", slug: "gym", searchTerm: "Gym" },
    { name: "Real Estate Agency", slug: "real-estate", searchTerm: "Real estate agency" },
    { name: "Dental Clinic", slug: "dental-clinic", searchTerm: "Dental clinic" },
    { name: "Law Firm", slug: "law-firm", searchTerm: "Law firm" },
    { name: "Software House", slug: "software-house", searchTerm: "Software company" },
    { name: "Marketing Agency", slug: "marketing-agency", searchTerm: "Marketing agency" },
    { name: "Accounting Firm", slug: "accounting-firm", searchTerm: "Accounting firm" },
    { name: "Car Repair", slug: "car-repair", searchTerm: "Car repair shop" },
    { name: "Beauty Salon", slug: "beauty-salon", searchTerm: "Beauty salon" },
    { name: "Barbershop", slug: "barbershop", searchTerm: "Barbershop" },
    { name: "School", slug: "school", searchTerm: "School" },
    // Medical & Healthcare
    { name: "Hospital", slug: "hospital", searchTerm: "Hospital" },
    { name: "Pharmacy", slug: "pharmacy", searchTerm: "Pharmacy" },
    { name: "Chiropractor", slug: "chiropractor", searchTerm: "Chiropractor" },
    { name: "Physiotherapist", slug: "physiotherapist", searchTerm: "Physiotherapist" },
    { name: "Veterinarian", slug: "veterinarian", searchTerm: "Veterinary clinic" },

    // Home Services
    { name: "Plumber", slug: "plumber", searchTerm: "Plumber" },
    { name: "Electrician", slug: "electrician", searchTerm: "Electrician" },
    { name: "HVAC Contractor", slug: "hvac", searchTerm: "HVAC contractor" },
    { name: "Roofing Contractor", slug: "roofing", searchTerm: "Roofing contractor" },
    { name: "Cleaning Service", slug: "cleaning-service", searchTerm: "Cleaning service" },
    { name: "Interior Designer", slug: "interior-designer", searchTerm: "Interior designer" },

    // Retail & Shopping
    { name: "Clothing Store", slug: "clothing-store", searchTerm: "Clothing store" },
    { name: "Electronics Store", slug: "electronics-store", searchTerm: "Electronics store" },
    { name: "Supermarket", slug: "supermarket", searchTerm: "Supermarket" },
    { name: "Furniture Store", slug: "furniture-store", searchTerm: "Furniture store" },
    { name: "Florist", slug: "florist", searchTerm: "Florist" },
    { name: "Jewelry Store", slug: "jewelry-store", searchTerm: "Jewelry store" },
    { name: "Bookstore", slug: "bookstore", searchTerm: "Bookstore" },
    { name: "Pet Store", slug: "pet-store", searchTerm: "Pet store" },

    // Automotive
    { name: "Car Dealer", slug: "car-dealer", searchTerm: "Car dealer" },
    { name: "Car Rental", slug: "car-rental", searchTerm: "Car rental agency" },
    { name: "Car Wash", slug: "car-wash", searchTerm: "Car wash" },
    { name: "Tire Shop", slug: "tire-shop", searchTerm: "Tire shop" },

    // Hospitality & Entertainment
    { name: "Night Club", slug: "night-club", searchTerm: "Night club" },
    { name: "Bar", slug: "bar", searchTerm: "Bar" },
    { name: "Cinema", slug: "cinema", searchTerm: "Movie theater" },
    { name: "Travel Agency", slug: "travel-agency", searchTerm: "Travel agency" },
    { name: "Event Planner", slug: "event-planner", searchTerm: "Event planner" },

    // Fitness & Wellness
    { name: "Yoga Studio", slug: "yoga-studio", searchTerm: "Yoga studio" },
    { name: "Pilates Studio", slug: "pilates-studio", searchTerm: "Pilates studio" },
    { name: "Spa", slug: "spa", searchTerm: "Day spa" },

    // Professional Services
    { name: "Insurance Agency", slug: "insurance-agency", searchTerm: "Insurance agency" },
    { name: "Consulting Firm", slug: "consulting-firm", searchTerm: "Business management consultant" },
    { name: "Architect", slug: "architect", searchTerm: "Architect" },
    { name: "Graphic Designer", slug: "graphic-designer", searchTerm: "Graphic designer" },
    { name: "Photographer", slug: "photographer", searchTerm: "Photographer" },

    // Construction & Real Estate
    { name: "Construction Company", slug: "construction-company", searchTerm: "Construction company" },
    { name: "Coworking Space", slug: "coworking-space", searchTerm: "Coworking space" }
  ]).onConflictDoNothing();

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
