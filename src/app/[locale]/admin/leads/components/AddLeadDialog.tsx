"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { createLead } from "../actions";
import { toast } from "sonner";

interface AddLeadDialogProps {
  locations: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  onLeadCreated: () => void;
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

const inputClasses =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

const labelClasses = "text-sm font-medium text-foreground/80";

export function AddLeadDialog({
  locations,
  categories,
  onLeadCreated,
}: AddLeadDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Form state
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [rating, setRating] = useState("");
  const [reviewCount, setReviewCount] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [status, setStatus] = useState("new");
  const [notes, setNotes] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [locationId, setLocationId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const resetForm = () => {
    setBusinessName("");
    setAddress("");
    setPhone("");
    setWebsite("");
    setRating("");
    setReviewCount("");
    setGoogleMapsUrl("");
    setStatus("new");
    setNotes("");
    setCity("");
    setDistrict("");
    setState("");
    setPostalCode("");
    setCountry("");
    setLocationId("");
    setCategoryId("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!businessName.trim()) {
      toast.error("Business name is required");
      return;
    }

    startTransition(async () => {
      const result = await createLead({
        businessName: businessName.trim(),
        address: address.trim() || undefined,
        phone: phone.trim() || undefined,
        website: website.trim() || undefined,
        rating: rating.trim() || undefined,
        reviewCount: reviewCount ? parseInt(reviewCount) : undefined,
        googleMapsUrl: googleMapsUrl.trim() || undefined,
        status: status as "new" | "contacted" | "replied" | "qualified" | "converted" | "lost" | "ignored",
        notes: notes.trim() || undefined,
        city: city.trim() || undefined,
        district: district.trim() || undefined,
        state: state.trim() || undefined,
        postalCode: postalCode.trim() || undefined,
        country: country.trim() || undefined,
        locationId: locationId || undefined,
        categoryId: categoryId || undefined,
      });

      if (result.success) {
        toast.success("Lead created successfully");
        resetForm();
        setOpen(false);
        onLeadCreated();
      } else {
        toast.error(result.error || "Failed to create lead");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4 mr-2" />
          Add Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
          <DialogDescription>
            Manually add a business lead. Only business name is required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground/80 border-b pb-2">
              Business Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <label className={labelClasses}>
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={inputClasses}
                  placeholder="e.g. Acme Coffee Shop"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className={labelClasses}>Phone</label>
                <input
                  type="text"
                  className={inputClasses}
                  placeholder="e.g. +62 812 3456 7890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className={labelClasses}>Website</label>
                <input
                  type="url"
                  className={inputClasses}
                  placeholder="e.g. https://example.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className={labelClasses}>Rating</label>
                <input
                  type="text"
                  className={inputClasses}
                  placeholder="e.g. 4.5"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className={labelClasses}>Review Count</label>
                <input
                  type="number"
                  className={inputClasses}
                  placeholder="e.g. 120"
                  value={reviewCount}
                  onChange={(e) => setReviewCount(e.target.value)}
                  min="0"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className={labelClasses}>Google Maps URL</label>
                <input
                  type="url"
                  className={inputClasses}
                  placeholder="e.g. https://maps.google.com/..."
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground/80 border-b pb-2">
              Location Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <label className={labelClasses}>Address</label>
                <input
                  type="text"
                  className={inputClasses}
                  placeholder="Full address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className={labelClasses}>City</label>
                <input
                  type="text"
                  className={inputClasses}
                  placeholder="e.g. Samarinda"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className={labelClasses}>District</label>
                <input
                  type="text"
                  className={inputClasses}
                  placeholder="e.g. Samarinda Utara"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className={labelClasses}>State / Province</label>
                <input
                  type="text"
                  className={inputClasses}
                  placeholder="e.g. East Kalimantan"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className={labelClasses}>Postal Code</label>
                <input
                  type="text"
                  className={inputClasses}
                  placeholder="e.g. 75124"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className={labelClasses}>Country</label>
                <input
                  type="text"
                  className={inputClasses}
                  placeholder="e.g. Indonesia"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Classification */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground/80 border-b pb-2">
              Classification
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelClasses}>Location</label>
                <SearchableSelect
                  options={[{ id: "", name: "No Location" }, ...locations]}
                  value={locationId}
                  onChange={setLocationId}
                  placeholder="Select Location"
                />
              </div>

              <div className="space-y-2">
                <label className={labelClasses}>Category</label>
                <SearchableSelect
                  options={[{ id: "", name: "No Category" }, ...categories]}
                  value={categoryId}
                  onChange={setCategoryId}
                  placeholder="Select Category"
                />
              </div>

              <div className="space-y-2">
                <label className={labelClasses}>Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full h-9">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className={labelClasses}>Notes</label>
            <textarea
              className={`${inputClasses} h-20 resize-none py-2`}
              placeholder="Additional notes about this lead..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
