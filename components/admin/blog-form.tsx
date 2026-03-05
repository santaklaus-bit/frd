"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createOrUpdateBlogPost } from "@/app/actions/blog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface BlogFormProps {
  initialData?: {
    slug: string;
    title: string;
    description: string;
    date: string;
    thumbnail: string;
    content: string;
  };
}

export function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await createOrUpdateBlogPost(formData);
    router.push("/admin/blog");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog">
          <Button variant="outline" size="icon" className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          {initialData ? "Modifier l'article" : "Nouvel article"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-border/40 shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Détails de l'article
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-60">
                  Slug (URL)
                </label>
                <Input
                  name="slug"
                  defaultValue={initialData?.slug}
                  placeholder="mon-article-seo"
                  required
                  readOnly={!!initialData}
                  className="rounded-xl border-border/40"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-60">
                  Date
                </label>
                <Input
                  name="date"
                  type="date"
                  defaultValue={
                    initialData?.date
                      ? new Date(initialData.date).toISOString().split("T")[0]
                      : new Date().toISOString().split("T")[0]
                  }
                  required
                  className="rounded-xl border-border/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest opacity-60">
                Titre
              </label>
              <Input
                name="title"
                defaultValue={initialData?.title}
                placeholder="Le futur de l'entrepreneuriat social..."
                required
                className="rounded-xl border-border/40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest opacity-60">
                Thumbnail (URL)
              </label>
              <Input
                name="thumbnail"
                defaultValue={initialData?.thumbnail}
                placeholder="https://images.unsplash.com/..."
                className="rounded-xl border-border/40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest opacity-60">
                Description
              </label>
              <Textarea
                name="description"
                defaultValue={initialData?.description}
                placeholder="Un court résumé de l'article..."
                required
                className="rounded-xl border-border/40 min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest opacity-60">
                Contenu (MDX)
              </label>
              <Textarea
                name="content"
                defaultValue={initialData?.content}
                placeholder="# Mon titre..."
                required
                className="rounded-xl border-border/40 min-h-[400px] font-mono text-sm"
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-12 rounded-xl font-medium tracking-tight bg-foreground text-background hover:opacity-90 transition-opacity"
                disabled={loading}
              >
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Enregistrement..." : "Enregistrer l'article"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
