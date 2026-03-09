"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createOrUpdateBlogPost } from "@/app/actions/blog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { WysiwygEditor } from "./wysiwyg-editor";

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
        {hint && <span className="text-[10px] text-muted-foreground/50">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(initialData?.content || "");
  const [previewURL, setPreviewURL] = useState<string | null>(initialData?.thumbnail || null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewURL(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
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
        {/* Metadata block */}
        <div className="rounded-2xl border border-border/40 bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border/40 bg-muted/20">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/70">
              Métadonnées
            </p>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <Field label="Slug (URL)" hint={initialData ? "Lecture seule" : "unique"}>
                <Input
                  name="slug"
                  defaultValue={initialData?.slug}
                  placeholder="mon-article-seo"
                  required
                  readOnly={!!initialData}
                  className="rounded-xl border-border/40 bg-background"
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
            </div>

            <Field label="Titre">
              <Input
                name="title"
                defaultValue={initialData?.title}
                placeholder="Le futur de l'entrepreneuriat social..."
                required
                className="rounded-xl border-border/40 bg-background"
              />
            </Field>

            <Field label="Image de couverture" hint="Formats recommandés : JPG, PNG, WEBP">
              <input type="hidden" name="currentThumbnail" value={initialData?.thumbnail || ""} />
              <div className="flex items-center gap-6">
                {previewURL ? (
                  <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-xl border border-border/40">
                    <img src={previewURL} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex h-24 w-40 shrink-0 items-center justify-center rounded-xl border border-dashed border-border/40 bg-muted/20">
                    <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    name="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="rounded-xl border-border/40 bg-background file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  <p className="mt-2 text-[10px] text-muted-foreground">Sélectionnez une nouvelle image pour remplacer l'existante.</p>
                </div>
              </div>
            </Field>

            <Field label="Description" hint="Résumé SEO">
              <Textarea
                name="description"
                defaultValue={initialData?.description}
                placeholder="Un court résumé de l'article visible dans les résultats de recherche..."
                className="rounded-xl border-border/40 bg-background min-h-[80px] resize-none"
              />
            </Field>
          </div>
        </div>

        {/* Content block */}
        <div className="rounded-2xl border border-border/40 bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border/40 bg-muted/20 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/70">
              Contenu
            </p>
            <span className="text-[10px] text-muted-foreground/50">
              Éditeur de texte enrichi complet
            </span>
          </div>
          <div className="p-6">
            <input type="hidden" name="content" value={content} />
            <WysiwygEditor
              value={content}
              onChange={setContent}
              placeholder="Commencez à rédiger votre article ici..."
              className="min-h-[480px]"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/admin/blog">
            <Button variant="outline" type="button" className="rounded-full px-6 h-9 text-xs font-semibold uppercase tracking-widest">
              Annuler
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={loading}
            className="rounded-full px-8 h-9 bg-foreground text-background text-xs font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity"
          >
            {loading ? (
              <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />Sauvegarde...</>
            ) : (
              <><Save className="mr-2 h-3.5 w-3.5" />Enregistrer</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
