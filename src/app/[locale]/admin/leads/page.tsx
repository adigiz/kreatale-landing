import { getLocations, getCategories, getLeads, getLeadStats } from "./actions";
import LeadsDashboard from "./components/LeadsDashboard";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  let locations: Awaited<ReturnType<typeof getLocations>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let leadsResult: Awaited<ReturnType<typeof getLeads>> = {
    data: [],
    pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
  };
  let stats = { total: 0, new: 0, contacted: 0, converted: 0 };
  let error = null;

  try {
    const [locs, cats, leads, leadStats] = await Promise.all([
      getLocations(),
      getCategories(),
      getLeads({ page: 1, pageSize: 10 }),
      getLeadStats(),
    ]);
    locations = locs;
    categories = cats;
    leadsResult = leads;
    stats = leadStats;
  } catch (err) {
    console.error("Failed to fetch leads data:", err);
    error = "Database connection failed. Showing empty state.";
    // We swallow the error to allow the page to render, but in a real app potentially show an error banner
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200 text-sm">
          Warning: {error}
        </div>
      )}
      <LeadsDashboard
        locations={locations}
        categories={categories}
        initialLeads={leadsResult.data}
        initialPagination={leadsResult.pagination}
        stats={stats}
      />
    </div>
  );
}
