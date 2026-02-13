"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateData } from "@/app/actions/content";
import { Plus, Trash2, Save, MoveUp, MoveDown } from "lucide-react";

export default function InitiativesManager({
  initialData,
}: {
  initialData: any[];
}) {
  const [items, setItems] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    setItems([
      ...items,
      {
        slug: "",
        icon: "Lightbulb",
        title: { fr: "", en: "" },
        description: { fr: "", en: "" },
        category: { fr: "", en: "" },
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: string,
    value: any,
    subfield?: string,
  ) => {
    const newItems = [...items];
    if (subfield) {
      (newItems[index] as any)[field][subfield] = value;
    } else {
      (newItems[index] as any)[field] = value;
    }
    setItems(newItems);
  };

  const move = (index: number, direction: number) => {
    if (index + direction < 0 || index + direction >= items.length) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index + direction];
    newItems[index + direction] = temp;
    setItems(newItems);
  };

  const onSave = async () => {
    setLoading(true);
    await updateData("initiatives", items);
    setLoading(false);
  };

  return (
    <div className="space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-tighter">
            Initiatives
          </h1>
          <p className="text-muted-foreground font-medium">
            Gérez vos projets et initiatives.
          </p>
        </div>
        <Button
          onClick={addItem}
          className="rounded-full bg-black text-white dark:bg-white dark:text-black font-bold uppercase tracking-widest px-8"
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter
        </Button>
      </div>

      <div className="space-y-6">
        {items.map((item, index) => (
          <Card
            key={index}
            className="border-border/40 shadow-sm rounded-3xl overflow-hidden"
          >
            <CardHeader className="flex flex-row items-center justify-between bg-muted/20 border-b border-border/40 p-6">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold bg-black text-white dark:bg-white dark:text-black w-8 h-8 flex items-center justify-center rounded-lg">
                  {index + 1}
                </span>
                <Input
                  value={item.slug}
                  onChange={(e) => updateItem(index, "slug", e.target.value)}
                  placeholder="slug-unique"
                  className="h-8 max-w-[200px] rounded-lg border-border/40 font-mono text-xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                >
                  <MoveUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1}
                >
                  <MoveDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-500 rounded-xl"
                  onClick={() => removeItem(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8 grid md:grid-cols-2 gap-8">
              {/* French Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40">
                  FRANÇAIS
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                    Titre
                  </label>
                  <Input
                    value={item.title.fr}
                    onChange={(e) =>
                      updateItem(index, "title", e.target.value, "fr")
                    }
                    className="rounded-xl border-border/40"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                    Catégorie
                  </label>
                  <Input
                    value={item.category.fr}
                    onChange={(e) =>
                      updateItem(index, "category", e.target.value, "fr")
                    }
                    className="rounded-xl border-border/40"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                    Description
                  </label>
                  <Textarea
                    value={item.description.fr}
                    onChange={(e) =>
                      updateItem(index, "description", e.target.value, "fr")
                    }
                    className="rounded-xl border-border/40 min-h-[100px]"
                  />
                </div>
              </div>

              {/* English Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40">
                  ENGLISH
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                    Title
                  </label>
                  <Input
                    value={item.title.en}
                    onChange={(e) =>
                      updateItem(index, "title", e.target.value, "en")
                    }
                    className="rounded-xl border-border/40"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                    Category
                  </label>
                  <Input
                    value={item.category.en}
                    onChange={(e) =>
                      updateItem(index, "category", e.target.value, "en")
                    }
                    className="rounded-xl border-border/40"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                    Description
                  </label>
                  <Textarea
                    value={item.description.en}
                    onChange={(e) =>
                      updateItem(index, "description", e.target.value, "en")
                    }
                    className="rounded-xl border-border/40 min-h-[100px]"
                  />
                </div>
              </div>

              <div className="md:col-span-2 flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                    Icon (Lucide name)
                  </label>
                  <Input
                    value={item.icon}
                    onChange={(e) => updateItem(index, "icon", e.target.value)}
                    placeholder="Target, Users, Lightbulb..."
                    className="rounded-xl border-border/40"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
