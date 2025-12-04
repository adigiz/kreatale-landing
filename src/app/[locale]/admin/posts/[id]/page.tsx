import { getSession } from "@/lib/cms/auth/config";
import { redirect } from "next/navigation";
import { getPostById } from "@/lib/cms/queries/posts";
import PostEditor from "@/components/cms/PostEditor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ActionButtons from "./ActionButtons";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const session = await getSession();
  if (!session?.user) {
    redirect(`/${locale}/admin/login`);
  }

  const result = await getPostById(id);

  if (!result) {
    redirect(`/${locale}/admin/posts`);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${locale}/admin/posts`}>
            <ArrowLeft className="size-4" />
            Back to Posts
          </Link>
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {id === "new" ? "Create New Post" : "Edit Post"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {id === "new" ? "Create a new blog post" : "Edit your blog post"}
          </p>
        </div>
        <ActionButtons postId={id} />
      </div>
      <div className="border-b" />
      <PostEditor
        postId={id}
        initialPost={result.post}
        author={result.author}
      />
    </div>
  );
}
