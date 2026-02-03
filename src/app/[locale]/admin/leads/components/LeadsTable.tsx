"use client";

import { Target, Phone, Globe, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { SortField, SortOrder } from "../actions";

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

interface LeadsTableProps {
  leads: Lead[];
  sortBy: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onStatusChange: (leadId: string, newStatus: string) => void;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  replied: "bg-purple-100 text-purple-700",
  qualified: "bg-cyan-100 text-cyan-700",
  converted: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-700",
  ignored: "bg-gray-100 text-gray-700",
};

const statusOptions = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "replied", label: "Replied" },
  { value: "qualified", label: "Qualified" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
  { value: "ignored", label: "Ignored" },
];

export function LeadsTable({
  leads,
  sortBy,
  sortOrder,
  onSort,
  onStatusChange,
}: LeadsTableProps) {
  const SortButton = ({
    field,
    label,
  }: {
    field: SortField;
    label: string;
  }) => (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {label}
      {sortBy === field ? (
        sortOrder === "asc" ? (
          <ArrowUp className="size-3" />
        ) : (
          <ArrowDown className="size-3" />
        )
      ) : (
        <ArrowUpDown className="size-3 opacity-50" />
      )}
    </button>
  );

  return (
    <div className="rounded-lg border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                <SortButton field="businessName" label="Business" />
              </th>
              <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                Location
              </th>
              <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                Category
              </th>
              <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                Contact
              </th>
              <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                <SortButton field="rating" label="Rating" />
              </th>
              <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                Status
              </th>
              <th className="h-10 px-4 text-right align-middle text-xs font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Target className="size-6 text-muted-foreground/50" />
                    <p>No leads found</p>
                    <p className="text-xs">
                      Select a location and category, then click &quot;Find
                      Business&quot;
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{lead.businessName}</div>
                    {lead.address && (
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {lead.address}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    <div className="flex flex-col gap-0.5">
                      {lead.location?.name && (
                        <span className="font-medium text-foreground">
                          {lead.location.name}
                        </span>
                      )}
                      {(lead.district || lead.city) && (
                        <span className="text-xs">
                          {[lead.district, lead.city]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      )}
                      {(lead.state || lead.country) && (
                        <span className="text-xs opacity-70">
                          {[lead.state, lead.country]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      )}
                      {!lead.location?.name &&
                        !lead.district &&
                        !lead.city &&
                        !lead.state &&
                        !lead.country &&
                        "-"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {lead.category?.name || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {lead.phone && (
                        <a
                          href={`https://wa.me/${lead.phone.replace(/\D/g, "").replace(/^0/, "62")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                        >
                          <Phone className="size-3" />
                          {lead.phone}
                        </a>
                      )}
                      {lead.website && (
                        <a
                          href={lead.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                        >
                          <Globe className="size-3" />
                          Website
                        </a>
                      )}
                      {!lead.phone && !lead.website && (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {lead.rating ? (
                      <div className="flex items-center gap-1">
                        <Star className="size-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm">{lead.rating}</span>
                        <span className="text-xs text-muted-foreground">
                          ({lead.reviewCount || 0})
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={lead.status}
                      onValueChange={(val) => onStatusChange(lead.id, val)}
                    >
                      <SelectTrigger
                        className={`w-[110px] h-7 text-xs ${statusColors[lead.status] || ""}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {lead.googleMapsUrl && (
                        <Button variant="ghost" size="sm" asChild>
                          <a
                            href={lead.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="size-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
