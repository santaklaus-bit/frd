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
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/blog", label: "Blog Posts", icon: FileText },
  { href: "/admin/content", label: "Contenu (i18n)", icon: Globe },
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
    // Basic logout logic: clear cookie and redirect
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/admin/login";
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/40 bg-background flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-border/40">
          <Link
            href="/admin"
            className="font-bold text-xl tracking-tighter uppercase"
          >
            Admin Panel
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all",
                pathname === item.href
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border/40">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">{children}</div>
      </main>
    </div>
  );
}
