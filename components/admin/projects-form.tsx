"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveSingleItem } from "@/app/actions/content";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import { MediaUpload } from "./media-upload";
import dynamic from "next/dynamic";

const WysiwygEditor = dynamic(
  () => import("./wysiwyg-editor").then((mod) => mod.WysiwygEditor),
  { ssr: false }
);

export default function ProjectsForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    slug: initialData?.slug || "",
    title: {
      fr: initialData?.title?.fr || "",
      en: initialData?.title?.en || "",
    },
    category: {
      fr: initialData?.category?.fr || "",
      en: initialData?.category?.en || "",
    },
    description: {
      fr: initialData?.description?.fr || "",
      en: initialData?.description?.en || "",
    },
    details: {
      fr: initialData?.details?.fr || "",
      en: initialData?.details?.en || "",
    },
    image: initialData?.image || "",
    imageEn: initialData?.imageEn || "",
    imageCaption: {
      fr: initialData?.imageCaption?.fr || "",
      en: initialData?.imageCaption?.en || ""
    },
    href: initialData?.href || "",
    pdfUrl: initialData?.pdfUrl || "",
    isFeatured: initialData?.isFeatured || false,
  });

  const onSave = async () => {
    if (!formData.title.fr || !formData.slug) {
      toast.error("Le titre (FR) et le slug sont requis.");
      return;
    }

    setLoading(true);
    try {
      await saveSingleItem("projects", formData, initialData?.slug);
      toast.success("Projet sauvegardé avec succès.");
      router.push("/admin/projects");
    } catch (err) {
      toast.error("Erreur lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 pb-6 border-b border-border/50">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/projects")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {initialData ? "Modification de Projet" : "Nouveau Projet"}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            {initialData ? "Éditer le projet" : "Nouveau projet"}
          </h1>
        </div>
        <Button
          onClick={onSave}
          disabled={loading}
          className="rounded-full px-6 h-10 bg-foreground text-background text-xs font-semibold uppercase tracking-widest hover:opacity-80 transition-all shadow-lg"
        >
          <Save className="mr-2 h-3.5 w-3.5" />
          {loading ? "Sauvegarde..." : "Enregistrer"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* French Section */}
        <div className="space-y-6 bg-card p-6 rounded-3xl border border-border/40 shadow-sm">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary border-b pb-2">
            Version Française
          </h2>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Titre</label>
              <Input
                value={formData.title.fr}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    title: { ...prev.title, fr: newTitle },
                    slug: (!prev.slug || !initialData) ? generateSlug(newTitle) : prev.slug
                  }));
                }}
                className="rounded-xl border-border/40"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Catégorie</label>
              <Input
                value={formData.category.fr}
                onChange={(e) => setFormData(prev => ({ ...prev, category: { ...prev.category, fr: e.target.value } })) }
                className="rounded-xl border-border/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Légende de l'image (FR)</label>
              <Input
                value={formData.imageCaption.fr}
                onChange={(e) => setFormData(prev => ({ ...prev, imageCaption: { ...prev.imageCaption, fr: e.target.value } })) }
                className="rounded-xl border-border/40"
                placeholder="Ex: Vue rapprochée de..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Description (courte)</label>
              <Textarea
                value={formData.description.fr}
                onChange={(e) => setFormData(prev => ({ ...prev, description: { ...prev.description, fr: e.target.value } })) }
                className="rounded-2xl border-border/40 min-h-[100px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Détails</label>
              <WysiwygEditor
                value={formData.details.fr}
                onChange={(val) => setFormData(prev => ({ ...prev, details: { ...prev.details, fr: val } }))}
                holder="editor-details-fr"
                className="min-h-[300px]"
              />
            </div>
          </div>
        </div>

        {/* English Section */}
        <div className="space-y-6 bg-card p-6 rounded-3xl border border-border/40 shadow-sm opacity-90 lg:opacity-100">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary border-b pb-2 flex items-center gap-2">
             English Version
          </h2>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Title</label>
              <Input
                value={formData.title.en}
                onChange={(e) => setFormData(prev => ({ ...prev, title: { ...prev.title, en: e.target.value } })) }
                className="rounded-xl border-border/40"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Category</label>
              <Input
                value={formData.category.en}
                onChange={(e) => setFormData(prev => ({ ...prev, category: { ...prev.category, en: e.target.value } })) }
                className="rounded-xl border-border/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Image Caption (EN)</label>
              <Input
                value={formData.imageCaption.en}
                onChange={(e) => setFormData(prev => ({ ...prev, imageCaption: { ...prev.imageCaption, en: e.target.value } })) }
                className="rounded-xl border-border/40"
                placeholder="Ex: Close up view of..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Short Description</label>
              <Textarea
                value={formData.description.en}
                onChange={(e) => setFormData(prev => ({ ...prev, description: { ...prev.description, en: e.target.value } })) }
                className="rounded-2xl border-border/40 min-h-[100px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Details</label>
              <WysiwygEditor
                value={formData.details.en}
                onChange={(val) => setFormData(prev => ({ ...prev, details: { ...prev.details, en: val } }))}
                holder="editor-details-en"
                className="min-h-[300px]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6 bg-card p-6 rounded-3xl border border-border/40 shadow-sm">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary border-b pb-2 mb-4">
            Média & URL
          </h2>
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Image Principale (FR)</label>
              <MediaUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                onRemove={() => setFormData({ ...formData, image: "" })}
                label="Image (FR)"
                aspect={16 / 9}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Image Principale (EN)</label>
              <MediaUpload
                value={formData.imageEn}
                onChange={(url) => setFormData({ ...formData, imageEn: url })}
                onRemove={() => setFormData({ ...formData, imageEn: "" })}
                label="Image (EN)"
                aspect={16 / 9}
              />
            </div>
            <div className="space-y-1.5 pt-4 border-t border-border/40">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Format PDF (Document)</label>
              <MediaUpload
                value={formData.pdfUrl || ""}
                onChange={(url) => setFormData({ ...formData, pdfUrl: url })}
                onRemove={() => setFormData({ ...formData, pdfUrl: "" })}
                accept="application/pdf"
                label="Fiche technique / Brochure"
              />
            </div>
            <div className="space-y-1.5 pt-4 border-t border-border/40">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Lien Externe (Href)</label>
              <Input
                value={formData.href}
                onChange={(e) => setFormData({ ...formData, href: e.target.value }) }
                placeholder="https://..."
                className="rounded-xl border-border/40"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6 bg-card p-6 rounded-3xl border border-border/40 shadow-sm self-start">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary border-b pb-2 mb-4">
            Slug & Paramètres
          </h2>
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Slug (URL)</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value }) }
                placeholder="slug-projet"
                className="rounded-xl border-border/40 font-mono"
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/40">
               <div className="space-y-0.5">
                  <p className="text-xs font-bold text-foreground">Mettre en avant</p>
                  <p className="text-[10px] text-muted-foreground">Afficher ce projet sur la page d'accueil</p>
               </div>
               <input 
                  type="checkbox" 
                  className="h-5 w-5 rounded border-border/40 accent-primary"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
