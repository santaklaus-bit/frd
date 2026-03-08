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
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/blog", label: "Blog Posts", icon: FileText },
  { href: "/admin/contacts", label: "Messages", icon: Mail },
  { href: "/admin/newsletter", label: "Newsletter", icon: Users },
  { href: "/admin/content", label: "Contenu i18n", icon: Globe },
  { href: "/admin/initiatives", label: "Initiatives", icon: Target },
  { href: "/admin/production", label: "Production", icon: Video },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/admin/login") return <>{children}</>;

  const handleLogout = async () => {
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/admin/login";
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-60 border-r border-border/50 bg-card flex flex-col sticky top-0 h-screen shrink-0">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-border/50 flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-foreground text-background text-xs font-bold tracking-tight">
              FD
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight leading-none">
                Farid Danko
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5 tracking-widest uppercase">
                Admin
              </span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 px-3 space-y-0.5">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative",
                  isActive
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-foreground rounded-r-full" />
                )}
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span className="tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-6 pt-2 border-t border-border/50">
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all"
          >
            <LogOut className="h-4 w-4 shrink-0 transition-colors group-hover:text-red-500" />
            <span className="tracking-tight">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-10 space-y-8">{children}</div>
      </main>
    </div>
  );
}
