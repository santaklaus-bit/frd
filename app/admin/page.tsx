import {
  getBlogPosts,
  getData,
  getContactMessagesCount,
  getSubscribersCount
} from "@/lib/content-manager";
import {
  FileText,
  Target,
  Video,
  Globe,
  Mail,
  Users,
  ArrowRight,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  let posts: any[] = [];
  let initiatives: any[] = [];
  let production: any[] = [];
  let contactCount = 0;
  let subscriberCount = 0;
  let dbError = false;

  try {
    [posts, initiatives, production, contactCount, subscriberCount] =
      await Promise.all([
        getBlogPosts(),
        getData("initiatives"),
        getData("production"),
        getContactMessagesCount(),
        getSubscribersCount(),
      ]);
  } catch {
    dbError = true;
  }

  const stats = [
    { label: "Articles", value: posts.length, icon: FileText, href: "/admin/blog", color: "from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300" },
    { label: "Initiatives", value: initiatives.length, icon: Target, href: "/admin/initiatives", color: "from-zinc-800 to-zinc-600 dark:from-zinc-200 dark:to-zinc-400" },
    { label: "Productions", value: production.length, icon: Video, href: "/admin/production", color: "from-zinc-800 to-zinc-600 dark:from-zinc-200 dark:to-zinc-400" },
    { label: "Messages", value: contactCount, icon: Mail, href: "/admin/contacts", color: "from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300" },
    { label: "Abonnés", value: subscriberCount, icon: Users, href: "/admin/newsletter", color: "from-zinc-800 to-zinc-600 dark:from-zinc-200 dark:to-zinc-400" },
    { label: "Langues", value: 2, icon: Globe, href: "/admin/content", color: "from-zinc-800 to-zinc-600 dark:from-zinc-200 dark:to-zinc-400" },
  ];

  const quickActions = [
    { href: "/admin/blog/new", label: "Nouvel article", description: "Rédiger et publier un article MDX", icon: FileText },
    { href: "/admin/content", label: "Éditer le contenu", description: "Modifier les textes FR / EN", icon: Globe },
    { href: "/admin/initiatives", label: "Initiatives", description: "Gérer vos projets et missions", icon: Target },
    { href: "/admin/production", label: "Production", description: "Interviews, podcasts, etc.", icon: Video },
    { href: "/admin/contacts", label: "Messages reçus", description: "Voir les demandes de contact", icon: Mail },
    { href: "/admin/newsletter", label: "Abonnés", description: "Liste des inscrits à la newsletter", icon: Users },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex items-end justify-between pb-6 border-b border-border/50">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Espace Administration
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Tableau de bord
          </h1>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 h-9 px-4 rounded-full bg-foreground text-background text-xs font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          Nouvel article
        </Link>
      </div>

      {/* Stats Grid */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4">
          Vue d&apos;ensemble
        </p>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card p-5 hover:border-border hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-border/50 bg-muted/40 text-muted-foreground group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all duration-200">
                  <stat.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-3xl font-bold tracking-tight tabular-nums">
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mt-0.5">
                    {stat.label}
                  </p>
                </div>
              </div>
              <ArrowRight className="absolute bottom-4 right-4 h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-muted-foreground/70 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4">
          Actions rapides
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group flex items-center gap-4 p-4 rounded-2xl border border-border/40 bg-card hover:border-border hover:shadow-md hover:bg-muted/20 transition-all duration-200"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-border/50 bg-muted/40 text-muted-foreground group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all duration-200 shrink-0">
                <action.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold tracking-tight group-hover:text-foreground transition-colors truncate">
                  {action.label}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {action.description}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-muted-foreground/70 group-hover:translate-x-0.5 shrink-0 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
