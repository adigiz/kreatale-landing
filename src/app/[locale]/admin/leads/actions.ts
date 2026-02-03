"use server";

import { db } from "@/lib/cms/db/client";
import { locations, categories, leads, leadStatusEnum } from "@/lib/cms/db/schema";
import { eq, desc, asc, and, count, isNotNull } from "drizzle-orm";

export async function getLocations() {
  return await db.select().from(locations).orderBy(locations.name);
}

export async function getCategories() {
  return await db.select().from(categories).orderBy(categories.name);
}

export type SortField = "createdAt" | "businessName" | "rating" | "reviewCount";
export type SortOrder = "asc" | "desc";
export type LeadStatus = (typeof leadStatusEnum.enumValues)[number];

export async function getFilterOptions() {
  // We want distinct values for dropdowns
  const countries = await db.selectDistinct({ value: leads.country }).from(leads).where(isNotNull(leads.country)).orderBy(leads.country);
  const states = await db.selectDistinct({ value: leads.state }).from(leads).where(isNotNull(leads.state)).orderBy(leads.state);
  const cities = await db.selectDistinct({ value: leads.city }).from(leads).where(isNotNull(leads.city)).orderBy(leads.city);
  const districts = await db.selectDistinct({ value: leads.district }).from(leads).where(isNotNull(leads.district)).orderBy(leads.district);
  
  return {
    countries: countries.map(c => c.value).filter((v): v is string => v !== null),
    states: states.map(s => s.value).filter((v): v is string => v !== null),
    cities: cities.map(c => c.value).filter((v): v is string => v !== null),
    districts: districts.map(d => d.value).filter((v): v is string => v !== null)
  };
}

export async function getLeads(filters?: {
  locationId?: string;
  categoryId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  // New Filters
  city?: string;
  district?: string;
  state?: string;
  country?: string;
}) {
  const conditions = [];
  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 10;
  const sortBy = filters?.sortBy || "createdAt";
  const sortOrder = filters?.sortOrder || "desc";

  if (filters?.locationId) conditions.push(eq(leads.locationId, filters.locationId));
  if (filters?.categoryId) conditions.push(eq(leads.categoryId, filters.categoryId));
  if (filters?.status) conditions.push(eq(leads.status, filters.status as LeadStatus));
  
  if (filters?.city) conditions.push(eq(leads.city, filters.city));
  if (filters?.district) conditions.push(eq(leads.district, filters.district));
  if (filters?.state) conditions.push(eq(leads.state, filters.state));
  if (filters?.country) conditions.push(eq(leads.country, filters.country));

  // Build sort column
  const sortColumn = {
    createdAt: leads.createdAt,
    businessName: leads.businessName,
    rating: leads.rating,
    reviewCount: leads.reviewCount,
  }[sortBy];

  const orderFn = sortOrder === "asc" ? asc : desc;

  // Get total count for pagination
  let countQuery = db.select({ count: count() }).from(leads);
  if (conditions.length > 0) {
    countQuery = countQuery.where(and(...conditions)) as typeof countQuery;
  }
  const [totalResult] = await countQuery;
  const total = totalResult?.count || 0;

  // Get paginated data
  let query = db
    .select({
      id: leads.id,
      businessName: leads.businessName,
      address: leads.address,
      phone: leads.phone,
      website: leads.website,
      rating: leads.rating,
      reviewCount: leads.reviewCount,
      googleMapsUrl: leads.googleMapsUrl,
      status: leads.status,
      isNewListing: leads.isNewListing,
      notes: leads.notes,
      city: leads.city,
      district: leads.district,
      state: leads.state,
      postalCode: leads.postalCode,
      country: leads.country,
      locationId: leads.locationId,
      categoryId: leads.categoryId,
      createdAt: leads.createdAt,
      location: {
        id: locations.id,
        name: locations.name,
      },
      category: {
        id: categories.id,
        name: categories.name,
      },
    })
    .from(leads)
    .leftJoin(locations, eq(leads.locationId, locations.id))
    .leftJoin(categories, eq(leads.categoryId, categories.id))
    .orderBy(orderFn(sortColumn))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }

  const data = await query;

  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

export async function getLeadStats() {
  const [totalLeads] = await db.select({ count: count() }).from(leads);
  const [newLeads] = await db.select({ count: count() }).from(leads).where(eq(leads.status, "new"));
  const [contactedLeads] = await db.select({ count: count() }).from(leads).where(eq(leads.status, "contacted"));
  const [convertedLeads] = await db.select({ count: count() }).from(leads).where(eq(leads.status, "converted"));

  return {
    total: totalLeads?.count || 0,
    new: newLeads?.count || 0,
    contacted: contactedLeads?.count || 0,
    converted: convertedLeads?.count || 0,
  };
}

export async function updateLeadStatus(leadId: string, status: string) {
  await db
    .update(leads)
    .set({ status: status as LeadStatus, updatedAt: new Date() })
    .where(eq(leads.id, leadId));
}

export async function updateLeadNotes(leadId: string, notes: string) {
  await db
    .update(leads)
    .set({ notes, updatedAt: new Date() })
    .where(eq(leads.id, leadId));
}

const SCRAPER_URL = process.env.SCRAPER_API_URL || "http://localhost:3002";

export async function triggerScrape(
  locationId: string,
  categoryId: string,
  coordinates?: { lat: number; lng: number; zoom: number }
) {
  try {
    const response = await fetch(`${SCRAPER_URL}/scrape`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        locationId,
        categoryId,
        lat: coordinates?.lat,
        lng: coordinates?.lng,
        zoom: coordinates?.zoom,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || "Failed to start scraper" };
    }

    return { success: true };
  } catch (error) {
    console.error("Scraper trigger error:", error);
    return { success: false, error: "Failed to connect to scraper service" };
  }
}

export async function triggerMapScrape(
  lat: number,
  lng: number,
  zoom: number,
  categoryId: string
) {
  try {
    const response = await fetch(`${SCRAPER_URL}/scrape`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lat,
        lng,
        zoom,
        categoryId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || "Failed to start scraper" };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Failed to connect to scraper service" };
  }
}

export async function getScraperStatus() {
  try {
    const response = await fetch(`${SCRAPER_URL}/status`, {
      next: { revalidate: 0 }, // Disable cache
    });
    if (!response.ok) return { active: false, count: 0 };
    return await response.json();
  } catch {
    return { active: false, count: 0 };
  }
}
