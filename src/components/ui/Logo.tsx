import Link from "next/link";
import { cn } from "@/lib/utils";
import { OpusLogo } from "./OpusLogo";

/** Logo officiel OPUS CORP (navbar) — version vectorielle blanche sur fond marine, tracés issus de « Opus Logo To-dos.ai ». */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="OPUS CORP — accueil" className={cn("inline-flex items-center text-white", className)}>
      <OpusLogo className="h-8 w-auto md:h-9" />
    </Link>
  );
}
