import { getSession } from "@/lib/cms/auth/config";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Building, MessageSquare } from "lucide-react";
import { getContactById } from "@/lib/cms/queries/contacts";
import { Button } from "@/components/ui/button";
import MarkReadButton from "../MarkReadButton";
import DeleteContactButton from "../DeleteContactButton";

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const session = await getSession();
  if (!session?.user) {
    redirect(`/${locale}/admin/login`);
  }

  const contact = await getContactById(id);

  if (!contact) {
    redirect(`/${locale}/admin/contacts`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/${locale}/admin/contacts`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Inquiry
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <MarkReadButton
            contactId={contact.id}
            isRead={contact.read === "true"}
            locale={locale}
          />
          <DeleteContactButton contactId={contact.id} locale={locale} />
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {contact.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Submitted on {new Date(contact.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <a
                href={`mailto:${contact.email}`}
                className="text-blue-600 hover:underline"
              >
                {contact.email}
              </a>
            </div>
          </div>

          {contact.phone && (
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Phone
                </p>
                <a
                  href={`tel:${contact.phone}`}
                  className="text-foreground hover:underline"
                >
                  {contact.phone}
                </a>
              </div>
            </div>
          )}

          {contact.company && (
            <div className="flex items-start gap-3">
              <Building className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Company
                </p>
                <p className="text-foreground">{contact.company}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Inquiry Type
              </p>
              <span className="inline-block mt-1 px-2 py-1 bg-gray-100 rounded text-sm">
                {contact.inquiry}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Message
          </h2>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-foreground whitespace-pre-wrap">
              {contact.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
