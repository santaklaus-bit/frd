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
    title: { fr: string; en: string };
    description: { fr: string; en: string };
    date: string;
    thumbnail: string;
    authorName: string;
    authorPhoto: string;
    content: { fr: string; en: string };
    readTime?: { fr: string; en: string };
    pdfUrl?: { fr: string; en: string };
    audioUrl?: { fr: string; en: string };
    imageCaption?: { fr: string; en: string };
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
  const [contentFr, setContentFr] = useState(initialData?.content?.fr || "");
  const [contentEn, setContentEn] = useState(initialData?.content?.en || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnail || "");
  const [authorPhotoUrl, setAuthorPhotoUrl] = useState(
    initialData?.authorPhoto || ""
  );
  const [pdfUrlFr, setPdfUrlFr] = useState(initialData?.pdfUrl?.fr || "");
  const [pdfUrlEn, setPdfUrlEn] = useState(initialData?.pdfUrl?.en || "");
  const [audioUrlFr, setAudioUrlFr] = useState(initialData?.audioUrl?.fr || "");
  const [audioUrlEn, setAudioUrlEn] = useState(initialData?.audioUrl?.en || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [slugEn, setSlugEn] = useState((initialData as any)?.slugEn || "");

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      // Localized values are handled separately because they are in state or require specific naming
      formData.set("contentFr", contentFr);
      formData.set("contentEn", contentEn);
      formData.set("thumbnail", thumbnailUrl);
      formData.set("authorPhoto", authorPhotoUrl);
      formData.set("pdfUrlFr", pdfUrlFr);
      formData.set("pdfUrlEn", pdfUrlEn);
      formData.set("audioUrlFr", audioUrlFr);
      formData.set("audioUrlEn", audioUrlEn);
      formData.set("slug", slug);
      formData.set("slugEn", slugEn || slug);

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
    <div className="space-y-8 max-w-[1600px] mx-auto pb-20">
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
        <div className="space-y-0.5 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {initialData ? "Modifier" : "Créer"}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {initialData ? (initialData.title?.fr || initialData.title?.en) : "Nouvel article"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid xl:grid-cols-3 gap-8">
          {/* Main Bilingual Editors Column */}
          <div className="xl:col-span-2 grid md:grid-cols-2 gap-8">
            
            {/* Version Française */}
            <div className="space-y-8 bg-card p-6 rounded-3xl border border-border/40 shadow-sm">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary border-b pb-2">
                Version Française
              </h2>

              <Field label="Titre de l'article (FR)">
                <Input
                  name="titleFr"
                  defaultValue={initialData?.title?.fr}
                  placeholder="Le futur de l'entrepreneuriat social..."
                  required
                  onChange={(e) => {
                    if (!initialData && !slug) {
                      setSlug(generateSlug(e.target.value));
                    }
                  }}
                  className="rounded-xl border-border/40 bg-background text-md font-medium h-11"
                />
              </Field>

              <Field label="Description / Résumé SEO (FR)" hint="Court résumé">
                <Textarea
                  name="descriptionFr"
                  defaultValue={initialData?.description?.fr}
                  placeholder="Un court résumé en français..."
                  className="rounded-xl border-border/40 bg-background min-h-[80px] resize-none text-sm"
                />
              </Field>

              {/* Editor Block */}
              <div className="rounded-2xl border border-border/40 bg-card overflow-hidden">
                <div className="px-4 py-2 border-b border-border/40 bg-muted/20 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/70">
                    Contenu (FR)
                  </p>
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                    {Math.max(1, Math.round((contentFr?.replace(/<[^>]*>?/gm, '').trim().split(/\s+/).filter(Boolean).length || 0) / 200))} min
                  </span>
                </div>
                <div className="p-0">
                  <WysiwygEditor
                    value={contentFr}
                    onChange={setContentFr}
                    placeholder="Rédigez en français..."
                    className="min-h-[400px] border-0"
                  />
                </div>
              </div>

              <Field label="Légende de l'image (FR)" hint="Sous l'image">
                <Input
                  name="imageCaptionFr"
                  defaultValue={initialData?.imageCaption?.fr}
                  placeholder="Vue d'ensemble de..."
                  className="rounded-xl border-border/40 bg-background text-sm"
                />
              </Field>

              <Field label="Temps de lecture (FR)" hint="ex: 5 min">
                <Input
                  name="readTimeFr"
                  defaultValue={initialData?.readTime?.fr}
                  placeholder={`${Math.max(1, Math.round((contentFr?.replace(/<[^>]*>?/gm, '').trim().split(/\s+/).filter(Boolean).length || 0) / 200))} min`}
                  className="rounded-xl border-border/40 bg-background text-sm"
                />
              </Field>

              <div className="space-y-4 pt-4 border-t border-border/40">
                <MediaUpload
                  label="Version PDF (FR)"
                  value={pdfUrlFr}
                  onChange={setPdfUrlFr}
                  onRemove={() => setPdfUrlFr("")}
                  accept="application/pdf"
                />
                <input type="hidden" name="pdfUrlFr" value={pdfUrlFr} />

                <MediaUpload
                  label="Version Audio (FR)"
                  value={audioUrlFr}
                  onChange={setAudioUrlFr}
                  onRemove={() => setAudioUrlFr("")}
                  accept="audio/*"
                />
                <input type="hidden" name="audioUrlFr" value={audioUrlFr} />
              </div>
            </div>

            {/* English Version */}
            <div className="space-y-8 bg-card p-6 rounded-3xl border border-border/40 shadow-sm">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary border-b pb-2">
                English Version
              </h2>

              <Field label="Article Title (EN)">
                <Input
                  name="titleEn"
                  defaultValue={initialData?.title?.en}
                  placeholder="The future of social entrepreneurship..."
                  required
                  onChange={(e) => {
                    if (!initialData && !slugEn) {
                      setSlugEn(generateSlug(e.target.value));
                    }
                  }}
                  className="rounded-xl border-border/40 bg-background text-md font-medium h-11"
                />
              </Field>

              <Field label="Description / SEO Summary (EN)" hint="Short summary">
                <Textarea
                  name="descriptionEn"
                  defaultValue={initialData?.description?.en}
                  placeholder="A short summary in English..."
                  className="rounded-xl border-border/40 bg-background min-h-[80px] resize-none text-sm"
                />
              </Field>

              {/* Editor Block */}
              <div className="rounded-2xl border border-border/40 bg-card overflow-hidden">
                <div className="px-4 py-2 border-b border-border/40 bg-muted/20 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/70">
                    Content (EN)
                  </p>
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                    {Math.max(1, Math.round((contentEn?.replace(/<[^>]*>?/gm, '').trim().split(/\s+/).filter(Boolean).length || 0) / 200))} min
                  </span>
                </div>
                <div className="p-0">
                  <WysiwygEditor
                    value={contentEn}
                    onChange={setContentEn}
                    placeholder="Write in English..."
                    className="min-h-[400px] border-0"
                  />
                </div>
              </div>

              <Field label="Image Caption (EN)" hint="Under the image">
                <Input
                  name="imageCaptionEn"
                  defaultValue={initialData?.imageCaption?.en}
                  placeholder="Overview of..."
                  className="rounded-xl border-border/40 bg-background text-sm"
                />
              </Field>

              <Field label="Reading Time (EN)" hint="e.g. 5 min">
                <Input
                  name="readTimeEn"
                  defaultValue={initialData?.readTime?.en}
                  placeholder={`${Math.max(1, Math.round((contentEn?.replace(/<[^>]*>?/gm, '').trim().split(/\s+/).filter(Boolean).length || 0) / 200))} min`}
                  className="rounded-xl border-border/40 bg-background text-sm"
                />
              </Field>

              <div className="space-y-4 pt-4 border-t border-border/40">
                <MediaUpload
                  label="PDF Version (EN)"
                  value={pdfUrlEn}
                  onChange={setPdfUrlEn}
                  onRemove={() => setPdfUrlEn("")}
                  accept="application/pdf"
                />
                <input type="hidden" name="pdfUrlEn" value={pdfUrlEn} />

                <MediaUpload
                  label="Audio Version (EN)"
                  value={audioUrlEn}
                  onChange={setAudioUrlEn}
                  onRemove={() => setAudioUrlEn("")}
                  accept="audio/*"
                />
                <input type="hidden" name="audioUrlEn" value={audioUrlEn} />
              </div>
            </div>

          </div>

          {/* Sidebar Settings Column */}
          <div className="space-y-8">
            {/* Metadata & Media Settings */}
            <div className="rounded-3xl border border-border/40 bg-card p-6 space-y-6 shadow-sm">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary border-b pb-2">
                Paramètres Généraux
              </h2>

              <Field
                label="Slug FR (URL)"
                hint={initialData ? "Lecture seule" : "Unique"}
              >
                <Input
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  placeholder="mon-article-seo"
                  required
                  readOnly={!!initialData}
                  className="rounded-xl border-border/40 bg-background font-mono text-xs"
                />
              </Field>

              <Field
                label="Slug EN (URL anglais)"
                hint={initialData ? "Modifiable" : "Auto"}
              >
                <Input
                  name="slugEn"
                  value={slugEn}
                  onChange={(e) => setSlugEn(generateSlug(e.target.value))}
                  placeholder="my-seo-article"
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
              
              <div className="pt-4 border-t border-border/40">
                <MediaUpload
                  label="Image à la une (Partagée)"
                  value={thumbnailUrl}
                  onChange={setThumbnailUrl}
                  onRemove={() => setThumbnailUrl("")}
                />
                <input type="hidden" name="thumbnail" value={thumbnailUrl} />
              </div>
            </div>

            {/* Author Block */}
            <div className="rounded-3xl border border-border/40 bg-card p-6 space-y-6 shadow-sm">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary border-b pb-2">
                Auteur
              </h2>
              
              <Field label="Nom">
                <Input
                  name="authorName"
                  defaultValue={initialData?.authorName || "Farid DANKO"}
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

            {/* Actions Sticky panel */}
            <div className="sticky top-8 space-y-3">
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl h-12 bg-foreground text-background font-bold uppercase tracking-widest text-xs shadow-xl hover:opacity-90 transition-all cursor-pointer"
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

