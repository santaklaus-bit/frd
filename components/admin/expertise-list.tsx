"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateData, deleteItem } from "@/app/actions/content";
import { Plus, Trash2, Save, MoveUp, MoveDown, Edit2, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function ExpertiseList({ initialData }: { initialData: any[] }) {
  const [items, setItems] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.title.fr.toLowerCase().includes(search.toLowerCase()) ||
        item.slug.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const removeConfirmedItem = async () => {
    if (itemToDelete) {
      setLoading(true);
      try {
        await deleteItem("expertise", itemToDelete);
        setItems(items.filter((i) => i.slug !== itemToDelete));
        toast.success("Élément supprimé.");
      } catch (err) {
        toast.error("Erreur lors de la suppression.");
      } finally {
        setLoading(false);
        setItemToDelete(null);
      }
    }
  };

  const move = async (index: number, direction: number) => {
    if (index + direction < 0 || index + direction >= items.length) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index + direction];
    newItems[index + direction] = temp;
    
    setItems(newItems);
  };

  const onSaveOrder = async () => {
    setLoading(true);
    try {
      await updateData("expertise", items);
      toast.success("Ordre enregistré.");
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement de l'ordre.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border/50">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Gestion du contenu
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">Expertises</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={onSaveOrder}
            disabled={loading}
            className="rounded-full px-6 h-10 bg-foreground text-background text-xs font-semibold uppercase tracking-widest hover:opacity-80 transition-all shadow-lg"
          >
            <Save className="mr-2 h-3.5 w-3.5" />
            {loading ? "Enregistrement..." : "Enregistrer l'ordre"}
          </Button>
          <Button
            onClick={() => router.push("/admin/expertise/create")}
            variant="outline"
            className="rounded-full px-6 h-10 text-xs font-semibold uppercase tracking-widest"
          >
            <Plus className="mr-2 h-3.5 w-3.5" /> Ajouter
          </Button>
        </div>
      </div>

      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-foreground" />
        <Input
          placeholder="Rechercher une expertise..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-11 h-11 rounded-2xl border-border/40 bg-card hover:bg-muted/30 transition-all"
        />
      </div>

      <div className="rounded-3xl border border-border/40 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/20">
            <TableRow className="hover:bg-transparent border-border/40">
              <TableHead className="w-16 text-center">Ordre</TableHead>
              <TableHead>Titre (FR)</TableHead>
              <TableHead>Catégorie</TableHead>
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground">
                      {item.category.fr}
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
                        onClick={() => router.push(`/admin/expertise/edit/${item.slug}`)}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={() => setItemToDelete(item.slug)}
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

      <ConfirmDialog 
        isOpen={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        onConfirm={removeConfirmedItem}
      />
    </div>
  );
}
