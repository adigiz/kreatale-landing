"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";

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
  // New Filter Props
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
  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border rounded-lg bg-card/50">
        <div className="flex flex-wrap items-center gap-3">
          {/* Primary Filters (Always Visible) */}
          <div className="w-[200px]">
            <SearchableSelect
              options={[{ id: "all", name: "All Locations" }, ...locations]}
              value={selectedLocation}
              onChange={setSelectedLocation}
              placeholder="Location"
            />
          </div>

          <div className="w-[200px]">
            <SearchableSelect
              options={[{ id: "all", name: "All Categories" }, ...categories]}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="Category"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onFilter}
            disabled={isPending}
          >
            <RefreshCw
              className={`size-4 mr-2 ${isPending ? "animate-spin" : ""}`}
            />
            {isPending ? "Refreshing..." : "Apply"}
          </Button>
        </div>

        {/* Drawer Trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              <SlidersHorizontal className="size-4 mr-2" />
              More Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Leads</SheetTitle>
              <SheetDescription>
                Refine your search with detailed location filters.
              </SheetDescription>
            </SheetHeader>

            <div className="py-6 px-6 space-y-8">
              {/* Status Filter */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground/80">
                  Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="All Status" />
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

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Filters
                  </span>
                </div>
              </div>

              {/* Location Details */}
              <div className="space-y-5">
                <h4 className="text-sm font-semibold text-foreground/80">
                  Location Details
                </h4>

                <div className="space-y-4">
                  <div className="space-y-2">
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

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      State / Province
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

                  <div className="space-y-2">
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

                  <div className="space-y-2">
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
            </div>

            <SheetFooter>
              <SheetClose asChild>
                <Button onClick={onFilter} className="w-full">
                  Apply Filters
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
