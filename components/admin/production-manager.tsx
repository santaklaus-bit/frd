"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateData } from "@/app/actions/content";
import {
  Plus,
  Trash2,
  Save,
  MoveUp,
  MoveDown,
  Edit2,
  Search,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@/components/ui/drawer";
import { MediaUpload } from "./media-upload";
import { toast } from "sonner";

export default function ProductionManager({
  initialData,
}: {
  initialData: any[];
}) {
  const [items, setItems] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.title.fr.toLowerCase().includes(search.toLowerCase()) ||
      item.slug.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const openAdd = () => {
    setEditingIndex(null);
    setEditForm({
      slug: "",
      icon: "Video",
      title: { fr: "", en: "" },
      description: { fr: "", en: "" },
      details: { fr: "", en: "" },
      href: "",
    });
    setIsDrawerOpen(true);
  };

  const openEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm({ ...items[index] });
    setIsDrawerOpen(true);
  };

  const saveEdit = () => {
    const newItems = [...items];
    if (editingIndex !== null) {
      newItems[editingIndex] = editForm;
    } else {
      newItems.unshift(editForm);
    }
    setItems(newItems);
    setIsDrawerOpen(false);
  };

  const removeItem = (index: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const move = (index: number, direction: number) => {
    if (index + direction < 0 || index + direction >= items.length) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index + direction];
    newItems[index + direction] = temp;
    setItems(newItems);
  };

  const onSaveAll = async () => {
    setLoading(true);
    try {
      await updateData("projects", items);
      toast.success("Toutes les modifications ont été enregistrées.");
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border/50">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Gestion du contenu
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">Projets</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={onSaveAll}
            disabled={loading}
            className="rounded-full px-6 h-10 bg-foreground text-background text-xs font-semibold uppercase tracking-widest hover:opacity-80 transition-all shadow-lg"
          >
            <Save className="mr-2 h-3.5 w-3.5" />
            {loading ? "Enregistrement..." : "Enregistrer tout"}
          </Button>
          <Button
            onClick={openAdd}
            variant="outline"
            className="rounded-full px-6 h-10 text-xs font-semibold uppercase tracking-widest"
          >
            <Plus className="mr-2 h-3.5 w-3.5" /> Ajouter
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-foreground" />
        <Input
          placeholder="Rechercher un projet..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-11 h-11 rounded-2xl border-border/40 bg-card hover:bg-muted/30 transition-all"
        />
      </div>

      {/* Table Section */}
      <div className="rounded-3xl border border-border/40 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/20">
            <TableRow className="hover:bg-transparent border-border/40">
              <TableHead className="w-16 text-center">Ordre</TableHead>
              <TableHead>Titre (FR)</TableHead>
              <TableHead>Détails</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item, index) => {
              const actualIndex = items.indexOf(item);
              return (
                <TableRow key={item.slug || index} className="group border-border/40">
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => move(actualIndex, -1)}
                        disabled={actualIndex === 0}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-20"
                      >
                        <MoveUp size={14} />
                      </button>
                      <span className="text-[10px] font-bold font-mono">
                        {actualIndex + 1}
                      </span>
                      <button
                        onClick={() => move(actualIndex, 1)}
                        disabled={actualIndex === items.length - 1}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-20"
                      >
                        <MoveDown size={14} />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{item.title.fr}</TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground truncate max-w-[200px] block">
                      {item.details.fr}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-[10px] text-muted-foreground">
                    {item.slug}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg hover:bg-muted"
                        onClick={() => openEdit(actualIndex)}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={() => removeItem(actualIndex)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Edit/Add Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-w-4xl">
          <DrawerHeader>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold tracking-tight">
                {editingIndex !== null ? "Modifier" : "Ajouter"} un projet
              </h2>
              <p className="text-xs text-muted-foreground">
                Remplissez les détails en français et en anglais.
              </p>
            </div>
          </DrawerHeader>
          <DrawerBody className="p-8 space-y-8">
            {editForm && (
              <>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary">
                      Français
                    </label>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          Titre
                        </label>
                        <Input
                          value={editForm.title.fr}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              title: { ...editForm.title, fr: e.target.value },
                            })
                          }
                          className="rounded-xl border-border/40"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          Détails (ex: Location, Année...)
                        </label>
                        <Input
                          value={editForm.details.fr}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              details: {
                                ...editForm.details,
                                fr: e.target.value,
                              },
                            })
                          }
                          className="rounded-xl border-border/40"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          Description
                        </label>
                        <Textarea
                          value={editForm.description.fr}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              description: {
                                ...editForm.description,
                                fr: e.target.value,
                              },
                            })
                          }
                          className="rounded-2xl border-border/40 min-h-[120px]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
                      English
                    </label>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          Title
                        </label>
                        <Input
                          value={editForm.title.en}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              title: { ...editForm.title, en: e.target.value },
                            })
                          }
                          className="rounded-xl border-border/40"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          Details
                        </label>
                        <Input
                          value={editForm.details.en}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              details: {
                                ...editForm.details,
                                en: e.target.value,
                              },
                            })
                          }
                          className="rounded-xl border-border/40"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          Description
                        </label>
                        <Textarea
                          value={editForm.description.en}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              description: {
                                ...editForm.description,
                                en: e.target.value,
                              },
                            })
                          }
                          className="rounded-2xl border-border/40 min-h-[120px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-4 border-t border-border/40">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Slug (URL)
                      </label>
                      <Input
                        value={editForm.slug}
                        onChange={(e) =>
                          setEditForm({ ...editForm, slug: e.target.value })
                        }
                        placeholder="slug-projet"
                        className="rounded-xl border-border/40 font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          Icone (Nom Lucide)
                        </label>
                        <Input
                          value={editForm.icon}
                          onChange={(e) =>
                            setEditForm({ ...editForm, icon: e.target.value })
                          }
                          placeholder="Video, Film, Mic..."
                          className="rounded-xl border-border/40"
                        />
                      </div>
                  </div>

                  <div className="space-y-1.5">
                    <MediaUpload
                      label="Fichier Multimédia (Vidéo, Image...)"
                      value={editForm.href}
                      onChange={(url) => setEditForm({ ...editForm, href: url })}
                      onRemove={() => setEditForm({ ...editForm, href: "" })}
                    />
                  </div>
                </div>
              </>
            )}
          </DrawerBody>
          <DrawerFooter className="p-6 bg-muted/20 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDrawerOpen(false)}
              className="rounded-full px-6"
            >
              Annuler
            </Button>
            <Button
              onClick={saveEdit}
              className="rounded-full px-8 bg-foreground text-background font-semibold uppercase tracking-widest text-xs h-10 hover:opacity-80 transition-all"
            >
              Appliquer les changements
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
