"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteBlogPost } from "@/app/actions/blog";
import { toast } from "sonner";

export function BlogDeleteButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Supprimer cet article ? Cette action est irréversible.")) return;
    setLoading(true);
    try {
      await deleteBlogPost(slug);
      toast.success("Article supprimé.");
      router.refresh();
    } catch (err) {
      console.error("[BlogDeleteButton]", err);
      toast.error("Une erreur est survenue lors de la suppression.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all disabled:opacity-50"
      aria-label="Supprimer l'article"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Trash2 className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
