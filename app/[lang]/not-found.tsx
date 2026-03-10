import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/get-dictionary";
import { Home } from "lucide-react";
import { GoBackButton } from "@/components/go-back-button";

export default async function NotFound({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "fr");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-2xl w-full text-center space-y-12">
        <div className="relative">
          <h1 className="text-[12rem] md:text-[16rem] font-bold leading-none tracking-tighter opacity-5 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter">
              {lang === "fr" ? "Page introuvable" : "Page not found"}
            </h2>
          </div>
        </div>

        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-lg mx-auto font-medium">
          {lang === "fr"
            ? "Désolé, la page que vous recherchez semble avoir disparu dans les méandres du web."
            : "Sorry, the page you're looking for seems to have vanished into the depths of the web."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
          <Link href={`/${lang}`}>
            <Button
              size="lg"
              className="h-16 px-10 rounded-full font-bold uppercase tracking-widest bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-all group shadow-xl"
            >
              <Home className="mr-2 h-5 w-5" />
              {lang === "fr" ? "Retour à l'accueil" : "Back to home"}
            </Button>
          </Link>
          <GoBackButton label={lang === "fr" ? "Page précédente" : "Go back"} />
        </div>
      </div>
    </div>
  );
}
