"use client";

import { MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GoBackButtonProps {
  label: string;
}

export function GoBackButton({ label }: GoBackButtonProps) {
  return (
    <Button
      variant="ghost"
      size="lg"
      className="h-16 px-10 rounded-full font-bold uppercase tracking-widest hover:bg-muted/50 transition-all font-mono"
      onClick={() => window.history.back()}
    >
      <MoveLeft className="mr-2 h-5 w-5" />
      {label}
    </Button>
  );
}
