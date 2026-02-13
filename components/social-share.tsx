"use client";

import { Share2, Linkedin, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Custom X Icon Component
const XIconLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

export function SocialShare({ lang }: { lang: string }) {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const title = "Farid Danko - Entrepreneur Social";

  const shareOnLinkedin = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl,
      )}`,
      "_blank",
    );
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl,
      )}&text=${encodeURIComponent(title)}`,
      "_blank",
    );
  };

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl,
      )}`,
      "_blank",
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-2xl bg-black text-white dark:bg-white dark:text-black hover:scale-110 transition-transform z-50 border-none"
        >
          <Share2 className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-2xl p-2 mb-4 w-48 border-border/40 backdrop-blur shadow-2xl"
      >
        <DropdownMenuItem
          onClick={shareOnLinkedin}
          className="rounded-xl p-3 cursor-pointer font-bold uppercase text-[10px] tracking-widest gap-3"
        >
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={shareOnTwitter}
          className="rounded-xl p-3 cursor-pointer font-bold uppercase text-[10px] tracking-widest gap-3"
        >
          <XIconLogo className="h-4 w-4" />X
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={shareOnFacebook}
          className="rounded-xl p-3 cursor-pointer font-bold uppercase text-[10px] tracking-widest gap-3"
        >
          <Facebook className="h-4 w-4" />
          Facebook
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
