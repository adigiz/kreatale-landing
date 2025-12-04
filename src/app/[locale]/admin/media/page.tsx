import { getSession } from "@/lib/cms/auth/config";
import { redirect } from "next/navigation";
import { getAllMedia } from "@/lib/cms/queries/media";
import MediaLibrary from "@/components/cms/MediaLibrary";

export default async function MediaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();
  if (!session?.user) {
    redirect(`/${locale}/admin/login`);
  }

  const media = await getAllMedia();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Media Library
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your media files
        </p>
      </div>
      <MediaLibrary initialMedia={media} />
    </div>
  );
}
