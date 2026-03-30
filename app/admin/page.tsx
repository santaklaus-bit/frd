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
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

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
    {
      label: "Articles",
      value: posts.length,
      icon: FileText,
      href: "/admin/blog",
      color: "bg-blue-500/10 text-blue-600",
      gradient: "from-blue-500/10 to-transparent"
    },
    {
      label: "Expertise",
      value: initiatives.length,
      icon: Target,
      href: "/admin/expertise",
      color: "bg-emerald-500/10 text-emerald-600",
      gradient: "from-emerald-500/10 to-transparent"
    },
    {
      label: "Projets",
      value: production.length,
      icon: Video,
      href: "/admin/projects",
      color: "bg-purple-500/10 text-purple-600",
      gradient: "from-purple-500/10 to-transparent"
    },
    {
      label: "Messages",
      value: contactCount,
      icon: Mail,
      href: "/admin/contacts",
      color: "bg-orange-500/10 text-orange-600",
      gradient: "from-orange-500/10 to-transparent"
    },
    {
      label: "Abonnés",
      value: subscriberCount,
      icon: Users,
      href: "/admin/newsletter",
      color: "bg-pink-500/10 text-pink-600",
      gradient: "from-pink-500/10 to-transparent"
    },
    {
      label: "Langues",
      value: 2,
      icon: Globe,
      href: "/admin/content",
      color: "bg-indigo-500/10 text-indigo-600",
      gradient: "from-indigo-500/10 to-transparent"
    },
  ];

  const quickActions = [
    { href: "/admin/blog/new", label: "Nouvel article", description: "Rédiger et publier", icon: FileText, bg: "bg-blue-50" },
    { href: "/admin/content", label: "Textes i18n", description: "Traductions FR / EN", icon: Globe, bg: "bg-indigo-50" },
    { href: "/admin/expertise", label: "Expertise", description: "Domaines d'intervention", icon: Target, bg: "bg-emerald-50" },
    { href: "/admin/projects", label: "Projets", description: "Vidéo, Audio, Media", icon: Video, bg: "bg-purple-50" },
    { href: "/admin/contacts", label: "Messages", description: "Demandes clients", icon: Mail, bg: "bg-orange-50" },
    { href: "/admin/newsletter", label: "Audience", description: "Gestion des emails", icon: Users, bg: "bg-pink-50" },
  ];

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border/50">
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60">
            Console d&apos;Administration
          </p>
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Bonjour, Administrateur
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Voici un aperçu de l&apos;activité de votre plateforme aujourd&apos;hui.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2.5 h-11 px-6 rounded-full bg-foreground text-background text-xs font-bold uppercase tracking-[0.1em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-foreground/10"
        >
          <PlusCircle className="h-4 w-4" />
          Nouvel article
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
            Indicateurs Clés
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="group relative overflow-hidden rounded-[2rem] border border-border/40 bg-card p-6 hover:border-primary/20 hover:shadow-2xl transition-all duration-500"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative flex flex-col gap-6">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-2xl ${stat.color} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-4xl font-black tracking-tighter tabular-nums mb-0.5">
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.15em]">
                    {stat.label}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions & More */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
            Gestion du contenu
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center gap-5 p-5 rounded-[2rem] border border-border/40 bg-card hover:border-primary/20 hover:shadow-xl transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${action.bg} text-foreground/80 group-hover:bg-foreground group-hover:text-background transition-all duration-300 shrink-0`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold tracking-tight mb-0.5 truncate">
                    {action.label}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium truncate">
                    {action.description}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full border border-border/40 flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground group-hover:text-background transition-all duration-300">
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
            Aide & Paramètres
          </p>
          <div className="rounded-[2rem] border border-border/40 bg-card p-8 space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative space-y-2">
              <h3 className="text-lg font-bold tracking-tight">Besoin d&apos;assistance ?</h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                Consultez la documentation ou contactez le support technique pour toute question sur la gestion de votre site.
              </p>
            </div>
            <Button variant="outline" className="w-full rounded-2xl h-11 text-xs font-bold uppercase tracking-widest border-border/60">
              Voir la doc
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
