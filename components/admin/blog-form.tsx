"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createOrUpdateBlogPost } from "@/app/actions/blog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { MediaUpload } from "./media-upload";
import dynamic from "next/dynamic";

const WysiwygEditor = dynamic(
  () => import("./wysiwyg-editor").then((mod) => mod.WysiwygEditor),
  { ssr: false }
);

interface BlogFormProps {
  initialData?: {
    slug: string;
    title: string;
    description: string;
    date: string;
    thumbnail: string;
    authorName: string;
    authorPhoto: string;
    content: string;
    readTime?: string;
  };
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
          {label}
        </label>
        {hint && (
          <span className="text-[10px] text-muted-foreground/50">{hint}</span>
        )}
      </div>
      {children}
    </div>
  );
}

export function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(initialData?.content || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnail || "");
  const [authorPhotoUrl, setAuthorPhotoUrl] = useState(
    initialData?.authorPhoto || ""
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      // Content is handled separately because it's in state
      formData.set("content", content);
      // Media URLs are in state and hidden inputs, but we ensure they are set
      formData.set("thumbnail", thumbnailUrl);
      formData.set("authorPhoto", authorPhotoUrl);

      await createOrUpdateBlogPost(formData);
      toast.success("Article enregistré avec succès !");
      router.push("/admin/blog");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'enregistrement de l'article.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-border/50">
        <Link href="/admin/blog">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {initialData ? "Modifier" : "Créer"}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {initialData ? initialData.title : "Nouvel article"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title Block */}
            <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-6">
              <Field label="Titre de l'article">
                <Input
                  name="title"
                  defaultValue={initialData?.title}
                  placeholder="Le futur de l'entrepreneuriat social..."
                  required
                  className="rounded-xl border-border/40 bg-background text-lg font-medium h-12"
                />
              </Field>

              <Field label="Description / Résumé SEO" hint="Court résumé">
                <Textarea
                  name="description"
                  defaultValue={initialData?.description}
                  placeholder="Un court résumé de l'article..."
                  className="rounded-xl border-border/40 bg-background min-h-[100px] resize-none"
                />
              </Field>
            </div>

            {/* Editor Block */}
            <div className="rounded-2xl border border-border/40 bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border/40 bg-muted/20 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/70">
                  Contenu de l'article
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary/60">
                    Temps de lecture estimé : 
                  </span>
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                    {Math.max(1, Math.round((content?.replace(/<[^>]*>?/gm, '').trim().split(/\s+/).length || 0) / 200))} min
                  </span>
                </div>
              </div>
              <div className="p-0">
                <WysiwygEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Commencez à rédiger..."
                  className="min-h-[600px] border-0"
                />
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Metadata & Media */}
            <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-6">
              <Field
                label="Slug (URL)"
                hint={initialData ? "Lecture seule" : "unique"}
              >
                <Input
                  name="slug"
                  defaultValue={initialData?.slug}
                  placeholder="mon-article-seo"
                  required
                  readOnly={!!initialData}
                  className="rounded-xl border-border/40 bg-background font-mono text-xs"
                />
              </Field>

              <Field label="Date de publication">
                <Input
                  name="date"
                  type="date"
                  defaultValue={
                    initialData?.date
                      ? new Date(initialData.date).toISOString().split("T")[0]
                      : new Date().toISOString().split("T")[0]
                  }
                  required
                  className="rounded-xl border-border/40 bg-background"
                />
              </Field>
              
              <Field label="Temps de lecture" hint="ex: 5 min">
                <Input
                  name="readTime"
                  defaultValue={initialData?.readTime}
                  placeholder={`${Math.max(1, Math.round((content?.replace(/<[^>]*>?/gm, '').trim().split(/\s+/).length || 0) / 200))} min`}
                  className="rounded-xl border-border/40 bg-background"
                />
              </Field>

              <Field label="Légende de l'image" hint="S'affiche sous l'image">
                <Input
                  name="imageCaption"
                  defaultValue={initialData ? (initialData as any).imageCaption : ""}
                  placeholder="Vue d'ensemble de..."
                  className="rounded-xl border-border/40 bg-background"
                />
              </Field>

              <div className="pt-4 border-t border-border/40">
                <MediaUpload
                  label="Image à la une"
                  value={thumbnailUrl}
                  onChange={setThumbnailUrl}
                  onRemove={() => setThumbnailUrl("")}
                />
                <input type="hidden" name="thumbnail" value={thumbnailUrl} />
              </div>
            </div>

            {/* Author Block */}
            <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/70 border-b border-border/40 pb-2">
                Auteur
              </p>
              
              <Field label="Nom">
                <Input
                  name="authorName"
                  defaultValue={initialData?.authorName}
                  placeholder="Farid DANKO"
                  className="rounded-xl border-border/40 bg-background"
                />
              </Field>

              <MediaUpload
                label="Photo de l'auteur"
                value={authorPhotoUrl}
                onChange={setAuthorPhotoUrl}
                onRemove={() => setAuthorPhotoUrl("")}
              />
              <input type="hidden" name="authorPhoto" value={authorPhotoUrl} />
            </div>

            {/* Actions */}
            <div className="sticky bottom-8 space-y-3">
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl h-12 bg-foreground text-background font-bold uppercase tracking-widest text-xs shadow-xl hover:opacity-90 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Publier / Enregistrer
                  </>
                )}
              </Button>
              <Link href="/admin/blog" className="block">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full rounded-2xl h-12 text-xs font-bold uppercase tracking-widest"
                >
                  Annuler & Quitter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
