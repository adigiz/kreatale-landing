"use client";

import { useState, useTransition, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  getLeads,
  triggerScrape,
  triggerMapScrape,
  updateLeadStatus,
  getLeadStats,
  getScraperStatus,
  getFilterOptions,
} from "../actions";
import type { SortField, SortOrder } from "../actions";
import { LeadsTable } from "./LeadsTable";
import { LeadsFilters } from "./LeadsFilters";
import { LeadsPagination } from "./LeadsPagination";
import { LeadFormDialog } from "./LeadFormDialog";
import { StatsCards } from "./StatsCards";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

export interface Lead {
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
  city: string | null;
  district: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
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

  // New Filters State
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [filterOptions, setFilterOptions] = useState<{
    cities: string[];
    states: string[];
    countries: string[];
    districts: string[];
  }>({ cities: [], states: [], countries: [], districts: [] });

  const [sortBy, setSortBy] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [isPending, startTransition] = useTransition();
  const [isScraping, setIsScraping] = useState(false);
  const [activeTab, setActiveTab] = useState("list");
  const [scrapedCount, setScrapedCount] = useState(0);
  const initialTotalRef = useRef(stats.total);
  const router = useRouter();

  // Load filter options (dependent)
  useEffect(() => {
    getFilterOptions({
      country: selectedCountry,
      state: selectedState,
      city: selectedCity,
    }).then((opts) => setFilterOptions(opts));
  }, [leads, selectedCountry, selectedState, selectedCity]);

  // Reset downstream filters
  useEffect(() => {
    if (selectedCountry === "all") {
      setSelectedState("all");
      setSelectedCity("all");
      setSelectedDistrict("all");
    }
  }, [selectedCountry, setSelectedState, setSelectedCity, setSelectedDistrict]);

  useEffect(() => {
    if (selectedState === "all" && selectedCountry !== "all") {
      setSelectedCity("all");
      setSelectedDistrict("all");
    }
  }, [selectedState, selectedCountry, setSelectedCity, setSelectedDistrict]);

  useEffect(() => {
    if (selectedCity === "all" && selectedState !== "all") {
      setSelectedDistrict("all");
    }
  }, [selectedCity, selectedState, setSelectedDistrict]);

  const fetchLeads = useCallback(
    (page: number = 1) => {
      startTransition(async () => {
        const result = await getLeads({
          locationId: selectedLocation === "all" ? undefined : selectedLocation,
          categoryId: selectedCategory === "all" ? undefined : selectedCategory,
          status: statusFilter === "all" ? undefined : statusFilter,
          city: selectedCity === "all" ? undefined : selectedCity,
          state: selectedState === "all" ? undefined : selectedState,
          district: selectedDistrict === "all" ? undefined : selectedDistrict,
          country: selectedCountry === "all" ? undefined : selectedCountry,
          page,
          pageSize: 10,
          sortBy,
          sortOrder,
        });
        setLeads(result.data);
        setPagination(result.pagination);
      });
    },
    [
      selectedLocation,
      selectedCategory,
      statusFilter,
      selectedCity,
      selectedState,
      selectedDistrict,
      selectedCountry,
      sortBy,
      sortOrder,
    ],
  );

  // Auto-fetch when filters or sort change
  useEffect(() => {
    fetchLeads(1);
  }, [fetchLeads]);

  // Polling for real-time updates
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isScraping) {
      initialTotalRef.current = stats.total; // Reset baseline
      interval = setInterval(async () => {
        try {
          // Poll stats
          const newStats = await getLeadStats();
          const diff = newStats.total - initialTotalRef.current;
          if (diff > 0) {
            setScrapedCount(diff);
          }

          // Poll scraper status
          const status = await getScraperStatus();
          if (!status.active) {
            setIsScraping(false);
            toast.success("Scraping completed!");

            // Refresh everything
            if (activeTab === "map") {
              router.refresh();
              setTimeout(() => fetchLeads(1), 1000);
            } else {
              fetchLeads(1);
            }
          }
        } catch (error) {
          console.error("Failed to poll stats", error);
        }
      }, 2000);
    } else {
      setScrapedCount(0);
    }

    return () => clearInterval(interval);
  }, [isScraping, stats.total, activeTab, fetchLeads, router]);

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
      toast.error("Please select both a location and category to scrape");
      return;
    }
    setIsScraping(true);
    setScrapedCount(0);
    initialTotalRef.current = stats.total;

    toast.info("Scraping started...");

    const result = await triggerScrape(selectedLocation, selectedCategory);
    // Removed setIsScraping(false) - waiting for polling

    if (result.success) {
      // Do not wait for completion here, polling will handle it
      fetchLeads(1);
    } else {
      toast.error("Failed to start scraping: " + result.error);
      setIsScraping(false);
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
    setScrapedCount(0);
    initialTotalRef.current = stats.total;

    toast.info("Map scraping started...");

    const result = await triggerMapScrape(lat, lng, zoom, categoryId);
    // Removed setIsScraping(false) - waiting for polling

    if (result.success) {
      // Do not wait for completion here, polling will handle it
      setActiveTab("list");
      router.refresh();
      setTimeout(() => fetchLeads(1), 1000);
    } else {
      toast.error("Failed to start scraping: " + result.error);
      setIsScraping(false);
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
            {isScraping && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 animate-pulse">
                Found {scrapedCount} leads...
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LeadFormDialog
            mode="create"
            locations={locations}
            categories={categories}
            onSuccess={() => fetchLeads(1)}
          />
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
      </div>

      <StatsCards stats={stats} />

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
            filterOptions={filterOptions}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
          />

          <LeadsTable
            leads={leads}
            locations={locations}
            categories={categories}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onStatusChange={handleStatusChange}
            onLeadUpdated={() => fetchLeads(pagination.page)}
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
