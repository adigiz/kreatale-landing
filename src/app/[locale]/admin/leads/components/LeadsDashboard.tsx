"use client";

import { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import {
  getLeads,
  triggerScrape,
  triggerMapScrape,
  updateLeadStatus,
  SortField,
  SortOrder,
} from "../actions";
import { LeadsTable } from "./LeadsTable";
import { LeadsFilters } from "./LeadsFilters";
import { LeadsPagination } from "./LeadsPagination";

// Dynamic import for MapScraper
const MapScraper = dynamic(() => import("./MapScraper"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] flex items-center justify-center bg-muted border rounded-xl">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
});

interface Location {
  id: string;
  name: string;
  slug: string;
  country: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  searchTerm: string;
}

interface Lead {
  id: string;
  businessName: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  rating: string | null;
  reviewCount: number | null;
  googleMapsUrl: string | null;
  status: string;
  isNewListing: boolean | null;
  notes: string | null;
  locationId: string | null;
  categoryId: string | null;
  createdAt: Date;
  location: { id: string; name: string } | null;
  category: { id: string; name: string } | null;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface Stats {
  total: number;
  new: number;
  contacted: number;
  converted: number;
}

interface LeadsDashboardProps {
  locations: Location[];
  categories: Category[];
  initialLeads: Lead[];
  initialPagination: Pagination;
  stats: Stats;
}

export default function LeadsDashboard({
  locations,
  categories,
  initialLeads,
  initialPagination,
  stats,
}: LeadsDashboardProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [pagination, setPagination] = useState<Pagination>(initialPagination);
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [isPending, startTransition] = useTransition();
  const [isScraping, setIsScraping] = useState(false);
  const [activeTab, setActiveTab] = useState("list");

  const fetchLeads = async (page: number = 1) => {
    startTransition(async () => {
      const result = await getLeads({
        locationId: selectedLocation === "all" ? undefined : selectedLocation,
        categoryId: selectedCategory === "all" ? undefined : selectedCategory,
        status: statusFilter === "all" ? undefined : statusFilter,
        page,
        pageSize: 10,
        sortBy,
        sortOrder,
      });
      setLeads(result.data);
      setPagination(result.pagination);
    });
  };

  const handleFilter = () => fetchLeads(1);

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setTimeout(() => fetchLeads(1), 0);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchLeads(newPage);
    }
  };

  const handleScrape = async () => {
    if (selectedLocation === "all" || selectedCategory === "all") {
      alert("Please select both a location and category to scrape");
      return;
    }
    setIsScraping(true);
    const result = await triggerScrape(selectedLocation, selectedCategory);
    setIsScraping(false);
    if (result.success) {
      alert("Scraping started! Results will appear shortly.");
      fetchLeads(1); // Refresh
    } else {
      alert("Failed to start scraping: " + result.error);
    }
  };

  const handleMapScrape = async ({
    lat,
    lng,
    zoom,
    categoryId,
  }: {
    lat: number;
    lng: number;
    zoom: number;
    categoryId: string;
  }) => {
    setIsScraping(true);
    const result = await triggerMapScrape(lat, lng, zoom, categoryId);
    setIsScraping(false);
    if (result.success) {
      alert("Scraping started! Results will appear shortly.");
      setActiveTab("list");
      setTimeout(() => fetchLeads(1), 2000); // Switch to list and refresh
    } else {
      alert("Failed to start scraping: " + result.error);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    await updateLeadStatus(leadId, newStatus);
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Leads</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage business leads from Google Maps
            {stats.total > 0 && (
              <span className="ml-2">
                ({stats.total} total, {stats.new} new)
              </span>
            )}
          </p>
        </div>
        <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
          <button
            onClick={() => setActiveTab("list")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${activeTab === "list" ? "bg-background text-foreground shadow" : "hover:bg-background/50"}`}
          >
            List View
          </button>
          <button
            onClick={() => setActiveTab("map")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${activeTab === "map" ? "bg-background text-foreground shadow" : "hover:bg-background/50"}`}
          >
            Map Scraper
          </button>
        </div>
      </div>

      {activeTab === "map" ? (
        <MapScraper
          categories={categories}
          onScrape={handleMapScrape}
          isScraping={isScraping}
        />
      ) : (
        <div className="space-y-6">
          <LeadsFilters
            locations={locations}
            categories={categories}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onFilter={handleFilter}
            onScrape={handleScrape}
            isPending={isPending}
            isScraping={isScraping}
          />

          <LeadsTable
            leads={leads}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onStatusChange={handleStatusChange}
          />

          <LeadsPagination
            page={pagination.page}
            pageSize={pagination.pageSize}
            total={pagination.total}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            isPending={isPending}
          />
        </div>
      )}
    </div>
  );
}
