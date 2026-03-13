import { getDictionary } from "@/lib/get-dictionary";
import { TrendingUp, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang as "en" | "fr");
    return {
        title: `${dict.expertise.subpages.developpement.title} — ${dict.expertise.title}`,
    };
}

export default async function DeveloppementPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang as "en" | "fr");
    const sub = dict.expertise.subpages.developpement;

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24">
                <Link
                    href={`/${lang}/expertise`}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-12"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    {lang === "fr" ? "Retour à l'expertise" : "Back to expertise"}
                </Link>

                <div className="mb-8 p-4 rounded-2xl bg-muted/30 w-fit">
                    <TrendingUp className="h-8 w-8" />
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 uppercase tracking-tighter">
                    {sub.title}
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-6">
                    {sub.desc}
                </p>
                <p className="text-muted-foreground italic">{sub.details}</p>

                <div className="mt-16 p-8 md:p-12 rounded-3xl bg-black dark:bg-white text-white dark:text-black text-center">
                    <p className="text-lg md:text-xl font-bold uppercase tracking-tight">
                        {dict.expertise.outro}
                    </p>
                    <Link
                        href={`/${lang}/contact`}
                        className="inline-block mt-6 px-8 py-4 rounded-full bg-white text-black dark:bg-black dark:text-white font-bold uppercase tracking-widest text-sm hover:opacity-80 transition-opacity"
                    >
                        {lang === "fr" ? "Me contacter" : "Contact me"}
                    </Link>
                </div>
            </div>
        </div>
    );
}
