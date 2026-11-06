"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateDictionary } from "@/app/actions/content";
import { Save, Search, ChevronDown, ChevronRight, Globe, CheckCircle2, Loader2, Menu, X } from "lucide-react";
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
  home: "🏠 Accueil",
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
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

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

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    sectionRefs.current[section]?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  const sections = Object.keys(grouped).sort();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } border-r border-border/40 bg-muted/30 overflow-y-auto transition-all duration-300 flex-shrink-0`}
      >
        <div className="sticky top-0 z-10 bg-muted/50 backdrop-blur-xl border-b border-border/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sections</h3>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <Input
            placeholder="Filtrer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 text-xs rounded-lg border-border/40"
          />
        </div>
        <nav className="p-2 space-y-1">
          {sections.map((section) => {
            const label = SECTION_LABELS[section] || `📁 ${section}`;
            const visible = !search || label.toLowerCase().includes(search.toLowerCase()) ||
              grouped[section]?.some(f =>
                f.path.toLowerCase().includes(search.toLowerCase()) ||
                f.value.toLowerCase().includes(search.toLowerCase())
              );

            if (!visible) return null;

            return (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all truncate ${
                  activeSection === section
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
                title={label}
              >
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border/50 bg-background/95 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Menu className="h-5 w-5 text-muted-foreground" />
              </button>
            )}
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                Contenu du site
              </p>
              <h1 className="text-2xl font-semibold">Textes & Traductions</h1>
            </div>
          </div>

          {/* Lang switcher */}
          <div className="flex items-center gap-1 p-1 bg-muted rounded-2xl">
            <button
              onClick={() => { setLang("fr"); setSaved(false); setActiveSection(null); }}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                lang === "fr"
                  ? "bg-foreground text-background shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              🇫🇷 FR
            </button>
            <button
              onClick={() => { setLang("en"); setSaved(false); setActiveSection(null); }}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                lang === "en"
                  ? "bg-foreground text-background shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              🇬🇧 EN
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8 space-y-4">
            {/* Explainer */}
            <div className="flex items-start gap-3 p-4 rounded-xl border border-border/40 bg-muted/20 mb-6">
              <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                Vous modifiez la version <strong className="text-foreground">{lang === "fr" ? "française" : "anglaise"}</strong>.
                Utilisez la barre latérale pour naviguer entre les sections.
              </div>
            </div>

            {/* Sections */}
            {sections.map((section) => (
              <div
                key={`${lang}-${section}`}
                ref={(el) => {
                  if (el) sectionRefs.current[section] = el;
                }}
              >
                <SectionBlock
                  title={SECTION_LABELS[section] || `📁 ${section}`}
                  fields={grouped[section]}
                  search={search}
                  onUpdate={handleUpdate}
                />
              </div>
            ))}

            <div className="h-24" />
          </div>
        </div>
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
              Enregistrer
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
