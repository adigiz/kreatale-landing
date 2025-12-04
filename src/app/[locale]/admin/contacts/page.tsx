import { getSession } from "@/lib/cms/auth/config";
import { redirect } from "next/navigation";
import { Search, Mail, CheckCircle } from "lucide-react";
import { getAllContacts } from "@/lib/cms/queries/contacts";
import type { Contact } from "@/lib/cms/db/schema";
import { Button } from "@/components/ui/button";
import DeleteContactButton from "./DeleteContactButton";
import MarkReadButton from "./MarkReadButton";

export default async function ContactsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ search?: string; read?: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();
  if (!session?.user) {
    redirect(`/${locale}/admin/login`);
  }

  const searchParamsData = await searchParams;

  // Get contacts (handle case where table doesn't exist yet)
  let allContacts: Contact[] = [];
  try {
    allContacts = await getAllContacts();
  } catch (error) {
    console.error("Error fetching contacts:", error);
    // Table doesn't exist yet - show empty state
  }

  // Filter contacts by read status if provided
  let contacts = allContacts;
  if (searchParamsData.read === "true") {
    contacts = allContacts.filter((c) => c.read === "true");
  } else if (searchParamsData.read === "false") {
    contacts = allContacts.filter((c) => c.read === "false");
  }

  // Filter by search if provided
  if (searchParamsData.search) {
    const searchLower = searchParamsData.search.toLowerCase();
    contacts = contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower) ||
        c.company?.toLowerCase().includes(searchLower) ||
        c.message.toLowerCase().includes(searchLower)
    );
  }

  const unreadCount = allContacts.filter((c) => c.read === "false").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Inquiry</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage inquiry submissions
            {unreadCount > 0 && (
              <span className="ml-2 text-blue-600 font-medium">
                ({unreadCount} unread)
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-2">
        <form
          className="flex-1"
          action={async (formData) => {
            "use server";
            const search = formData.get("search") as string;
            const read = formData.get("read") as string;
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            if (read) params.set("read", read);
            redirect(`/${locale}/admin/contacts?${params.toString()}`);
          }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              name="search"
              placeholder="Search inquiries..."
              defaultValue={searchParamsData.search}
              className="w-full h-9 rounded-md border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <input
            type="hidden"
            name="read"
            value={searchParamsData.read || ""}
          />
        </form>
        <div className="flex gap-2">
          <Button
            asChild
            variant={
              searchParamsData.read === undefined ? "default" : "outline"
            }
            size="sm"
          >
            <a href={`/${locale}/admin/contacts`}>All</a>
          </Button>
          <Button
            asChild
            variant={searchParamsData.read === "false" ? "default" : "outline"}
            size="sm"
          >
            <a href={`/${locale}/admin/contacts?read=false`}>
              Unread ({unreadCount})
            </a>
          </Button>
          <Button
            asChild
            variant={searchParamsData.read === "true" ? "default" : "outline"}
            size="sm"
          >
            <a href={`/${locale}/admin/contacts?read=true`}>Read</a>
          </Button>
        </div>
      </div>

      {/* Inquiry Table */}
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                  Name
                </th>
                <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                  Email
                </th>
                <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                  Company
                </th>
                <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                  Inquiry
                </th>
                <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                  Status
                </th>
                <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                  Created
                </th>
                <th className="h-10 px-4 text-right align-middle text-xs font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No inquiries found
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact.id} className="border-b">
                    <td className="px-4 py-3">
                      <div className="font-medium">{contact.name}</div>
                      {contact.phone && (
                        <div className="text-xs text-muted-foreground">
                          {contact.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {contact.email}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      {contact.company || (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {contact.inquiry}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {contact.read === "true" ? (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          Read
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-blue-600">
                          <Mail className="w-4 h-4" />
                          Unread
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/${locale}/admin/contacts/${contact.id}`}>
                            View
                          </a>
                        </Button>
                        <MarkReadButton
                          contactId={contact.id}
                          isRead={contact.read === "true"}
                        />
                        <DeleteContactButton contactId={contact.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
