import Link from "next/link";
import { getBlogPosts } from "@/lib/content-manager";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-tighter">
            Blog Posts
          </h1>
          <p className="text-muted-foreground font-medium">
            Gérez vos articles de blog (MDX).
          </p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="rounded-full bg-black text-white dark:bg-white dark:text-black font-bold uppercase tracking-widest px-8">
            <Plus className="mr-2 h-4 w-4" /> Nouvel Article
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
          <Card
            key={post.slug}
            className="border-border/40 hover:border-black dark:hover:border-white transition-colors rounded-2xl overflow-hidden shadow-sm"
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-bold uppercase tracking-tight">
                  {post.title}
                </h3>
                <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                  <span>/{post.slug}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/blog/${post.slug}`}>
                  <Button variant="outline" size="icon" className="rounded-xl">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 border-red-100 hover:border-red-200"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
