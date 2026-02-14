import { UseFormSetValue } from "react-hook-form";
import { DemoFormValues } from "../types";

export function fillTourDummyData(setValue: UseFormSetValue<DemoFormValues>) {
  setValue("heroTitle", "The Art of Verified Travel.");
  setValue(
    "heroSubtitle",
    "We don't just plan trips; we craft narratives tailored to your unique travel style.",
  );
  setValue(
    "heroImage",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop",
  );
  setValue("price", "14,200");
  setValue("currency", "$");
  setValue("days", "10 Days");
  setValue("location", "Amalfi Coast, Italy");

  setValue("currency", "Rp"); // Setting the global currency

  // Add Destinations
  const dummyDestinations = [
    {
      name: "Swiss Alps",
      region: "Europe",
      description:
        "Pristine peaks and luxury chalets for the discerning winter enthusiast.",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
    },
    {
      name: "Santorini",
      region: "Mediterranean",
      description:
        "Infinite blue horizons and architectural marvels suspended in time.",
      image:
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2070&auto=format&fit=crop",
    },
    {
      name: "Kyoto",
      region: "Asia",
      description:
        "Walk through history in the ancient capital of culture and tradition.",
      image:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop",
    },
    {
      name: "Private Villas",
      region: "Global",
      description:
        "Exclusive estates offering privacy and unparalleled luxury worldwide.",
      image:
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
    },
  ];

  setValue("destinations", dummyDestinations);

  // Add Packages
  const dummyPackages = [
    {
      title: "Amalfi Coast Escape",
      image:
        "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2070&auto=format&fit=crop",
      price: "14,200",
      location: "Italy",
      duration: "10 Days",
      feature: "Business Class",
      itinerary: [
        {
          day: 1,
          title: "Arrival in Naples",
          description: "Private transfer to Positano.",
        },
        {
          day: 2,
          title: "Path of the Gods",
          description: "Guided hike with panoramic views.",
        },
      ],
    },
    {
      title: "Timeless Kyoto",
      image:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop",
      price: "9,800",
      location: "Japan",
      duration: "9 Days",
      feature: "Zen Experience",
      itinerary: [
        {
          day: 1,
          title: "Arashiyama Zen",
          description: "Bamboo grove and temple visit.",
        },
      ],
    },
    {
      title: "Serengeti & Beyond",
      image:
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop",
      price: "12,500",
      location: "Tanzania",
      duration: "12 Days",
      feature: "Private Safari",
      itinerary: [
        {
          day: 1,
          title: "Great Migration",
          description: "Dawn safari drive.",
        },
      ],
    },
  ];

  setValue("packages", dummyPackages);
}
