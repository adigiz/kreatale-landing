"use client";

import { MapPin, Search, RefreshCw, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";

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
  onScrape,
  isPending,
  isScraping,
}: LeadsFiltersProps) {
  return (
    <div className="space-y-6">
      {/* Header Action */}
      <div className="flex justify-end mb-4">
        <Button
          onClick={onScrape}
          disabled={
            isScraping ||
            selectedLocation === "all" ||
            selectedCategory === "all"
          }
        >
          <RefreshCw
            className={`size-4 mr-2 ${isScraping ? "animate-spin" : ""}`}
          />
          {isScraping ? "Scraping..." : "Find Business"}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-[180px] h-9">
            <MapPin className="size-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc.id} value={loc.id}>
                {loc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="w-[180px]">
          <SearchableSelect
            options={[{ id: "all", name: "All Categories" }, ...categories]}
            value={selectedCategory}
            onChange={setSelectedCategory}
            placeholder="All Categories"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] h-9">
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

        <Button
          variant="outline"
          size="sm"
          onClick={onFilter}
          disabled={isPending}
        >
          <Search className="size-4 mr-2" />
          {isPending ? "Filtering..." : "Apply"}
        </Button>
      </div>
    </div>
  );
}
