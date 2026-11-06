"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Globe,
  Target,
  Video,
  LogOut,
  BarChart3,
  Mail,
  Users,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import "@/app/globals.css";
import { Toaster } from "sonner";

export const dynamic = "force-dynamic";

const sidebarItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/blog", label: "Articles", icon: FileText },
  { href: "/admin/contacts", label: "Messages", icon: Mail },
  { href: "/admin/newsletter", label: "Newsletter", icon: Users },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/content", label: "Contenu i18n", icon: Globe },
  { href: "/admin/expertise", label: "Expertise", icon: Target },
  { href: "/admin/projects", label: "Projets", icon: Video },
];

const sidebarGroups = [
  {
    label: "Général",
    items: sidebarItems.slice(0, 2),
  },
  {
    label: "Contenu",
    items: sidebarItems.slice(2, 6),
  },
  {
    label: "Site",
    items: sidebarItems.slice(6),
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const handleLogout = async () => {
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/admin/login";
  };

  const isLoginPage = pathname === "/admin/login";

  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Toaster richColors position="bottom-right" />
        {isLoginPage ? (
          children
        ) : (
          <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="w-56 border-r border-border/50 bg-card flex flex-col sticky top-0 h-screen shrink-0">
              {/* Logo */}
              <div className="px-5 py-5 border-b border-border/40">
                <Link href="/admin" className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-foreground text-background text-xs font-black tracking-tighter">
                    FD
                  </span>
                  <div className="flex flex-col leading-none">
                    <span className="text-sm font-bold tracking-tight">Farid Danko</span>
                    <span className="text-[9px] text-muted-foreground mt-0.5 font-bold tracking-[0.2em] uppercase">
                      Admin
                    </span>
                  </div>
                </Link>
              </div>

              {/* Nav groups */}
              <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
                {sidebarGroups.map((group) => (
                  <div key={group.label}>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 px-3 mb-1.5">
                      {group.label}
                    </p>
                    <div className="space-y-0.5">
                      {group.items.map((item) => {
                        const isActive = item.exact
                          ? pathname === item.href
                          : pathname.startsWith(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "group relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150",
                              isActive
                                ? "bg-foreground text-background font-semibold"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/60 font-medium"
                            )}
                          >
                            <item.icon
                              className={cn(
                                "h-3.5 w-3.5 shrink-0",
                                isActive
                                  ? "text-background"
                                  : "text-muted-foreground/70 group-hover:text-foreground"
                              )}
                            />
                            <span className="text-[13px] tracking-tight">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              {/* Logout */}
              <div className="px-3 pb-5 pt-3 border-t border-border/40">
                <button
                  onClick={handleLogout}
                  className="group flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[13px] font-medium text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                >
                  <LogOut className="h-3.5 w-3.5 shrink-0 transition-colors group-hover:text-red-500" />
                  Déconnexion
                </button>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
              <div className="max-w-8xl mx-auto px-10 py-10 space-y-8">{children}</div>
            </main>
          </div>
        )}
      </body>
    </html>
  );
}
