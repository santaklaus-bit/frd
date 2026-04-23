"use client";

import { CheckCircle2, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { markMessageAsRead, deleteContactMessage } from "@/app/actions/contacts";

export function MessageActions({ id, isRead }: { id: number; isRead: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-border/50">
      {!isRead && (
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          disabled={isPending}
          onClick={() => {
            startTransition(() => {
              markMessageAsRead(id);
            });
          }}
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 mr-2" />}
          Marquer comme lu
        </Button>
      )}
      <Button
        variant="destructive"
        size="sm"
        className="text-xs"
        disabled={isPending}
        onClick={() => {
          if (confirm("Voulez-vous vraiment supprimer ce message ?")) {
            startTransition(() => {
              deleteContactMessage(id);
            });
          }
        }}
      >
        {isPending ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Trash2 className="w-3.5 h-3.5 mr-2" />}
        Supprimer
      </Button>
    </div>
  );
}
