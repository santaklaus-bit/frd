"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { updateDictionary } from "@/app/actions/content";
import { Save, Languages, Search } from "lucide-react";

export default function DictionaryEditor({
  enInitial,
  frInitial,
}: {
  enInitial: any;
  frInitial: any;
}) {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [data, setData] = useState(lang === "fr" ? frInitial : enInitial);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(lang === "fr" ? frInitial : enInitial);
  }, [lang, frInitial, enInitial]);

  const handleUpdate = (path: string, value: string) => {
    const newData = { ...data };
    const keys = path.split(".");
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setData(newData);
  };

  const onSave = async () => {
    setLoading(true);
    await updateDictionary(lang, data);
    setLoading(false);
  };

  const renderFields = (obj: any, prefix = "") => {
    return Object.entries(obj).map(([key, value]) => {
      const fullPath = prefix ? `${prefix}.${key}` : key;
      if (typeof value === "object" && value !== null) {
        return (
          <div key={fullPath} className="space-y-4 pt-4">
            <h3 className="text-sm font-bold uppercase tracking-widest opacity-40 border-b border-border/40 pb-2">
              {fullPath}
            </h3>
            <div className="pl-4 space-y-4">
              {renderFields(value, fullPath)}
            </div>
          </div>
        );
      }

      if (
        search &&
        !fullPath.toLowerCase().includes(search.toLowerCase()) &&
        !String(value).toLowerCase().includes(search.toLowerCase())
      ) {
        return null;
      }

      return (
        <div key={fullPath} className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">
            {fullPath}
          </label>
          <Input
            value={value as string}
            onChange={(e) => handleUpdate(fullPath, e.target.value)}
            className="rounded-xl border-border/40 bg-muted/20 focus:bg-background transition-all"
          />
        </div>
      );
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-tighter">
            Éditeur i18n
          </h1>
          <p className="text-muted-foreground font-medium">
            Modifiez les textes du site dans toutes les langues.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-muted p-1 rounded-2xl">
          <Button
            variant={lang === "fr" ? "default" : "ghost"}
            onClick={() => setLang("fr")}
            className={cn(
              "rounded-xl font-bold px-6",
              lang === "fr" && "bg-black text-white",
            )}
          >
            FR
          </Button>
          <Button
            variant={lang === "en" ? "default" : "ghost"}
            onClick={() => setLang("en")}
            className={cn(
              "rounded-xl font-bold px-6",
              lang === "en" && "bg-black text-white",
            )}
          >
            EN
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Rechercher une clé ou un texte..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 h-14 rounded-2xl border-border/40 shadow-sm"
        />
      </div>

      <Card className="border-border/40 shadow-sm rounded-3xl overflow-hidden pb-10">
        <CardContent className="p-8 space-y-6">
          {renderFields(data)}
        </CardContent>
      </Card>

      <div className="sticky bottom-8 left-0 right-0 flex justify-center">
        <Button
          onClick={onSave}
          disabled={loading}
          className="h-16 px-12 rounded-full font-bold uppercase tracking-widest bg-black text-white dark:bg-white dark:text-black shadow-2xl hover:scale-105 transition-all"
        >
          <Save className="mr-2 h-6 w-6" />
          {loading ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </div>
    </div>
  );
}

// Helper to use cn in the component
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
