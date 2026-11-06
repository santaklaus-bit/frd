"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  onConfirm: () => void;
  confirmTitle?: string;
  cancelTitle?: string;
  variant?: "destructive" | "default";
}

export function ConfirmDialog({
  isOpen,
  onOpenChange,
  title = "Êtes-vous sûr ?",
  description = "Cette action ne peut pas être annulée. Cela va définitivement supprimer cet élément et retirer les données de nos serveurs.",
  onConfirm,
  confirmTitle = "Continuer",
  cancelTitle = "Annuler",
  variant = "destructive",
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelTitle}
          </Button>
          <Button
            variant={variant}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmTitle}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
