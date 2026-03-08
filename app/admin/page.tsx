import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getBlogPosts, getData } from "@/lib/content-manager";
import {
  FileText,
  Target,
  Video,
  Globe,
  ChevronRight,
  ArrowUpRight,
  Mail,
  Users,
} from "lucide-react";
import Link from "next/link";
import path from "path";
import fs from "fs/promises";

async function getJsonCount(filename: string): Promise<number> {
  try {
    const filePath = path.join(process.cwd(), "lib/data", `${filename}.json`);
    const content = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(content);
    return Array.isArray(data) ? data.length : 0;
  } catch {
    return 0;
  }
}

const quickActions = [
  {
    href: "/admin/blog",
    label: "Blog Posts",
    description: "Créer ou modifier un article",
    icon: FileText,
  },
  {
    href: "/admin/initiatives",
    label: "Initiatives",
    description: "Gérer vos projets et initiatives",
    icon: Target,
  },
  {
    href: "/admin/production",
    label: "Production",
    description: "Mettre à jour les sections production",
    icon: Video,
  },
  {
    href: "/admin/content",
    label: "Contenu i18n",
    description: "Éditer les textes FR / EN",
    icon: Globe,
  },
  {
    href: "/admin/contacts",
    label: "Messages",
    description: "Lire les messages de contact",
    icon: Mail,
  },
  {
    href: "/admin/newsletter",
    label: "Newsletter",
    description: "Voir les abonnés",
    icon: Users,
  },
];

export default async function AdminDashboard() {
  const posts = await getBlogPosts();
  const initiatives = await getData("initiatives");
  const production = await getData("production");
  const contactCount = await getJsonCount("contact-messages");
  const subscriberCount = await getJsonCount("newsletter-subscribers");

  const stats = [
    {
      label: "Articles",
      value: posts.length,
      icon: FileText,
      href: "/admin/blog",
    },
    {
      label: "Initiatives",
      value: initiatives.length,
      icon: Target,
      href: "/admin/initiatives",
    },
    {
      label: "Production",
      value: production.length,
      icon: Video,
      href: "/admin/production",
    },
    {
      label: "Langues",
      value: 2,
      icon: Globe,
      href: "/admin/content",
    },
    {
      label: "Messages",
      value: contactCount,
      icon: Mail,
      href: "/admin/contacts",
    },
    {
      label: "Abonnés",
      value: subscriberCount,
      icon: Users,
      href: "/admin/newsletter",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-1 border-b border-border/50 pb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Tableau de bord
        </h1>
        <p className="text-sm text-muted-foreground">
          Bienvenue dans votre espace d'administration.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="group block">
            <div className="border border-border/50 rounded-xl p-5 bg-card hover:bg-muted/30 hover:border-border transition-all duration-200 hover:shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center justify-center w-8 h-8 border border-border/60 rounded-lg text-muted-foreground group-hover:text-foreground transition-colors">
                  <stat.icon className="h-4 w-4" />
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
              </div>
              <div>
                <p className="text-2xl font-semibold tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                  {stat.label}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions — Timeline style */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold tracking-tight">
            Actions rapides
          </h2>
          <p className="text-sm text-muted-foreground">
            Accédez directement aux sections les plus courantes.
          </p>
        </div>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border/60" />

          <div className="space-y-0">
            {quickActions.map((action, index) => (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center gap-6 py-4 pl-12 pr-4 relative hover:bg-muted/30 rounded-xl transition-all duration-150"
              >
                {/* Timeline dot */}
                <div className="absolute left-[13px] w-[10px] h-[10px] rounded-full bg-background border-2 border-border group-hover:border-foreground transition-colors" />

                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center justify-center w-8 h-8 border border-border/60 rounded-lg bg-card text-muted-foreground group-hover:text-foreground group-hover:border-border transition-all">
                      <action.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium tracking-tight group-hover:text-foreground transition-colors">
                        {action.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
