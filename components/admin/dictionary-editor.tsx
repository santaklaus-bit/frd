"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateDictionary } from "@/app/actions/content";
import { Save, Search, ChevronDown, ChevronRight, Globe, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────

type FieldPath = { path: string; value: string };

function flattenObject(obj: any, prefix = ""): FieldPath[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null) {
      return flattenObject(value, fullPath);
    }
    return [{ path: fullPath, value: String(value ?? "") }];
  });
}

function groupBySection(fields: FieldPath[]): Record<string, FieldPath[]> {
  const groups: Record<string, FieldPath[]> = {};
  for (const field of fields) {
    const section = field.path.split(".")[0];
    if (!groups[section]) groups[section] = [];
    groups[section].push(field);
  }
  return groups;
}

const SECTION_LABELS: Record<string, string> = {
  nav: "🧭 Navigation",
  hero: "🏠 Page d'accueil",
  about: "👤 À propos",
  expertise: "💡 Expertise",
  projects: "🗂 Projets",
  blog: "📝 Blog",
  contact: "📬 Contact",
  footer: "📌 Pied de page",
  seo: "🔍 SEO & Méta",
  newsletter: "📧 Newsletter",
  social: "🌐 Réseaux sociaux",
  privacy: "🔒 Confidentialité",
  terms: "📄 Conditions",
  notFound: "❌ Page 404",
  common: "⚙️ Commun",
};

function getFriendlyLabel(path: string): string {
  const parts = path.split(".");
  // Remove the section prefix (first part)
  const label = parts.slice(1).join(" › ");
  return label
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

// ─── Section Component ────────────────────────────────────────────────────────

function SectionBlock({
  title,
  fields,
  search,
  onUpdate,
}: {
  title: string;
  fields: FieldPath[];
  search: string;
  onUpdate: (path: string, value: string) => void;
}) {
  const [open, setOpen] = useState(true);

  const filtered = search
    ? fields.filter(
        (f) =>
          f.path.toLowerCase().includes(search.toLowerCase()) ||
          f.value.toLowerCase().includes(search.toLowerCase()) ||
          getFriendlyLabel(f.path).toLowerCase().includes(search.toLowerCase())
      )
    : fields;

  if (filtered.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border/40 bg-card overflow-hidden shadow-sm">
      {/* Section header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-base font-bold tracking-tight">{title}</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {filtered.length} champ{filtered.length > 1 ? "s" : ""}
          </span>
        </div>
        {open ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Fields */}
      {open && (
        <div className="divide-y divide-border/30">
          {filtered.map((field) => {
            const label = getFriendlyLabel(field.path);
            const isLong = field.value.length > 80;
            return (
              <div key={field.path} className="px-5 py-4 space-y-1.5 hover:bg-muted/10 transition-colors">
                <label className="block text-xs font-semibold text-muted-foreground">
                  {label}
                </label>
                {isLong ? (
                  <Textarea
                    value={field.value}
                    onChange={(e) => onUpdate(field.path, e.target.value)}
                    className="rounded-xl border-border/40 bg-background resize-none text-sm min-h-[80px]"
                    rows={3}
                  />
                ) : (
                  <Input
                    value={field.value}
                    onChange={(e) => onUpdate(field.path, e.target.value)}
                    className="rounded-xl border-border/40 bg-background text-sm"
                  />
                )}
                <p className="text-[10px] text-muted-foreground/40 font-mono">{field.path}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DictionaryEditor({
  enInitial,
  frInitial,
}: {
  enInitial: any;
  frInitial: any;
}) {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [frData, setFrData] = useState<any>(frInitial);
  const [enData, setEnData] = useState<any>(enInitial);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const currentData = lang === "fr" ? frData : enData;

  const setCurrentData = (updater: (prev: any) => any) => {
    if (lang === "fr") {
      setFrData(updater);
    } else {
      setEnData(updater);
    }
  };

  // Deep update by dot-path
  const handleUpdate = (path: string, value: string) => {
    setCurrentData((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev)); // deep clone
      const keys = path.split(".");
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
    setSaved(false);
  };

  const onSave = async () => {
    setLoading(true);
    try {
      await updateDictionary(lang, currentData);
      setSaved(true);
      toast.success(`Textes ${lang === "fr" ? "français" : "anglais"} enregistrés !`);
    } catch (e) {
      toast.error("Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  const fields = flattenObject(currentData);
  const grouped = groupBySection(fields);
  const searchResultCount = search
    ? fields.filter(
        (f) =>
          f.path.toLowerCase().includes(search.toLowerCase()) ||
          f.value.toLowerCase().includes(search.toLowerCase()) ||
          getFriendlyLabel(f.path).toLowerCase().includes(search.toLowerCase())
      ).length
    : null;

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="flex items-end justify-between pb-6 border-b border-border/50">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Contenu du site
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">Textes & Traductions</h1>
          <p className="text-sm text-muted-foreground pt-1">
            Modifiez les textes affichés sur le site pour chaque langue.
          </p>
        </div>

        {/* Lang switcher */}
        <div className="flex items-center gap-1 p-1 bg-muted rounded-2xl">
          <button
            onClick={() => { setLang("fr"); setSaved(false); }}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              lang === "fr"
                ? "bg-foreground text-background shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🇫🇷 Français
          </button>
          <button
            onClick={() => { setLang("en"); setSaved(false); }}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              lang === "en"
                ? "bg-foreground text-background shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🇬🇧 English
          </button>
        </div>
      </div>

      {/* Explainer banner */}
      <div className="flex items-start gap-4 p-4 rounded-2xl border border-border/40 bg-muted/20">
        <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground leading-relaxed">
          Vous modifiez la version <strong className="text-foreground">{lang === "fr" ? "française 🇫🇷" : "anglaise 🇬🇧"}</strong> du site.
          Les sections ci-dessous correspondent aux différentes pages. Cliquez sur une section pour la dérouler,
          modifiez le texte, puis cliquez sur <strong className="text-foreground">Enregistrer</strong>.
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un texte ou une section..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-11 h-12 rounded-2xl border-border/40"
        />
        {searchResultCount !== null && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {searchResultCount} résultat{searchResultCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {Object.entries(grouped).map(([section, sectionFields]) => (
          <SectionBlock
            key={`${lang}-${section}`}
            title={SECTION_LABELS[section] || `📁 ${section}`}
            fields={sectionFields}
            search={search}
            onUpdate={handleUpdate}
          />
        ))}
      </div>

      {/* Sticky save bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border/50 px-6 py-4 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {saved ? (
            <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="h-4 w-4" /> Enregistré
            </span>
          ) : (
            "Modifications non enregistrées"
          )}
        </p>
        <Button
          onClick={onSave}
          disabled={loading}
          className="h-11 px-8 rounded-2xl font-bold uppercase tracking-widest bg-foreground text-background hover:opacity-90 shadow-xl transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer les modifications
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
