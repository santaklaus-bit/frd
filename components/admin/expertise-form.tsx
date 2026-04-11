"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveSingleItem, getProjectList } from "@/app/actions/content";
import { toast } from "sonner";
import { ArrowLeft, Save, Check } from "lucide-react";
import dynamic from "next/dynamic";

const WysiwygEditor = dynamic(
  () => import("./wysiwyg-editor").then((mod) => mod.WysiwygEditor),
  { ssr: false }
);

export default function ExpertiseForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [projectList, setProjectList] = useState<{ slug: string; title: { fr: string; en: string } }[]>([]);

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
    content: {
      fr: initialData?.content?.fr || "",
      en: initialData?.content?.en || "",
    },
    details: {
      fr: initialData?.details?.fr || "",
      en: initialData?.details?.en || "",
    },
    imageCaption: {
      fr: initialData?.imageCaption?.fr || "",
      en: initialData?.imageCaption?.en || "",
    },
    projectSlugs: (initialData?.projectSlugs as string[]) || [],
  });

  useEffect(() => {
    getProjectList().then(setProjectList).catch(() => {});
  }, []);

  const toggleProject = (slug: string) => {
    setFormData((prev) => {
      const current = prev.projectSlugs || [];
      const updated = current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [...current, slug];
      return { ...prev, projectSlugs: updated };
    });
  };

  const onSave = async () => {
    if (!formData.title.fr || !formData.slug) {
      toast.error("Le titre (FR) et le slug sont requis.");
      return;
    }

    setLoading(true);
    try {
      await saveSingleItem("expertise", formData, initialData?.slug);
      toast.success("Expertise sauvegardée avec succès.");
      router.push("/admin/expertise");
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
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/expertise")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {initialData ? "Modification" : "Création"}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            {initialData ? "Éditer l'expertise" : "Nouvelle expertise"}
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
                placeholder="Ex: Description de l'image..."
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
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Contenu (Complet)</label>
              <WysiwygEditor
                value={formData.content.fr}
                onChange={(val) => setFormData(prev => ({ ...prev, content: { ...prev.content, fr: val } }))}
                holder="editor-content-fr"
                className="min-h-[400px]"
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
                placeholder="Ex: Image description..."
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
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Full Content</label>
              <WysiwygEditor
                value={formData.content.en}
                onChange={(val) => setFormData(prev => ({ ...prev, content: { ...prev.content, en: val } }))}
                holder="editor-content-en"
                className="min-h-[400px]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-3xl border border-border/40 shadow-sm max-w-2xl">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary border-b pb-2 mb-4">
          Paramètres Généraux
        </h2>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Slug (URL)</label>
          <Input
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value }) }
            placeholder="slug-expertise"
            className="rounded-xl border-border/40 font-mono"
          />
        </div>
      </div>

      {/* Project Linking Section */}
      <div className="space-y-4 bg-card p-6 rounded-3xl border border-border/40 shadow-sm">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary border-b pb-2 mb-1">
            Projets Liés
          </h2>
          <p className="text-[10px] text-muted-foreground mt-2 mb-4">
            Sélectionnez les projets qui utilisent cette expertise.
          </p>
        </div>
        {projectList.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">Aucun projet disponible.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {projectList.map((proj) => {
              const isSelected = formData.projectSlugs?.includes(proj.slug);
              return (
                <button
                  key={proj.slug}
                  type="button"
                  onClick={() => toggleProject(proj.slug)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-muted/40 text-muted-foreground border-border/40 hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3" />}
                  {proj.title.fr}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
