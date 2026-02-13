import { RefreshCw, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface LeadsFiltersProps {
  locations: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  selectedLocation: string;
  setSelectedLocation: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  onFilter: () => void;
  onScrape: () => void;
  isPending: boolean;
  isScraping: boolean;
  filterOptions: {
    cities: string[];
    states: string[];
    countries: string[];
    districts: string[];
  };
  selectedCity: string;
  setSelectedCity: (val: string) => void;
  selectedState: string;
  setSelectedState: (val: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (val: string) => void;
  selectedCountry: string;
  setSelectedCountry: (val: string) => void;
}

const statusOptions = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "replied", label: "Replied" },
  { value: "qualified", label: "Qualified" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
  { value: "ignored", label: "Ignored" },
];

export function LeadsFilters({
  locations,
  categories,
  selectedLocation,
  setSelectedLocation,
  selectedCategory,
  setSelectedCategory,
  statusFilter,
  setStatusFilter,
  onFilter,
  isPending,
  filterOptions,
  selectedCity,
  setSelectedCity,
  selectedState,
  setSelectedState,
  selectedDistrict,
  setSelectedDistrict,
  selectedCountry,
  setSelectedCountry,
}: LeadsFiltersProps) {
  const activeFiltersCount = [
    selectedLocation !== "all",
    selectedCategory !== "all",
    statusFilter !== "all",
    selectedCity !== "all",
    selectedState !== "all",
    selectedDistrict !== "all",
    selectedCountry !== "all",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedLocation("all");
    setSelectedCategory("all");
    setStatusFilter("all");
    setSelectedCity("all");
    setSelectedState("all");
    setSelectedDistrict("all");
    setSelectedCountry("all");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between p-4 border rounded-xl bg-card shadow-sm">
        {/* Main Search & Filters */}
        <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full">
          {/* Search Input (Placeholder for future implementation) */}
          <div className="relative w-full sm:w-64 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              className="pl-9 bg-background"
              disabled
              title="Search functionality coming soon"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <div className="w-[180px]">
              <SearchableSelect
                options={[{ id: "all", name: "All Locations" }, ...locations]}
                value={selectedLocation}
                onChange={setSelectedLocation}
                placeholder="Location"
              />
            </div>

            <div className="w-[180px]">
              <SearchableSelect
                options={[{ id: "all", name: "All Categories" }, ...categories]}
                value={selectedCategory}
                onChange={setSelectedCategory}
                placeholder="Category"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-9 bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Actions & Advanced Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto relative">
                <SlidersHorizontal className="size-4 mr-2" />
                More
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 h-5 px-1.5 min-w-[1.25rem] text-[10px]"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b">
                  <h4 className="font-medium leading-none">Advanced Filters</h4>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                      onClick={clearFilters}
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Country
                    </label>
                    <SearchableSelect
                      options={[
                        { id: "all", name: "All Countries" },
                        ...filterOptions.countries.map((c) => ({
                          id: c,
                          name: c,
                        })),
                      ]}
                      value={selectedCountry}
                      onChange={setSelectedCountry}
                      placeholder="Select Country"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      State
                    </label>
                    <SearchableSelect
                      options={[
                        { id: "all", name: "All States" },
                        ...filterOptions.states.map((s) => ({
                          id: s,
                          name: s,
                        })),
                      ]}
                      value={selectedState}
                      onChange={setSelectedState}
                      placeholder="Select State"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      City
                    </label>
                    <SearchableSelect
                      options={[
                        { id: "all", name: "All Cities" },
                        ...filterOptions.cities.map((c) => ({
                          id: c,
                          name: c,
                        })),
                      ]}
                      value={selectedCity}
                      onChange={setSelectedCity}
                      placeholder="Select City"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      District
                    </label>
                    <SearchableSelect
                      options={[
                        { id: "all", name: "All Districts" },
                        ...filterOptions.districts.map((d) => ({
                          id: d,
                          name: d,
                        })),
                      ]}
                      value={selectedDistrict}
                      onChange={setSelectedDistrict}
                      placeholder="Select District"
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            onClick={onFilter}
            disabled={isPending}
            title="Refresh List"
          >
            <RefreshCw
              className={`size-4 ${isPending ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Active Filters Summary (Optional - can be added if needed for better visibility) */}
    </div>
  );
}
