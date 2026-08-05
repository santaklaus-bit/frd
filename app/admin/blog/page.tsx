import Link from "next/link";
import { getBlogPosts } from "@/lib/content-manager";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Calendar, Hash, FileText } from "lucide-react";
import { BlogDeleteButton } from "@/components/admin/blog-delete-button";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-end justify-between pb-6 border-b border-border/50">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Contenu
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">Articles</h1>
        </div>
        <Link href="/admin/blog/new">
          <Button className="rounded-full bg-foreground text-background text-xs font-semibold uppercase tracking-widest px-6 h-9 hover:opacity-80 transition-opacity">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Nouvel article
          </Button>
        </Link>
      </div>

      {/* Empty state */}
      {posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-border/50 rounded-2xl">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-border/50 bg-muted/30 mb-4">
            <FileText className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Aucun article pour le moment.
          </p>
          <Link href="/admin/blog/new" className="mt-4 text-xs font-semibold underline underline-offset-4 hover:no-underline">
            Créer le premier article →
          </Link>
        </div>
      )}

      {/* Posts list */}
      {posts.length > 0 && (
        <div className="rounded-2xl border border-border/40 overflow-hidden divide-y divide-border/30">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-3 bg-muted/20 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60">
            <span>Titre</span>
            <span className="text-right">Date</span>
            <span className="w-20 text-right">Actions</span>
          </div>

          {posts.map((post) => (
            <div
              key={post.slug}
              className="group grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors"
            >
              {/* Title + slug */}
              <div className="min-w-0">
                <p className="text-sm font-semibold tracking-tight truncate group-hover:text-foreground transition-colors">
                  {post.title}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Hash className="h-2.5 w-2.5 text-muted-foreground/50" />
                  <p className="text-xs text-muted-foreground/60 font-mono truncate">
                    {post.slug}
                  </p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                <Calendar className="h-3 w-3 opacity-50" />
                <span className="tabular-nums">
                  {new Date(post.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-1.5 w-20 shrink-0">
                <Link href={`/admin/blog/${post.slug}`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <BlogDeleteButton slug={post.slug} />
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground/50 text-right">
        {posts.length} article{posts.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
