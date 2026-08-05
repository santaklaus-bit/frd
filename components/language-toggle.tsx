"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LanguageToggle({ lang }: { lang: "en" | "fr" }) {
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "fr" : "en";
    const newPathname = pathname.replace(`/${lang}`, `/${newLang}`);
    router.push(newPathname);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="font-bold text-xs"
      aria-label="Changer de langue"
    >
      {lang === "en" ? "FR" : "EN"}
    </Button>
  );
}
