"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteBlogPost } from "@/app/actions/blog";

export function BlogDeleteButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Supprimer cet article ? Cette action est irréversible.")) return;
    setLoading(true);
    try {
      await deleteBlogPost(slug);
      router.refresh();
    } catch (err) {
      console.error("[BlogDeleteButton]", err);
      alert("Une erreur est survenue lors de la suppression.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleDelete}
      disabled={loading}
      className="rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 border-red-100 hover:border-red-200"
      aria-label="Supprimer l'article"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
