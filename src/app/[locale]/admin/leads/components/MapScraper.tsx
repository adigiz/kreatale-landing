"use client";

import { useState, useEffect } from "react";
// Dynamic import for Leaflet to work with Next.js SSR
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

import { Search, MapPin, Loader2, Navigation } from "lucide-react";

// Simple UI components to replace missing shadcn ones
const Input = ({ className, ...props }: any) => (
  <input
    className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Label = ({ className, ...props }: any) => (
  <label
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  />
);

const Slider = ({ value, onValueChange, min, max, step, className }: any) => (
  <input
    type="range"
    min={min}
    max={max}
    step={step}
    value={value[0]}
    onChange={(e) => onValueChange([parseInt(e.target.value)])}
    className={`w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary ${className}`}
  />
);

// Shared UI components
import { SearchableSelect } from "@/components/ui/searchable-select";

// Dynamically import MapContainer and related components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false },
);
const MapController = dynamic(() => import("./MapController"), { ssr: false });

// Component to programmatically move map when center changes from search
const RecenterMap = dynamic(() => import("./RecenterMap"), { ssr: false });

interface Category {
  id: string;
  name: string;
}

interface MapScraperProps {
  categories: Category[];
  onScrape: (params: {
    lat: number;
    lng: number;
    zoom: number;
    categoryId: string;
  }) => Promise<void>;
  isScraping: boolean;
}

// Default center (Jakarta)
const DEFAULT_CENTER: [number, number] = [-6.2088, 106.8456];

export default function MapScraper({
  categories,
  onScrape,
  isScraping,
}: MapScraperProps) {
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [zoomLevel, setZoomLevel] = useState<number>(15);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Approximate radius based on zoom level for circle visualization
  // Zoom 15 ~= 1km radius view
  const getRadiusFromZoom = (zoom: number) => {
    return (40000000 / (256 * Math.pow(2, zoom))) * 300; // Rough approximation
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length < 3) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery,
          )}&limit=5`,
        );
        const data = await res.json();
        setSuggestions(data || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelectLocation = (item: any) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    setCenter([lat, lon]);
    setSearchQuery(item.display_name.split(",")[0]); // Keep it short
    setShowSuggestions(false);
  };

  const handleSearch = async () => {
    // Trigger immediate search if enter pressed
    if (!searchQuery) return;
    // Logic is handled by debounce, but we can force it here if needed
    // For now, let's just make sure suggestions are hidden if we "submit"
    setShowSuggestions(false);
  };

  const handleScrapeClick = () => {
    if (!selectedCategory) {
      alert("Please select a category");
      return;
    }
    onScrape({
      lat: center[0],
      lng: center[1],
      zoom: zoomLevel,
      categoryId: selectedCategory,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Controls */}
      <div className="lg:col-span-1 space-y-6 bg-card border border-border rounded-xl p-5 shadow-sm h-fit">
        <div>
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <MapPin className="size-5 text-blue-500" />
            Target Area
          </h2>
          <p className="text-sm text-muted-foreground">
            Pin a location to scrape leads from.
          </p>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <Label>Search Location</Label>
          <div className="relative">
            <div className="flex gap-2">
              <Input
                placeholder="e.g. Cibubur, Bali..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                  e.key === "Enter" && handleSearch()
                }
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
              />
              <Button
                size="icon"
                variant="outline"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Search className="size-4" />
                )}
              </Button>
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover text-popover-foreground rounded-md border shadow-md z-50 max-h-[200px] overflow-y-auto">
                {suggestions.map((item: any, index: number) => (
                  <button
                    key={index}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors border-b last:border-0"
                    onClick={() => handleSelectLocation(item)}
                  >
                    <div className="font-medium truncate">
                      {item.display_name.split(",")[0]}
                    </div>
                    <div className="text-xs text-muted-foreground truncate opacity-70">
                      {item.display_name}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>Category</Label>
          <SearchableSelect
            options={categories}
            value={selectedCategory}
            onChange={setSelectedCategory}
            placeholder="Select Business Type"
          />
        </div>

        {/* Radius/Zoom Control */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Search Radius (Zoom Level: {zoomLevel})</Label>
          </div>
          <Slider
            value={[zoomLevel]}
            min={10}
            max={18}
            step={1}
            onValueChange={(vals: number[]) => setZoomLevel(vals[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>City (Wide)</span>
            <span>Neighborhood</span>
            <span>Street (Narrow)</span>
          </div>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handleScrapeClick}
          disabled={isScraping || !selectedCategory}
        >
          {isScraping ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Scraping...
            </>
          ) : (
            <>
              <Navigation className="size-4 mr-2" />
              Find Business
            </>
          )}
        </Button>
      </div>

      {/* Map */}
      <div className="lg:col-span-2 rounded-xl overflow-hidden border border-border shadow-sm bg-muted relative z-0">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <MapController
            initialCenter={center}
            onLocationSelect={(lat, lng) => setCenter([lat, lng])}
          />
          {/* Visual radius circle */}
          <Circle
            center={center}
            radius={getRadiusFromZoom(zoomLevel)}
            pathOptions={{
              color: "#0061FF",
              fillColor: "#0061FF",
              fillOpacity: 0.1,
            }}
          />
          {/* Re-center handler */}
          <RecenterMap center={center} zoom={zoomLevel} />
        </MapContainer>
      </div>
    </div>
  );
}
