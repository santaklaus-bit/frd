"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  Clock,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Plus,
  Save,
  Settings,
  ShieldCheck,
  Trash2,
  Users,
  CalendarDays,
  Eye,
  History,
  X,
  GripVertical,
  Layers,
  CircleHelp,
  Sparkles,
  Search,
  Grid,
  List,
  AlertCircle,
  Quote,
  Heading2,
  ListPlus,
  Phone,
  Globe,
  RefreshCw,
  FolderOpen,
  Download,
  LogIn,
  Laptop,
  Smartphone,
  Activity,
  CheckCircle2,
  Copy,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { OpusLogo } from "@/components/ui/OpusLogo";
import {
  slugify,
  type CmsEntry,
  type CmsArticle,
  type CmsEvent,
  type CmsMember,
  type Collection,
  type PublicContent,
} from "@/lib/cms/schema";
import type { AdminUser } from "@/lib/cms/auth";
import { adminApi } from "./api";
import { ArticleBody } from "@/components/cms/ArticleBody";
import { MediaLibrary, MediaPicker } from "./MediaPicker";
import "./admin.css";

type Snapshot = { content: PublicContent; revisions: Record<string, number> };
type Account = AdminUser & { active: number };
type Message = {
  id: string;
  status: "new" | "read" | "done";
  created_at: string;
  data: { name: string; email: string; phone: string; project: string };
};

const labels = { articles: "Articles", events: "Événements", team: "Équipe" };
const routes = { articles: "blog", events: "evenements", team: "equipe" };
const statuses = {
  draft: "Brouillon",
  published: "Publié",
  archived: "Archivé",
};

const dateLabel = (value: string) =>
  new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const titleOf = (entry: CmsEntry) =>
  "title" in entry ? entry.title : entry.name;

type NavItem = {
  path: string;
  label: string;
  icon: typeof LayoutDashboard;
  admin?: boolean;
  badge?: "messages";
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: "VUE D'ENSEMBLE",
    items: [{ path: "", label: "Tableau de bord", icon: LayoutDashboard }],
  },
  {
    title: "CONTENUS DU SITE",
    items: [
      { path: "articles", label: "Articles", icon: FileText },
      { path: "events", label: "Événements", icon: CalendarDays },
      { path: "team", label: "Équipe", icon: Users },
      { path: "media", label: "Médiathèque", icon: ImageIcon },
    ],
  },
  {
    title: "CONFIGURATION DU SITE",
    items: [
      { path: "services", label: "Services", icon: Layers, admin: true },
      { path: "faq", label: "Questions fréquentes", icon: CircleHelp, admin: true },
      { path: "pages", label: "Visuels & Pages", icon: Sparkles, admin: true },
      { path: "site", label: "Paramètres généraux", icon: Settings, admin: true },
    ],
  },
  {
    title: "GESTION & SUIVI",
    items: [
      { path: "messages", label: "Messages reçus", icon: Mail, badge: "messages" },
      { path: "users", label: "Utilisateurs", icon: ShieldCheck, admin: true },
      { path: "audit", label: "Journal d'audit", icon: History },
    ],
  },
];

export function AdminPanel({
  user,
  view,
}: {
  user: AdminUser | null;
  view: string[];
}) {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [error, setError] = useState("");
  const [menu, setMenu] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const resource = view[0] || "";

  useEffect(() => {
    const handleOutsideClick = () => setUserMenuOpen(false);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const data = await adminApi<Snapshot>("content");
      setSnapshot(data);
      setError("");
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  const refreshMessagesCount = useCallback(async () => {
    try {
      const res = await adminApi<{ items: Message[] }>("messages");
      setUnreadMessages(res.items.filter((m) => m.status === "new").length);
    } catch {
      // Ignored if forbidden for editor
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    adminApi<Snapshot>("content")
      .then(setSnapshot)
      .catch((err) => setError((err as Error).message));
    adminApi<{ items: Message[] }>("messages")
      .then((res) => setUnreadMessages(res.items.filter((m) => m.status === "new").length))
      .catch(() => {});
  }, [user]);

  if (!user) return <Login />;

  const allItems = navGroups.flatMap((g) => g.items);
  const active = allItems.find((item) => item.path === resource);

  return (
    <div className="opus-admin admin-shell">
      {/* Sidebar de navigation haute couture */}
      <aside className={`admin-sidebar ${menu ? "is-open" : ""}`}>
        <Link href="/admin" className="admin-brand">
          <OpusLogo variant="mark" title="" className="w-9" />
          <div>
            OPUS CORP
            <span className="admin-brand-subtitle">STUDIO & ÉVÉNEMENTS</span>
          </div>
        </Link>

        <div className="admin-sidebar-nav-wrap">
          {navGroups.map((group) => {
            const visibleItems = group.items.filter(
              (item) => !item.admin || user.role === "admin",
            );
            if (!visibleItems.length) return null;
            return (
              <div key={group.title} className="admin-nav-group">
                <p className="admin-nav-label">{group.title}</p>
                <nav aria-label={group.title}>
                  {visibleItems.map((item) => {
                    const isCurrent = resource === item.path;
                    const showBadge =
                      item.badge === "messages" && unreadMessages > 0;
                    return (
                      <Link
                        key={item.path}
                        onClick={() => setMenu(false)}
                        href={`/admin${item.path ? `/${item.path}` : ""}`}
                        aria-current={isCurrent ? "page" : undefined}
                        className={`admin-nav-item ${isCurrent ? "is-active" : ""}`}
                      >
                        <item.icon size={17} className="admin-nav-icon" />
                        <span className="admin-nav-text">{item.label}</span>
                        {showBadge && (
                          <span className="admin-nav-badge">{unreadMessages}</span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            );
          })}
        </div>

        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-session-card">
            <span className="admin-user-online-dot" />
            <div className="admin-sidebar-session-text">
              <span className="admin-sidebar-session-title">Session active</span>
              <span className="admin-sidebar-session-subtitle">
                {user.role === "admin" ? "Super Admin" : "Éditeur"}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="admin-content-shell">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-btn admin-menu-toggle"
              aria-label="Ouvrir le menu"
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              <Menu size={18} />
            </button>
            <div className="admin-breadcrumbs">
              <Link href="/admin" className="admin-crumb">
                Administration
              </Link>
              <span className="admin-crumb-sep">/</span>
              <span className="admin-crumb-current">
                {active?.label || "Contenu"}
              </span>
            </div>
          </div>

          <div className="admin-topbar-right">
            <Link
              href="/"
              target="_blank"
              className="admin-btn admin-btn-small admin-topbar-ext-btn"
            >
              <ExternalLink size={14} />
              <span>Voir le site</span>
            </Link>

            {/* Capsule Profil Exécutif avec Menu Déroulant */}
            <div className="admin-user-menu-container">
              <button
                type="button"
                className={`admin-user-capsule ${userMenuOpen ? "is-open" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setUserMenuOpen((prev) => !prev);
                }}
                aria-label="Menu du profil"
                aria-expanded={userMenuOpen}
              >
                <div className="admin-user-capsule-avatar">
                  {user.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="admin-user-capsule-info">
                  <span className="admin-user-capsule-name">{user.name}</span>
                  <span className="admin-user-capsule-role">
                    {user.role === "admin" ? "Administrateur" : "Éditeur"}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={`admin-user-capsule-arrow ${userMenuOpen ? "is-rotated" : ""}`}
                />
              </button>

              {userMenuOpen && (
                <div
                  className="admin-user-dropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="admin-user-dropdown-header">
                    <div className="admin-user-dropdown-avatar">
                      {user.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="admin-user-dropdown-meta">
                      <p className="admin-user-dropdown-name">{user.name}</p>
                      <p className="admin-user-dropdown-email">{user.email}</p>
                      <span className="admin-user-dropdown-badge">
                        {user.role === "admin"
                          ? "Accès Administrateur"
                          : "Accès Éditeur"}
                      </span>
                    </div>
                  </div>

                  <div className="admin-user-dropdown-nav">
                    {user.role === "admin" && (
                      <Link
                        href="/admin/users"
                        className="admin-user-dropdown-link"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <ShieldCheck size={15} />
                        <span>Comptes utilisateurs</span>
                      </Link>
                    )}
                    <Link
                      href="/admin/audit"
                      className="admin-user-dropdown-link"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <History size={15} />
                      <span>Journal d’audit & sécurité</span>
                    </Link>
                    <Link
                      href="/"
                      target="_blank"
                      className="admin-user-dropdown-link"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <ExternalLink size={15} />
                      <span>Consulter le site public</span>
                    </Link>
                  </div>

                  <div className="admin-user-dropdown-footer">
                    <button
                      type="button"
                      className="admin-user-dropdown-logout"
                      onClick={async () => {
                        await adminApi("logout", "POST");
                        window.location.assign("/admin/login");
                      }}
                    >
                      <LogOut size={15} />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="admin-main">
          {error && (
            <div role="alert" className="admin-notice admin-error">
              <AlertCircle size={16} />
              <span>{error}</span>
              <button
                type="button"
                className="admin-notice-retry"
                onClick={() => void refresh()}
              >
                <RefreshCw size={12} /> Réessayer
              </button>
            </div>
          )}

          {!snapshot ? (
            <div className="admin-loading-screen">
              <p role="status">Chargement de votre espace…</p>
            </div>
          ) : resource === "" ? (
            <Dashboard
              snapshot={snapshot}
              user={user}
              unreadMessages={unreadMessages}
            />
          ) : resource in labels ? (
            <CollectionView
              key={`${resource}/${view[1] || ""}`}
              collection={resource as Collection}
              id={view[1]}
              snapshot={snapshot}
              user={user}
              refresh={refresh}
            />
          ) : resource === "media" ? (
            <>
              <Heading
                title="Médiathèque"
                description="Toutes les photos et vidéos de votre site, optimisées en WebP avec suppression sécurisée."
              />
              <MediaLibrary canDelete={true} />
            </>
          ) : resource === "messages" ? (
            <Messages user={user} onUpdate={refreshMessagesCount} />
          ) : resource === "users" ? (
            user.role === "admin" ? (
              <Accounts />
            ) : (
              <Forbidden />
            )
          ) : resource === "audit" ? (
            <Audit />
          ) : ["site", "pages", "faq", "services"].includes(resource) ? (
            user.role === "admin" ? (
              <Configuration
                key={resource}
                resource={resource as "site" | "pages" | "faq" | "services"}
                snapshot={snapshot}
                refresh={refresh}
              />
            ) : (
              <Forbidden />
            )
          ) : (
            <div className="admin-card admin-empty-box">
              <p style={{ fontWeight: 600, fontSize: 16 }}>Cette page n’existe pas.</p>
              <Link href="/admin" className="admin-btn admin-btn-primary" style={{ marginTop: 14 }}>
                Revenir au tableau de bord
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function Forbidden() {
  return (
    <div className="admin-card admin-empty-box">
      <ShieldCheck size={36} style={{ color: "#ed6a3d", margin: "0 auto 12px" }} />
      <p style={{ fontWeight: 600, fontSize: 16 }}>Accès restreint</p>
      <p className="admin-muted" style={{ fontSize: 13, marginTop: 4 }}>
        Cette rubrique est réservée aux administrateurs.
      </p>
      <Link href="/admin" className="admin-btn" style={{ marginTop: 14 }}>
        Retour au tableau de bord
      </Link>
    </div>
  );
}

function Heading({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="admin-heading">
      <div>
        <p className="admin-kicker">OPUS CORP / ADMINISTRATION</p>
        <h1>{title}</h1>
        {description && <p className="admin-subtitle">{description}</p>}
      </div>
      {children && <div className="admin-actions">{children}</div>}
    </div>
  );
}

function Badge({ status }: { status: keyof typeof statuses }) {
  return (
    <span className={`admin-badge admin-badge-${status}`}>
      <span className="admin-badge-dot" />
      {statuses[status]}
    </span>
  );
}

/* ==========================================================================
   Page de Connexion Exécutive
   ========================================================================== */
function Login() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div className="opus-admin admin-login">
      <div className="admin-login-brand">
        <div className="admin-brand" style={{ margin: 0 }}>
          <OpusLogo variant="mark" title="" className="w-12" />
          <div>
            OPUS CORP
            <span className="admin-brand-subtitle">DESIGN · BRANDING · EVENT</span>
          </div>
        </div>
        <div>
          <p className="admin-kicker" style={{ color: "#f8b133" }}>
            ESPACE ÉDITORIAL & GESTION
          </p>
          <h1 className="admin-login-heading">
            Faites vivre
            <br />
            vos réalisations.
          </h1>
          <p style={{ color: "#bbc1d0", marginTop: 20, maxWidth: 380, fontSize: 14, lineHeight: 1.6 }}>
            Publiez vos nouveaux projets, présentez les membres de votre équipe et gardez le contrôle total sur votre site.
          </p>
        </div>
        <div className="admin-login-brand-footer">
          <p style={{ color: "#9ca3af", fontSize: 12 }}>
            OPUS CORP · Chaque projet, une œuvre.
          </p>
        </div>
      </div>

      <div className="admin-login-form-pane">
        <form
          className="admin-login-form"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");
            const form = new FormData(e.currentTarget);
            try {
              await adminApi("login", "POST", {
                email: form.get("email"),
                password: form.get("password"),
              });
              window.location.assign("/admin");
            } catch (err) {
              setError((err as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <div>
            <p className="admin-kicker">BIENVENUE</p>
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: "4px 0 8px" }}>
              Connexion à l’administration
            </h2>
            <p className="admin-muted" style={{ fontSize: 13 }}>
              Saisissez vos identifiants sécurisés OPUS CORP.
            </p>
          </div>

          {error && (
            <div role="alert" className="admin-notice admin-error">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <label className="admin-field">
            <span>Adresse e-mail professionnelle</span>
            <input
              type="email"
              name="email"
              autoComplete="username"
              required
              placeholder="vous@opuscrp.com"
              maxLength={200}
            />
          </label>

          <label className="admin-field">
            <span>Mot de passe</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              placeholder="••••••••••••"
              maxLength={200}
            />
          </label>

          <button
            disabled={busy}
            className="admin-btn admin-btn-primary admin-btn-login"
            type="submit"
          >
            {busy ? "Authentification…" : "Se connecter"}
          </button>

          <Link
            className="admin-muted"
            href="/"
            style={{ textAlign: "center", fontSize: 13, textDecoration: "none", marginTop: 8 }}
          >
            ← Revenir au site public
          </Link>
        </form>
      </div>
    </div>
  );
}

/* ==========================================================================
   Tableau de Bord / Vue d'ensemble
   ========================================================================== */
function Dashboard({
  snapshot: { content },
  user,
  unreadMessages,
}: {
  snapshot: Snapshot;
  user: AdminUser;
  unreadMessages: number;
}) {
  const recent = [
    ...content.articles.map((entry) => ({ entry, collection: "articles" as const })),
    ...content.events.map((entry) => ({ entry, collection: "events" as const })),
    ...content.team.map((entry) => ({ entry, collection: "team" as const })),
  ]
    .sort((a, b) => b.entry.updatedAt.localeCompare(a.entry.updatedAt))
    .slice(0, 6);

  const drafts = [
    ...content.articles,
    ...content.events,
    ...content.team,
  ].filter((item) => item.status === "draft").length;

  const stats = [
    {
      name: "Articles publiés",
      value: content.articles.filter((e) => e.status === "published").length,
      detail: `${content.articles.length} au total`,
      icon: FileText,
      path: "articles",
      color: "var(--color-branding)",
    },
    {
      name: "Événements publiés",
      value: content.events.filter((e) => e.status === "published").length,
      detail: `${content.events.filter((e) => e.featured).length} à la une`,
      icon: CalendarDays,
      path: "events",
      color: "var(--color-event)",
    },
    {
      name: "Membres de l'équipe",
      value: content.team.filter((e) => e.status === "published").length,
      detail: "Design · Branding · Event",
      icon: Users,
      path: "team",
      color: "var(--color-design)",
    },
    {
      name: "Brouillons en cours",
      value: drafts,
      detail: unreadMessages > 0 ? `${unreadMessages} message(s) non lu(s)` : "Tous à jour",
      icon: Clock,
      path: "articles?status=draft",
      color: "#6366f1",
    },
  ];

  return (
    <>
      {/* Bannière de bienvenue haute définition */}
      <div className="admin-welcome-hero">
        <div className="admin-welcome-text">
          <p className="admin-kicker" style={{ color: "#f8b133" }}>TABLEAU DE BORD</p>
          <h1>Bonjour, {user.name.split(" ")[0]}</h1>
          <p className="admin-welcome-sub">
            Bienvenue dans votre centre de contrôle OPUS CORP. Vous pouvez créer de nouveaux contenus, enrichir vos galeries et gérer vos demandes clients.
          </p>
        </div>

        <div className="admin-welcome-actions">
          <Link href="/admin/articles/new" className="admin-btn admin-btn-primary admin-btn-welcome">
            <Plus size={16} /> Nouvel article
          </Link>
          <Link href="/admin/events/new" className="admin-btn admin-btn-welcome">
            <Plus size={16} /> Nouvel événement
          </Link>
        </div>
      </div>

      {/* Cartes KPI modernes */}
      <div className="admin-stats-pro">
        {stats.map((stat) => (
          <Link
            href={`/admin/${stat.path}`}
            key={stat.name}
            className="admin-stat-card-pro"
          >
            <div className="admin-stat-top">
              <span className="admin-stat-icon-wrap" style={{ color: stat.color }}>
                <stat.icon size={20} />
              </span>
              <span className="admin-stat-subdetail">{stat.detail}</span>
            </div>
            <p className="admin-stat-value-pro">{stat.value}</p>
            <p className="admin-stat-name-pro">{stat.name}</p>
          </Link>
        ))}
      </div>

      {/* Raccourcis d'actions rapides */}
      <div className="admin-quick-actions-bar">
        {[
          { label: "Rédiger un article", path: "articles/new", icon: FileText, desc: "Nouvelle actualité blog" },
          { label: "Ajouter un événement", path: "events/new", icon: CalendarDays, desc: "Projet ou activation" },
          { label: "Gérer la médiathèque", path: "media", icon: ImageIcon, desc: "Photos et vidéos" },
          { label: "Consulter les messages", path: "messages", icon: Mail, desc: `${unreadMessages} en attente` },
        ].map((item) => (
          <Link key={item.path} href={`/admin/${item.path}`} className="admin-quick-action-card">
            <div className="admin-quick-action-icon">
              <item.icon size={18} />
            </div>
            <div>
              <p className="admin-quick-action-title">{item.label}</p>
              <p className="admin-muted" style={{ fontSize: 12 }}>{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Deux colonnes : Dernières modifications + Info site */}
      <div className="admin-columns" style={{ marginTop: 24 }}>
        <section className="admin-card">
          <div className="admin-heading" style={{ marginBottom: 16 }}>
            <h2>Dernières modifications</h2>
            <span className="admin-muted" style={{ fontSize: 12 }}>Articles, Événements & Équipe</span>
          </div>

          {recent.length ? (
            <div className="admin-recent-list">
              {recent.map(({ entry, collection }) => (
                <div className="admin-recent-row" key={entry.id}>
                  {entry.image ? (
                    <img src={entry.image} alt="" className="admin-recent-thumb" />
                  ) : (
                    <div className="admin-recent-thumb admin-recent-thumb-empty">
                      <FolderOpen size={20} />
                    </div>
                  )}
                  <div className="admin-recent-main">
                    <Link
                      className="admin-recent-title"
                      href={`/admin/${collection}/${entry.id}`}
                    >
                      {titleOf(entry)}
                    </Link>
                    <p className="admin-muted" style={{ fontSize: 12, marginTop: 3 }}>
                      <span className="admin-recent-collection-tag">
                        {labels[collection]}
                      </span>
                      {" · "}
                      {dateLabel(entry.updatedAt)}
                    </p>
                  </div>
                  <Badge status={entry.status} />
                  <Link
                    href={`/admin/${collection}/${entry.id}`}
                    className="admin-btn admin-btn-small"
                  >
                    Modifier
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="admin-empty">Vos premières publications apparaîtront ici.</p>
          )}
        </section>

        <div className="admin-stack">
          {/* Carte d'inspiration signature OPUS */}
          <section className="admin-card admin-signature-card">
            <OpusLogo variant="mark" title="" className="w-10 text-white" />
            <h3 style={{ marginTop: 18, fontSize: 20, fontWeight: 700, color: "white" }}>
              Chaque projet, une œuvre.
            </h3>
            <p style={{ color: "#cbd5e1", fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>
              Les mises à jour que vous effectuez ici sont immédiatement prises en compte sur le site public sans reconstruction.
            </p>
            <div className="admin-actions" style={{ marginTop: 20 }}>
              <Link href="/" target="_blank" className="admin-btn admin-btn-small" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)" }}>
                <Globe size={13} /> Voir le site en direct
              </Link>
            </div>
          </section>

          {/* Raccourci vers les messages récents */}
          <section className="admin-card">
            <div className="admin-heading" style={{ marginBottom: 12 }}>
              <h2 style={{ margin: 0 }}>Formulaire de contact</h2>
              <Link href="/admin/messages" className="admin-btn admin-btn-small">
                Voir tout
              </Link>
            </div>
            <p className="admin-muted" style={{ fontSize: 13, lineHeight: 1.5 }}>
              Les demandes de devis et réservations soumises par les visiteurs sont enregistrées et conservées dans l’onglet <strong>Messages</strong>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}

function newEntry(collection: Collection): CmsEntry {
  const base = {
    id: crypto.randomUUID(),
    slug: "",
    status: "draft" as const,
    revision: 0,
    updatedAt: new Date().toISOString(),
    seoTitle: "",
    seoDescription: "",
    image: "",
    excerpt: "",
  };
  if (collection === "team")
    return {
      ...base,
      name: "",
      role: "",
      department: "",
      pole: "event",
      quote: "",
      bio: [],
      missions: [],
      expertise: [],
      projectSlugs: [],
    };
  const shared = {
    ...base,
    title: "",
    category: "",
    date: new Date().toISOString().slice(0, 10),
    dateLabel: "",
    alt: "",
  };
  return collection === "articles"
    ? { ...shared, intro: "", body: [], author: "OPUS CORP", blocks: [] }
    : {
        ...shared,
        city: "Cotonou",
        country: "Bénin",
        venue: "",
        gallery: [],
        about: [],
        role: "",
        audience: "",
        hours: "",
        lineupLabel: "Intervention OPUS",
        lineup: [],
        featured: false,
      };
}

/* ==========================================================================
   Vue de Liste d'une Collection (Articles, Événements, Équipe)
   ========================================================================== */
function CollectionView({
  collection,
  id,
  snapshot,
  user,
  refresh,
}: {
  collection: Collection;
  id?: string;
  snapshot: Snapshot;
  user: AdminUser;
  refresh: () => Promise<void>;
}) {
  const entries = snapshot.content[collection] as CmsEntry[];
  const parameters = useSearchParams();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(parameters.get("status") || "all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  if (id) {
    const entry =
      id === "new" ? newEntry(collection) : entries.find((e) => e.id === id);
    return entry ? (
      <EntryEditor
        collection={collection}
        initial={entry}
        user={user}
        refresh={refresh}
        snapshot={snapshot}
      />
    ) : (
      <div className="admin-card admin-empty-box">
        <p style={{ fontWeight: 600, fontSize: 16 }}>Fiche introuvable.</p>
        <Link href={`/admin/${collection}`} className="admin-btn admin-btn-primary" style={{ marginTop: 12 }}>
          Retour à la liste des {labels[collection].toLowerCase()}
        </Link>
      </div>
    );
  }

  const list = entries.filter(
    (e) =>
      (status === "all" || e.status === status) &&
      `${titleOf(e)} ${e.slug}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <Heading
        title={labels[collection]}
        description={`${entries.length} fiche${entries.length > 1 ? "s" : ""} au total · Gérez les publications visibles sur votre site.`}
      >
        <Link
          href={`/admin/${collection}/new`}
          className="admin-btn admin-btn-primary"
        >
          <Plus size={16} />
          {collection === "articles"
            ? "Nouvel article"
            : collection === "events"
              ? "Nouvel événement"
              : "Ajouter un membre"}
        </Link>
      </Heading>

      {/* Barre d'outils avec onglets et bascule de vue */}
      <div className="admin-collection-toolbar">
        <div className="admin-status-tabs">
          {[
            { id: "all", label: "Tous", count: entries.length },
            { id: "published", label: "Publiés", count: entries.filter((e) => e.status === "published").length },
            { id: "draft", label: "Brouillons", count: entries.filter((e) => e.status === "draft").length },
            { id: "archived", label: "Archivés", count: entries.filter((e) => e.status === "archived").length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`admin-status-tab ${status === tab.id ? "is-active" : ""}`}
              onClick={() => setStatus(tab.id)}
            >
              {tab.label}
              <span className="admin-status-tab-count">{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="admin-actions">
          <div className="admin-search-wrap">
            <Search size={14} className="admin-search-icon" />
            <input
              aria-label="Rechercher"
              placeholder="Rechercher par titre ou URL…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-search-input"
            />
            {search && (
              <button
                type="button"
                className="admin-search-clear"
                onClick={() => setSearch("")}
                aria-label="Effacer la recherche"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="admin-view-toggle">
            <button
              type="button"
              className={`admin-view-btn ${viewMode === "table" ? "is-active" : ""}`}
              onClick={() => setViewMode("table")}
              title="Vue tableau"
              aria-label="Vue tableau"
            >
              <List size={15} />
            </button>
            <button
              type="button"
              className={`admin-view-btn ${viewMode === "grid" ? "is-active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Vue cartes"
              aria-label="Vue cartes"
            >
              <Grid size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Vue cartes ou vue tableau */}
      {viewMode === "grid" ? (
        <div className="admin-collection-grid">
          {list.map((entry) => (
            <div key={entry.id} className="admin-collection-card">
              {entry.image ? (
                <img src={entry.image} alt="" className="admin-collection-card-img" />
              ) : (
                <div className="admin-collection-card-img-empty">
                  <ImageIcon size={30} />
                </div>
              )}
              <div className="admin-collection-card-body">
                <div className="admin-actions" style={{ justifyContent: "space-between", marginBottom: 6 }}>
                  <span className="admin-collection-card-category">
                    {"category" in entry ? entry.category : entry.role}
                  </span>
                  <Badge status={entry.status} />
                </div>
                <Link
                  href={`/admin/${collection}/${entry.id}`}
                  className="admin-collection-card-title"
                >
                  {titleOf(entry)}
                </Link>
                <p className="admin-muted" style={{ fontSize: 12, marginTop: 4 }}>
                  {dateLabel(entry.updatedAt)}
                </p>
                <div className="admin-actions" style={{ marginTop: 14 }}>
                  <Link
                    href={`/admin/${collection}/${entry.id}`}
                    className="admin-btn admin-btn-small admin-btn-primary"
                    style={{ flex: 1 }}
                  >
                    Modifier la fiche
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{collection === "team" ? "Membre" : "Titre"}</th>
                  <th>Statut</th>
                  <th>Modifié le</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((entry) => (
                  <tr key={entry.id}>
                    <td>
                      <div className="admin-actions" style={{ flexWrap: "nowrap" }}>
                        {entry.image ? (
                          <img
                            src={entry.image}
                            alt=""
                            className="admin-table-thumb"
                          />
                        ) : (
                          <div className="admin-table-thumb admin-table-thumb-empty">
                            <FolderOpen size={16} />
                          </div>
                        )}
                        <div>
                          <Link
                            href={`/admin/${collection}/${entry.id}`}
                            className="admin-row-title"
                          >
                            {titleOf(entry)}
                          </Link>
                          <p className="admin-muted" style={{ fontSize: 11, marginTop: 3 }}>
                            {"category" in entry ? entry.category : entry.role}
                            {" · "}
                            <code>/{routes[collection]}/{entry.slug}</code>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge status={entry.status} />
                    </td>
                    <td className="admin-muted" style={{ whiteSpace: "nowrap", fontSize: 12 }}>
                      {dateLabel(entry.updatedAt)}
                    </td>
                    <td>
                      <div className="admin-actions" style={{ justifyContent: "flex-end" }}>
                        <Link
                          href={`/admin/${collection}/${entry.id}`}
                          className="admin-btn admin-btn-small"
                        >
                          Modifier
                        </Link>
                        {["events", "team"].includes(collection) &&
                          status === "all" &&
                          !search &&
                          [-1, 1].map((direction) => (
                            <button
                              key={direction}
                              type="button"
                              className="admin-btn admin-btn-small"
                              aria-label={
                                direction < 0
                                  ? "Monter la fiche"
                                  : "Descendre la fiche"
                              }
                              disabled={
                                entries.indexOf(entry) + direction < 0 ||
                                entries.indexOf(entry) + direction >= entries.length
                              }
                              onClick={async () => {
                                const ids = entries.map((e) => e.id);
                                const index = entries.indexOf(entry);
                                [ids[index], ids[index + direction]] = [
                                  ids[index + direction],
                                  ids[index],
                                ];
                                try {
                                  await adminApi(`${collection}/order`, "PATCH", {
                                    ids,
                                    revision: snapshot.revisions[collection],
                                  });
                                  await refresh();
                                } catch (err) {
                                  window.alert((err as Error).message);
                                }
                              }}
                            >
                              {direction < 0 ? (
                                <ArrowUp size={12} />
                              ) : (
                                <ArrowDown size={12} />
                              )}
                            </button>
                          ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!list.length && (
        <div className="admin-card admin-empty-box" style={{ marginTop: 16 }}>
          <FolderOpen size={36} style={{ color: "#a0a8be", margin: "0 auto 12px" }} />
          <p style={{ fontWeight: 600, fontSize: 16 }}>Aucune fiche trouvée</p>
          <p className="admin-muted" style={{ fontSize: 13, marginTop: 4 }}>
            {search ? "Aucun résultat ne correspond à votre recherche." : `Créez votre première fiche ${labels[collection].toLowerCase()}.`}
          </p>
          <Link
            href={`/admin/${collection}/new`}
            className="admin-btn admin-btn-primary"
            style={{ marginTop: 14 }}
          >
            <Plus size={14} /> Créer maintenant
          </Link>
        </div>
      )}
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
  hint,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label className="admin-field">
      <span>
        {label}
        {required ? " *" : ""}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          required={required}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      )}
      {hint && <small>{hint}</small>}
    </label>
  );
}

function Lines({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  hint?: string;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <textarea
        value={value.join("\n\n")}
        onChange={(e) => onChange(e.target.value.split("\n\n"))}
        rows={Math.min(12, Math.max(3, value.length * 2))}
      />
      <small>{hint || "Séparez chaque paragraphe ou élément par une ligne vide."}</small>
    </label>
  );
}

function cleanLines(entry: CmsEntry): CmsEntry {
  const result = { ...entry };
  for (const key of [
    "body",
    "about",
    "bio",
    "missions",
    "expertise",
    "lineup",
    "projectSlugs",
  ]) {
    const record = result as unknown as Record<string, unknown>;
    if (Array.isArray(record[key]))
      record[key] = (record[key] as string[])
        .map((v) => v.trim())
        .filter(Boolean);
  }
  return result;
}

/* ==========================================================================
   Éditeur de Fiche (Article, Événement, Membre)
   ========================================================================== */
function EntryEditor({
  collection,
  initial,
  user,
  refresh,
  snapshot,
}: {
  collection: Collection;
  initial: CmsEntry;
  user: AdminUser;
  refresh: () => Promise<void>;
  snapshot: Snapshot;
}) {
  const router = useRouter();
  const [entry, setEntry] = useState(initial);
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(false);
  const [history, setHistory] = useState<
    { id: number; date: string; actor: string; data: CmsEntry }[] | null
  >(null);

  const dirty = JSON.stringify(entry) !== saved;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = (key: string, value: unknown) => {
    setEntry((old) => ({ ...old, [key]: value }));
    setNotice("");
  };

  const article = collection === "articles" ? (entry as CmsArticle) : null;
  const event = collection === "events" ? (entry as CmsEvent) : null;
  const member = collection === "team" ? (entry as CmsMember) : null;

  async function save() {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const prepared = cleanLines(entry);
      if ("date" in prepared && !prepared.dateLabel)
        prepared.dateLabel = dateLabel(prepared.date);
      const { entry: updated } = await adminApi<{ entry: CmsEntry }>(
        collection,
        "POST",
        prepared,
      );
      setEntry(updated);
      setSaved(JSON.stringify(updated));
      setNotice(
        updated.status === "published"
          ? "✓ Les modifications sont en ligne sur le site public."
          : "✓ Fiche enregistrée avec succès.",
      );
      await refresh();
      if (initial.revision === 0)
        router.replace(`/admin/${collection}/${updated.id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (
      !window.confirm(
        `Supprimer définitivement « ${titleOf(entry)} » ? Vous pouvez aussi choisir le statut « Archivé » pour conserver son historique sans affichage public.`,
      )
    )
      return;
    setBusy(true);
    try {
      await adminApi(`${collection}/${entry.id}`, "DELETE", {
        revision: entry.revision,
      });
      setSaved(JSON.stringify(entry));
      await refresh();
      router.push(`/admin/${collection}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="admin-editor-top-nav">
        <Link
          href={`/admin/${collection}`}
          className="admin-editor-back-link"
          onClick={(e) => {
            if (
              dirty &&
              !window.confirm(
                "Quitter cette fiche sans enregistrer vos modifications récentes ?",
              )
            )
              e.preventDefault();
          }}
        >
          <ArrowLeft size={15} />
          Retour aux {labels[collection].toLowerCase()}
        </Link>
        {dirty && (
          <span className="admin-dirty-badge">
            <span className="admin-dirty-dot" />
            Modifications non enregistrées
          </span>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
      >
        <div className="admin-editor-sticky-header">
          <div>
            <h1 className="admin-editor-page-title">
              {initial.revision === 0
                ? collection === "articles"
                  ? "Création d'un article"
                  : collection === "events"
                    ? "Nouvel événement"
                    : "Nouveau membre de l'équipe"
                : titleOf(entry)}
            </h1>
            <p className="admin-muted" style={{ fontSize: 12 }}>
              {dirty ? "Pensez à enregistrer vos modifications." : "Fiche synchronisée avec la base."}
            </p>
          </div>

          <div className="admin-actions">
            <button
              type="button"
              className="admin-btn"
              onClick={() => setPreview(true)}
            >
              <Eye size={15} />
              Aperçu en direct
            </button>
            <button
              className="admin-btn admin-btn-primary admin-btn-save"
              type="submit"
              disabled={busy}
            >
              <Save size={15} />
              {busy ? "Enregistrement…" : entry.status === "published" ? "Enregistrer & publier" : "Enregistrer"}
            </button>
          </div>
        </div>

        {error && (
          <div role="alert" className="admin-notice admin-error">
            <AlertCircle size={16} />
            <span style={{ whiteSpace: "pre-line" }}>{error}</span>
          </div>
        )}
        {notice && (
          <div role="status" className="admin-notice admin-success">
            <Check size={16} />
            <span>{notice}</span>
          </div>
        )}

        <div className="admin-columns">
          {/* Colonne gauche (Principale) */}
          <div className="admin-stack">
            <section className="admin-card admin-stack">
              <h2>
                {member ? "Profil du membre" : "Informations principales"}
              </h2>

              <Field
                label={member ? "Nom complet" : "Titre principal"}
                value={titleOf(entry)}
                required
                onChange={(value) => {
                  const key = member ? "name" : "title";
                  setEntry((old) => ({
                    ...old,
                    [key]: value,
                    ...(initial.revision === 0 &&
                    (!old.slug || old.slug === slugify(titleOf(old)))
                      ? { slug: slugify(value) }
                      : {}),
                  }));
                }}
              />

              <div className="admin-slug-row">
                <Field
                  label="Adresse URL canonique (slug)"
                  value={entry.slug}
                  onChange={(v) => set("slug", v)}
                  required
                  hint={`/${routes[collection]}/${entry.slug || "slug-de-la-page"} · Minuscules, chiffres et tirets.`}
                />
              </div>

              {"category" in entry && (
                <div className="admin-form-grid">
                  <Field
                    label="Catégorie"
                    required
                    value={entry.category}
                    onChange={(v) => set("category", v)}
                    hint="Ex: Brand Experience, Culture, Activation..."
                  />
                  <Field
                    label="Date de référence"
                    type="date"
                    required
                    value={entry.date}
                    onChange={(v) => {
                      setEntry((old) => ({
                        ...old,
                        date: v,
                        dateLabel: v ? dateLabel(v) : "",
                      }));
                    }}
                  />
                  <Field
                    label="Libellé de date affiché"
                    value={entry.dateLabel}
                    onChange={(v) => set("dateLabel", v)}
                    hint="Ex: Septembre 2026"
                  />
                  {article && (
                    <Field
                      label="Auteur de la publication"
                      value={article.author}
                      onChange={(v) => set("author", v)}
                    />
                  )}
                </div>
              )}

              <Field
                label="Présentation courte / Résumé"
                multiline
                value={entry.excerpt}
                onChange={(v) => set("excerpt", v)}
                hint="Texte d'accroche affiché dans les grilles et cartes d'aperçu de partage."
              />

              {member && (
                <>
                  <div className="admin-form-grid">
                    <Field
                      label="Fonction / Titre"
                      value={member.role}
                      onChange={(v) => set("role", v)}
                      hint="Ex: Directeur Général, Directrice Artistique..."
                    />
                    <Field
                      label="Département"
                      value={member.department}
                      onChange={(v) => set("department", v)}
                      hint="Ex: Direction & Stratégie, Création..."
                    />
                  </div>

                  <div className="admin-field">
                    <span>Pôle d’intervention OPUS</span>
                    <div className="admin-pole-selector">
                      {[
                        { id: "design", label: "Pôle Design", color: "var(--color-design)" },
                        { id: "branding", label: "Pôle Branding", color: "var(--color-branding)" },
                        { id: "event", label: "Pôle Event", color: "var(--color-event)" },
                      ].map((pole) => (
                        <button
                          key={pole.id}
                          type="button"
                          className={`admin-pole-btn ${member.pole === pole.id ? "is-selected" : ""}`}
                          onClick={() => set("pole", pole.id)}
                        >
                          <span
                            className="admin-pole-dot"
                            style={{ background: pole.color }}
                          />
                          {pole.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </section>

            {/* Section spécifique : Article (Blocks) */}
            {article && (
              <section className="admin-card admin-stack">
                <div className="admin-heading" style={{ marginBottom: 4 }}>
                  <div>
                    <h2>Contenu riche de l’article</h2>
                    <p className="admin-muted" style={{ fontSize: 13 }}>
                      Composez votre article avec des blocs modulaires (paragraphes, intertitres, citations, listes, images).
                    </p>
                  </div>
                </div>

                <Field
                  label="Introduction (chapeau de l’article)"
                  multiline
                  value={article.intro}
                  onChange={(v) => set("intro", v)}
                />

                <ArticleBlocks
                  article={article}
                  onChange={(value) => {
                    set("blocks", value);
                    set("body", []);
                  }}
                />
              </section>
            )}

            {/* Section spécifique : Événement */}
            {event && (
              <>
                <section className="admin-card admin-stack">
                  <h2>Détails techniques de l’événement</h2>
                  <div className="admin-form-grid">
                    {[
                      ["city", "Ville"],
                      ["country", "Pays"],
                      ["venue", "Lieu / Espace"],
                      ["role", "Intervention OPUS"],
                      ["audience", "Public / Jauge"],
                      ["hours", "Horaires"],
                    ].map(([key, label]) => (
                      <Field
                        key={key}
                        label={label}
                        value={String(event[key as keyof CmsEvent] || "")}
                        onChange={(v) => set(key, v)}
                      />
                    ))}
                  </div>

                  <Lines
                    label="À propos du projet (paragraphes détaillés)"
                    value={event.about}
                    onChange={(v) => set("about", v)}
                  />

                  <Field
                    label="Titre du bloc interventions"
                    value={event.lineupLabel}
                    onChange={(v) => set("lineupLabel", v)}
                  />

                  <Lines
                    label="Missions & réalisations concrètes"
                    value={event.lineup}
                    onChange={(v) => set("lineup", v)}
                  />
                </section>

                <section className="admin-card admin-stack">
                  <div className="admin-heading" style={{ marginBottom: 4 }}>
                    <div>
                      <h2>Galerie photos du projet</h2>
                      <p className="admin-muted" style={{ fontSize: 13 }}>
                        Organisez l’ordre d’apparition des photos avec les flèches. Vous pouvez retirer une photo ou en ajouter depuis la médiathèque.
                      </p>
                    </div>
                  </div>

                  <div className="admin-gallery-pro">
                    {event.gallery.map((url, i) => (
                      <div key={`${url}/${i}`} className="admin-gallery-item">
                        <img src={url} alt={`Photo ${i + 1}`} className="admin-gallery-thumb" />
                        <span className="admin-gallery-index">{i + 1}</span>
                        <div className="admin-gallery-actions">
                          <button
                            type="button"
                            className="admin-icon-btn"
                            aria-label="Monter la photo"
                            disabled={i === 0}
                            onClick={() => {
                              const next = [...event.gallery];
                              [next[i - 1], next[i]] = [next[i], next[i - 1]];
                              set("gallery", next);
                            }}
                          >
                            <ArrowUp size={13} />
                          </button>
                          <button
                            type="button"
                            className="admin-icon-btn"
                            aria-label="Descendre la photo"
                            disabled={i === event.gallery.length - 1}
                            onClick={() => {
                              const next = [...event.gallery];
                              [next[i + 1], next[i]] = [next[i], next[i + 1]];
                              set("gallery", next);
                            }}
                          >
                            <ArrowDown size={13} />
                          </button>
                          <button
                            type="button"
                            className="admin-icon-btn admin-icon-btn-danger"
                            aria-label="Retirer de la galerie"
                            onClick={() =>
                              set(
                                "gallery",
                                event.gallery.filter((_, index) => index !== i),
                              )
                            }
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <MediaPicker
                    value=""
                    label="Ajouter une photo à la galerie"
                    onChange={(url) => {
                      if (url && !event.gallery.includes(url))
                        set("gallery", [...event.gallery, url]);
                    }}
                  />
                </section>
              </>
            )}

            {/* Section spécifique : Membre d'équipe */}
            {member && (
              <section className="admin-card admin-stack">
                <h2>Parcours, missions et projets associés</h2>
                <Field
                  label="Citation signature"
                  multiline
                  value={member.quote}
                  onChange={(v) => set("quote", v)}
                  hint="Devise ou citation personnelle affichée en haut de la fiche membre."
                />

                {[
                  ["bio", "Biographie & Expérience"],
                  ["missions", "Missions chez OPUS"],
                  ["expertise", "Expertises techniques"],
                ].map(([key, label]) => (
                  <Lines
                    key={key}
                    label={label}
                    value={member[key as "bio" | "missions" | "expertise"]}
                    onChange={(v) => set(key, v)}
                  />
                ))}

                <div className="admin-field">
                  <span>Projets OPUS associés à ce membre</span>
                  <div className="admin-projects-selector">
                    {snapshot.content.events.map((project) => {
                      const isChecked = member.projectSlugs.includes(project.slug);
                      return (
                        <label
                          key={project.id}
                          className={`admin-project-choice ${isChecked ? "is-selected" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) =>
                              set(
                                "projectSlugs",
                                e.target.checked
                                  ? [...member.projectSlugs, project.slug]
                                  : member.projectSlugs.filter(
                                      (s) => s !== project.slug,
                                    ),
                              )
                            }
                          />
                          <span>{project.title}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* Optimisation pour les moteurs de recherche (SEO) */}
            <section className="admin-card admin-stack">
              <div className="admin-heading" style={{ marginBottom: 4 }}>
                <div>
                  <h2>Référencement naturel (SEO & Partage)</h2>
                  <p className="admin-muted" style={{ fontSize: 13 }}>
                    Personnalisez le titre et la description qui s’affichent dans Google et lors des partages sur LinkedIn/WhatsApp.
                  </p>
                </div>
              </div>

              <div>
                <Field
                  label="Titre SEO (balise <title>)"
                  value={entry.seoTitle}
                  onChange={(v) => set("seoTitle", v)}
                  hint="Idéalement entre 40 et 60 caractères. Laissez vide pour utiliser le titre standard."
                />
                <div className="admin-char-meter">
                  <span style={{ color: entry.seoTitle.length > 60 ? "#d97706" : "#64748b" }}>
                    {entry.seoTitle.length} / 60 caractères recommandés
                  </span>
                </div>
              </div>

              <div>
                <Field
                  label="Meta description"
                  multiline
                  value={entry.seoDescription}
                  onChange={(v) => set("seoDescription", v)}
                  hint="Idéalement entre 120 et 160 caractères. Laissez vide pour utiliser le résumé."
                />
                <div className="admin-char-meter">
                  <span style={{ color: entry.seoDescription.length > 160 ? "#d97706" : "#64748b" }}>
                    {entry.seoDescription.length} / 160 caractères recommandés
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Colonne droite (Statut, Photo de couverture, Historique) */}
          <aside className="admin-stack">
            {/* Carte de publication */}
            <section className="admin-card admin-stack">
              <h2>Visibilité & Publication</h2>

              <label className="admin-field">
                <span>Statut de publication</span>
                <select
                  value={entry.status}
                  onChange={(e) => set("status", e.target.value)}
                  className="admin-select-status"
                >
                  {Object.entries(statuses).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <small>
                  Les statuts <strong>Brouillon</strong> et <strong>Archivé</strong> sont strictement invisibles sur le site public.
                </small>
              </label>

              {event && (
                <label className="admin-actions admin-checkbox-label">
                  <input
                    type="checkbox"
                    checked={event.featured}
                    onChange={(e) => set("featured", e.target.checked)}
                  />
                  <span>Projet vedette à la une de l’accueil</span>
                </label>
              )}

              <button
                type="submit"
                disabled={busy}
                className="admin-btn admin-btn-primary"
                style={{ width: "100%", marginTop: 8 }}
              >
                <Check size={15} />
                {entry.status === "published" ? "Enregistrer & publier" : "Enregistrer en brouillon"}
              </button>

              {initial.status === "published" && initial.revision > 0 && (
                <Link
                  href={`/${routes[collection]}/${initial.slug}`}
                  target="_blank"
                  className="admin-btn"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <ExternalLink size={14} />
                  Voir la page en direct
                </Link>
              )}
            </section>

            {/* Carte média couverture / portrait */}
            <section className="admin-card admin-stack">
              <h2>{member ? "Portrait officiel" : "Visuel de couverture"}</h2>
              <MediaPicker
                value={entry.image || ""}
                label={member ? "Portrait du membre" : "Image principale"}
                onChange={(v) => set("image", v)}
                onAlt={(v) => {
                  if (!member && v) set("alt", v);
                }}
              />
              {!member && (
                <Field
                  label="Description de l’image (Alt text)"
                  value={(entry as CmsArticle | CmsEvent).alt}
                  onChange={(v) => set("alt", v)}
                  hint="Description accessible pour les lecteurs d'écran et Google."
                />
              )}
            </section>

            {/* Carte métadonnées & Historique */}
            {initial.revision > 0 && (
              <section className="admin-card admin-stack">
                <div className="admin-entry-meta-info">
                  <p className="admin-muted" style={{ fontSize: 12 }}>
                    Dernière modification le {dateLabel(entry.updatedAt)}
                  </p>
                  <p className="admin-muted" style={{ fontSize: 12 }}>
                    Version actuelle : <strong>v{entry.revision}</strong>
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-btn"
                  onClick={async () => {
                    try {
                      const data = await adminApi<{
                        items: NonNullable<typeof history>;
                      }>(`${collection}/${entry.id}/history`);
                      setHistory(data.items);
                    } catch (err) {
                      setError((err as Error).message);
                    }
                  }}
                >
                  <History size={14} />
                  Historique des versions
                </button>

                {user.role === "admin" && (
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger"
                    disabled={busy}
                    onClick={() => void remove()}
                    style={{ marginTop: 8 }}
                  >
                    <Trash2 size={14} />
                    Supprimer définitivement la fiche
                  </button>
                )}
              </section>
            )}
          </aside>
        </div>
      </form>

      {/* Modal d'aperçu privé en direct */}
      {preview && (
        <div className="admin-modal-backdrop" onClick={() => setPreview(false)}>
          <div
            className="admin-modal admin-preview-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Aperçu du contenu"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-heading">
              <div>
                <h2>Aperçu privé du rendu</h2>
                <p className="admin-muted">
                  Cet aperçu reflète vos modifications en cours, même non enregistrées.
                </p>
              </div>
              <button
                className="admin-btn"
                onClick={() => setPreview(false)}
                aria-label="Fermer"
              >
                <X size={16} />
              </button>
            </div>
            <EntryPreview entry={entry} />
          </div>
        </div>
      )}

      {/* Modal d'historique des versions */}
      {history && (
        <div className="admin-modal-backdrop" onClick={() => setHistory(null)}>
          <div
            className="admin-modal admin-history-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Versions précédentes"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-heading">
              <div>
                <h2>Historique des révisions</h2>
                <p className="admin-muted">
                  Consultez les versions antérieures et restaurez-les en brouillon.
                </p>
              </div>
              <button
                className="admin-btn"
                onClick={() => setHistory(null)}
                aria-label="Fermer"
              >
                <X size={16} />
              </button>
            </div>

            {history.length ? (
              <div className="admin-history-list">
                {history.map((version) => (
                  <div className="admin-history-row" key={version.id}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 13 }}>
                        {dateLabel(version.date)} par {version.actor}
                      </p>
                      <p className="admin-muted" style={{ fontSize: 12, marginTop: 2 }}>
                        {titleOf(version.data)}
                      </p>
                    </div>
                    <button
                      className="admin-btn admin-btn-small"
                      onClick={() => {
                        if (
                          dirty &&
                          !window.confirm(
                            "Remplacer vos modifications en cours par cette version ?",
                          )
                        )
                          return;
                        setEntry({
                          ...version.data,
                          slug: entry.slug,
                          revision: entry.revision,
                          status: "draft",
                        });
                        setHistory(null);
                        setNotice(
                          "Version restaurée en brouillon. Cliquez sur Enregistrer pour la valider.",
                        );
                      }}
                    >
                      Restaurer en brouillon
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="admin-empty">Aucune version précédente pour cette fiche.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ==========================================================================
   Éditeur de Blocs Notion-like pour les Articles
   ========================================================================== */
type Block = CmsArticle["blocks"][number];
function ArticleBlocks({
  article,
  onChange,
}: {
  article: CmsArticle;
  onChange: (blocks: Block[]) => void;
}) {
  const blocks: Block[] = article.blocks.length
    ? article.blocks
    : article.body.map((text) => ({ type: "paragraph", text }));

  const update = (i: number, block: Block) =>
    onChange(blocks.map((old, index) => (index === i ? block : old)));

  return (
    <div className="admin-stack">
      {blocks.map((block, i) => (
        <div key={i} className="admin-block-card">
          <div className="admin-block-header">
            <span className="admin-block-pill">
              <GripVertical size={13} style={{ color: "#94a3b8" }} />
              {block.type === "paragraph" && "Paragraphe"}
              {block.type === "heading" && "Titre H2"}
              {block.type === "quote" && "Citation"}
              {block.type === "list" && "Liste à puces"}
              {block.type === "image" && "Illustration"}
              <span className="admin-block-num">#{i + 1}</span>
            </span>

            <div className="admin-actions">
              <button
                type="button"
                className="admin-icon-btn"
                aria-label="Monter le bloc"
                disabled={i === 0}
                onClick={() => {
                  const next = [...blocks];
                  [next[i - 1], next[i]] = [next[i], next[i - 1]];
                  onChange(next);
                }}
              >
                <ArrowUp size={12} />
              </button>
              <button
                type="button"
                className="admin-icon-btn"
                aria-label="Descendre le bloc"
                disabled={i === blocks.length - 1}
                onClick={() => {
                  const next = [...blocks];
                  [next[i + 1], next[i]] = [next[i], next[i + 1]];
                  onChange(next);
                }}
              >
                <ArrowDown size={12} />
              </button>
              <button
                type="button"
                className="admin-icon-btn admin-icon-btn-danger"
                aria-label="Supprimer le bloc"
                onClick={() =>
                  onChange(blocks.filter((_, index) => index !== i))
                }
              >
                <X size={12} />
              </button>
            </div>
          </div>

          {block.type === "image" ? (
            <div className="admin-stack" style={{ gap: 12 }}>
              <MediaPicker
                value={block.url}
                onChange={(url) => update(i, { ...block, url })}
              />
              <div className="admin-form-grid">
                <Field
                  label="Description de l’image (Alt)"
                  value={block.alt}
                  onChange={(alt) => update(i, { ...block, alt })}
                />
                <Field
                  label="Légende affichée sous l’image"
                  value={block.caption}
                  onChange={(caption) => update(i, { ...block, caption })}
                />
              </div>
            </div>
          ) : (
            <div className="admin-stack" style={{ gap: 10 }}>
              <div className="admin-actions">
                <label className="admin-field" style={{ width: "auto" }}>
                  <select
                    value={block.type}
                    onChange={(e) =>
                      update(i, {
                        type: e.target.value as
                          | "paragraph"
                          | "heading"
                          | "quote"
                          | "list",
                        text: block.text,
                      })
                    }
                  >
                    <option value="paragraph">Paragraphe courant</option>
                    <option value="heading">Intertitre (H2)</option>
                    <option value="quote">Citation mise en avant</option>
                    <option value="list">Liste à puces (1 par ligne)</option>
                  </select>
                </label>
              </div>

              <textarea
                value={block.text}
                rows={block.type === "heading" ? 2 : 4}
                placeholder={
                  block.type === "heading"
                    ? "Titre de section…"
                    : block.type === "quote"
                      ? "Citation marquante…"
                      : block.type === "list"
                        ? "Premier élément\nDeuxième élément\nTroisième élément..."
                        : "Rédigez votre paragraphe…"
                }
                onChange={(e) => update(i, { ...block, text: e.target.value })}
                className={block.type === "heading" ? "admin-input-h2" : block.type === "quote" ? "admin-input-quote" : ""}
              />
            </div>
          )}
        </div>
      ))}

      {/* Barre d'insertion rapide de blocs */}
      <div className="admin-add-blocks-bar">
        <span className="admin-muted" style={{ fontSize: 12, marginRight: 6 }}>
          Ajouter un bloc :
        </span>
        <button
          type="button"
          className="admin-btn admin-btn-small"
          onClick={() => onChange([...blocks, { type: "paragraph", text: "" }])}
        >
          <FileText size={13} /> Paragraphe
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-small"
          onClick={() => onChange([...blocks, { type: "heading", text: "" }])}
        >
          <Heading2 size={13} /> Intertitre H2
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-small"
          onClick={() => onChange([...blocks, { type: "quote", text: "" }])}
        >
          <Quote size={13} /> Citation
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-small"
          onClick={() => onChange([...blocks, { type: "list", text: "" }])}
        >
          <ListPlus size={13} /> Liste
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-small"
          onClick={() =>
            onChange([
              ...blocks,
              { type: "image", url: "", alt: "", caption: "" },
            ])
          }
        >
          <ImageIcon size={13} /> Image
        </button>
      </div>
    </div>
  );
}

export function EntryPreview({ entry }: { entry: CmsEntry }) {
  return (
    <article className="admin-card admin-prose">
      <span className="admin-badge admin-badge-published" style={{ marginBottom: 12 }}>
        {"category" in entry ? entry.category : entry.role}
      </span>
      <h1>{titleOf(entry)}</h1>
      <p className="admin-muted" style={{ fontSize: 16, lineHeight: 1.5, marginBottom: 20 }}>
        {entry.excerpt}
      </p>
      {entry.image && (
        <img
          src={entry.image}
          alt={"alt" in entry ? entry.alt : entry.name}
          style={{
            width: "100%",
            maxHeight: 460,
            objectFit: "cover",
            borderRadius: 12,
            marginBottom: 28,
          }}
        />
      )}
      {"intro" in entry && entry.intro && (
        <p style={{ fontWeight: 600, fontSize: 18, lineHeight: 1.6, marginBottom: 24, color: "#192137" }}>
          {entry.intro}
        </p>
      )}
      {"blocks" in entry && entry.blocks.length ? (
        <ArticleBody blocks={entry.blocks} />
      ) : (
        (
          ("body" in entry
            ? entry.body
            : "about" in entry
              ? entry.about
              : entry.bio) as string[]
        ).map((text, i) => <p key={i}>{text}</p>)
      )}
    </article>
  );
}

/* ==========================================================================
   Configuration Globale (Site, Pages, FAQ, Services)
   ========================================================================== */
const fieldLabels: Record<string, string> = {
  name: "Nom du site",
  shortName: "Nom court",
  tagline: "Slogan / Signature",
  motto: "Devise",
  description: "Description de l'agence",
  seoDescription: "Description SEO globale",
  mission: "Mission",
  promise: "Promesse",
  city: "Ville principale",
  address: "Adresse physique",
  line1: "Adresse, ligne 1",
  line2: "Adresse, ligne 2",
  phone: "Téléphone affiché",
  phoneHref: "Lien téléphone (tel:…)",
  email: "E-mail de contact",
  whatsapp: "Lien WhatsApp direct",
  socials: "Réseaux sociaux",
  label: "Libellé",
  href: "Lien URL",
  since: "Année de fondation",
  legal: "Informations légales d'entreprise",
  form: "Forme juridique",
  capital: "Capital social",
  rccm: "Numéro RCCM",
  ifu: "Numéro IFU",
  departments: "Départements",
  stats: "Chiffres clés",
  services: "Services",
  projectTypes: "Types de projets",
  nav: "Navigation principale",
  cta: "Bouton d'action principal (CTA)",
  heroVideo: "Vidéo d’accueil (Hero)",
  heroPoster: "Image poster de la vidéo d’accueil",
  helpVideo: "Vidéo de fond du formulaire de contact",
  helpPoster: "Image poster du formulaire de contact",
  aboutImage: "Image principale de la page À propos",
  aboutImageAlt: "Description de l’image À propos",
  cultureImage: "Image du bloc Culture & Vision",
  cultureImageAlt: "Description de l’image Culture",
  aboutSubtitle: "Introduction de la page À propos",
  cultureTitle: "Titre du bloc Culture",
  cultureText: "Texte du bloc Culture",
  q: "Question posée",
  a: "Réponse détaillée",
  id: "Identifiant",
  num: "Numéro d'ordre",
  desc: "Description du service",
  items: "Prestations incluses",
  dark: "Apparence sombre",
  pole: "Pôle OPUS",
};

type Editable =
  string | number | boolean | null | Editable[] | { [key: string]: Editable };

function emptyLike(value: Editable): Editable {
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [
        key,
        key === "pole" ? "event" : emptyLike(val),
      ]),
    );
  if (typeof value === "boolean") return false;
  if (typeof value === "number") return 0;
  return "";
}

/* ==========================================================================
   Composant Accordéon pour les Listes & Tableaux (FAQ, Services, etc.)
   ========================================================================== */
function AccordionArrayFields({
  value,
  name,
  label,
  onChange,
}: {
  value: Editable[];
  name: string;
  label: string;
  onChange: (val: Editable[]) => void;
}) {
  const [openSet, setOpenSet] = useState<Set<number>>(() => new Set([0]));

  const toggle = (i: number) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const expandAll = () => setOpenSet(new Set(value.map((_, i) => i)));
  const collapseAll = () => setOpenSet(new Set());

  const getItemTitle = (item: Editable, i: number) => {
    if (!item) return `Élément #${i + 1}`;
    if (typeof item === "string") return item.trim() || `Élément #${i + 1}`;
    if (typeof item === "object") {
      const rec = item as Record<string, unknown>;
      if (rec.q) return String(rec.q).trim() || `Question #${i + 1}`;
      if (rec.name) return String(rec.name).trim() || `Service #${i + 1}`;
      if (rec.title) return String(rec.title).trim() || `Fiche #${i + 1}`;
      if (rec.label) return String(rec.label).trim() || `Lien #${i + 1}`;
      if (rec.id) return String(rec.id);
    }
    return `Élément #${i + 1}`;
  };

  const getItemSnippet = (item: Editable) => {
    if (!item || typeof item !== "object") return "";
    const rec = item as Record<string, unknown>;
    if (rec.a) {
      const a = String(rec.a).replace(/\n/g, " ").trim();
      return a.length > 70 ? a.slice(0, 70) + "…" : a;
    }
    if (rec.desc) {
      const desc = String(rec.desc).replace(/\n/g, " ").trim();
      return desc.length > 70 ? desc.slice(0, 70) + "…" : desc;
    }
    if (rec.pole) {
      const p = String(rec.pole).toUpperCase();
      const count = Array.isArray(rec.items) ? rec.items.length : 0;
      return `Pôle ${p} · ${count} prestation${count > 1 ? "s" : ""}`;
    }
    if (rec.href) return String(rec.href);
    return "";
  };

  const addItem = () => {
    const newItem = value.length
      ? emptyLike(value[0])
      : name === "faq"
        ? { q: "", a: "" }
        : name === "services"
          ? {
              id: `service-${Date.now().toString().slice(-4)}`,
              num: String(value.length + 1).padStart(2, "0"),
              name: "",
              desc: "",
              items: [],
              cta: "Contactez-nous",
              dark: false,
              pole: "event",
            }
          : name === "socials" || name === "nav"
            ? { label: "", href: "" }
            : "";
    const nextList = [...value, newItem];
    onChange(nextList);
    setOpenSet((prev) => new Set([...prev, nextList.length - 1]));
  };

  return (
    <div className="admin-accordion-group">
      <div className="admin-accordion-group-header">
        <div className="admin-accordion-group-title">
          {name && <h3>{label}</h3>}
          <span className="admin-accordion-count-badge">
            {value.length} élément{value.length > 1 ? "s" : ""}
          </span>
        </div>
        <div className="admin-actions">
          {value.length > 1 && (
            <>
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-small"
                onClick={expandAll}
                title="Tout déplier"
              >
                Tout déplier
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-small"
                onClick={collapseAll}
                title="Tout replier"
              >
                Tout replier
              </button>
            </>
          )}
          <button
            type="button"
            className="admin-btn admin-btn-primary admin-btn-small"
            onClick={addItem}
          >
            <Plus size={14} />
            Ajouter un élément
          </button>
        </div>
      </div>

      <div className="admin-accordion-list">
        {value.map((item, i) => {
          const isOpen = openSet.has(i);
          const title = getItemTitle(item, i);
          const snippet = getItemSnippet(item);

          return (
            <div
              key={i}
              className={`admin-accordion-card ${isOpen ? "is-open" : "is-collapsed"}`}
            >
              <div
                className="admin-accordion-card-header"
                onClick={() => toggle(i)}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
              >
                <div className="admin-accordion-card-lead">
                  <span className="admin-accordion-card-num">
                    #{String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="admin-accordion-card-headings">
                    <span className="admin-accordion-card-title">{title}</span>
                    {snippet && !isOpen && (
                      <span className="admin-accordion-card-snippet">{snippet}</span>
                    )}
                  </div>
                </div>

                <div
                  className="admin-accordion-card-tools"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="admin-icon-btn"
                    aria-label="Monter"
                    title="Monter d’un rang"
                    disabled={!i}
                    onClick={() => {
                      const next = [...value];
                      [next[i - 1], next[i]] = [next[i], next[i - 1]];
                      onChange(next);
                      setOpenSet((prev) => {
                        const s = new Set<number>();
                        if (prev.has(i)) s.add(i - 1);
                        if (prev.has(i - 1)) s.add(i);
                        return s;
                      });
                    }}
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    className="admin-icon-btn"
                    aria-label="Descendre"
                    title="Descendre d’un rang"
                    disabled={i === value.length - 1}
                    onClick={() => {
                      const next = [...value];
                      [next[i + 1], next[i]] = [next[i], next[i + 1]];
                      onChange(next);
                      setOpenSet((prev) => {
                        const s = new Set<number>();
                        if (prev.has(i)) s.add(i + 1);
                        if (prev.has(i + 1)) s.add(i);
                        return s;
                      });
                    }}
                  >
                    <ArrowDown size={13} />
                  </button>
                  <button
                    type="button"
                    className="admin-icon-btn admin-icon-btn-danger"
                    aria-label="Supprimer cet élément"
                    title="Supprimer définitivement"
                    onClick={() => {
                      onChange(value.filter((_, index) => index !== i));
                      setOpenSet((prev) => {
                        const next = new Set<number>();
                        for (const idx of prev) {
                          if (idx < i) next.add(idx);
                          else if (idx > i) next.add(idx - 1);
                        }
                        return next;
                      });
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                  <button
                    type="button"
                    className="admin-accordion-toggle-btn"
                    onClick={() => toggle(i)}
                    aria-label={isOpen ? "Replier" : "Déplier"}
                  >
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="admin-accordion-card-body">
                  <ObjectFields
                    value={item}
                    name={typeof item === "string" ? "Texte" : ""}
                    onChange={(next) =>
                      onChange(value.map((old, index) => (index === i ? next : old)))
                    }
                  />
                </div>
              )}
            </div>
          );
        })}

        {!value.length && (
          <div className="admin-accordion-empty">
            <p className="admin-muted">Aucun élément dans cette liste pour le moment.</p>
            <button
              type="button"
              className="admin-btn admin-btn-primary admin-btn-small"
              onClick={addItem}
            >
              <Plus size={14} /> Créer le premier élément
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   Volets Dépliables / Accordéons pour les Paramètres Généraux du Site
   ========================================================================== */
function SiteConfigSections({
  value,
  onChange,
}: {
  value: Record<string, unknown>;
  onChange: (val: Record<string, unknown>) => void;
}) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(["identity"]),
  );

  const toggle = (sec: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(sec)) next.delete(sec);
      else next.add(sec);
      return next;
    });
  };

  const expandAll = () =>
    setOpenSections(new Set(["identity", "contact", "legal"]));
  const collapseAll = () => setOpenSections(new Set());

  const identityKeys = [
    "name",
    "shortName",
    "tagline",
    "motto",
    "since",
    "description",
    "seoDescription",
    "mission",
    "promise",
    "departments",
  ];
  const contactKeys = ["email", "phone", "phoneHref", "city", "address"];
  const legalKeys = ["legal"];

  return (
    <div className="admin-config-sections">
      <div className="admin-accordion-group-header" style={{ marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
            Paramètres du studio & Coordonnées
          </h3>
          <p className="admin-muted" style={{ fontSize: 12, margin: "2px 0 0" }}>
            Organisé en 3 volets dépliables pour une gestion fluide.
          </p>
        </div>
        <div className="admin-actions">
          <button
            type="button"
            className="admin-btn admin-btn-ghost admin-btn-small"
            onClick={expandAll}
          >
            Tout déplier
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-ghost admin-btn-small"
            onClick={collapseAll}
          >
            Tout replier
          </button>
        </div>
      </div>

      {/* Volet 1: Identité */}
      <div
        className={`admin-collapsible-section ${openSections.has("identity") ? "is-open" : "is-collapsed"}`}
      >
        <div
          className="admin-collapsible-header"
          onClick={() => toggle("identity")}
          role="button"
          tabIndex={0}
        >
          <div className="admin-collapsible-title-wrap">
            <span className="admin-collapsible-icon">🏢</span>
            <div>
              <h4 className="admin-collapsible-title">Identité, Slogans & Présentation</h4>
              <p className="admin-collapsible-desc">
                Nom officiel, devise, accroches de marque et description SEO
              </p>
            </div>
          </div>
          <button
            type="button"
            className="admin-accordion-toggle-btn"
            aria-label="Basculer"
          >
            {openSections.has("identity") ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
        </div>
        {openSections.has("identity") && (
          <div className="admin-collapsible-body">
            {identityKeys.map((key) =>
              key in value ? (
                <ObjectFields
                  key={key}
                  name={key}
                  value={value[key] as Editable}
                  onChange={(v) => onChange({ ...value, [key]: v })}
                />
              ) : null,
            )}
          </div>
        )}
      </div>

      {/* Volet 2: Contact */}
      <div
        className={`admin-collapsible-section ${openSections.has("contact") ? "is-open" : "is-collapsed"}`}
      >
        <div
          className="admin-collapsible-header"
          onClick={() => toggle("contact")}
          role="button"
          tabIndex={0}
        >
          <div className="admin-collapsible-title-wrap">
            <span className="admin-collapsible-icon">📞</span>
            <div>
              <h4 className="admin-collapsible-title">Coordonnées de l’Agence & Réseau</h4>
              <p className="admin-collapsible-desc">
                Email officiel, téléphone, ville et adresse physique
              </p>
            </div>
          </div>
          <button
            type="button"
            className="admin-accordion-toggle-btn"
            aria-label="Basculer"
          >
            {openSections.has("contact") ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
        </div>
        {openSections.has("contact") && (
          <div className="admin-collapsible-body">
            {contactKeys.map((key) =>
              key in value ? (
                <ObjectFields
                  key={key}
                  name={key}
                  value={value[key] as Editable}
                  onChange={(v) => onChange({ ...value, [key]: v })}
                />
              ) : null,
            )}
          </div>
        )}
      </div>

      {/* Volet 3: Légal */}
      <div
        className={`admin-collapsible-section ${openSections.has("legal") ? "is-open" : "is-collapsed"}`}
      >
        <div
          className="admin-collapsible-header"
          onClick={() => toggle("legal")}
          role="button"
          tabIndex={0}
        >
          <div className="admin-collapsible-title-wrap">
            <span className="admin-collapsible-icon">⚖️</span>
            <div>
              <h4 className="admin-collapsible-title">Informations Légales & Conformité</h4>
              <p className="admin-collapsible-desc">
                Raison sociale, forme juridique, capital social, RCCM et IFU
              </p>
            </div>
          </div>
          <button
            type="button"
            className="admin-accordion-toggle-btn"
            aria-label="Basculer"
          >
            {openSections.has("legal") ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
        </div>
        {openSections.has("legal") && (
          <div className="admin-collapsible-body">
            {legalKeys.map((key) =>
              key in value ? (
                <ObjectFields
                  key={key}
                  name={key}
                  value={value[key] as Editable}
                  onChange={(v) => onChange({ ...value, [key]: v })}
                />
              ) : null,
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   Volets Dépliables / Accordéons pour les Visuels & Vidéos des Pages
   ========================================================================== */
function PagesConfigSections({
  value,
  onChange,
}: {
  value: Record<string, unknown>;
  onChange: (val: Record<string, unknown>) => void;
}) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(["home"]),
  );

  const toggle = (sec: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(sec)) next.delete(sec);
      else next.add(sec);
      return next;
    });
  };

  const expandAll = () =>
    setOpenSections(new Set(["home", "contact", "about"]));
  const collapseAll = () => setOpenSections(new Set());

  const homeKeys = [
    "heroVideo",
    "heroPoster",
    "cultureTitle",
    "cultureText",
    "cultureImage",
    "cultureImageAlt",
  ];
  const contactKeys = ["helpVideo", "helpPoster"];
  const aboutKeys = ["aboutSubtitle", "aboutImage", "aboutImageAlt"];

  return (
    <div className="admin-config-sections">
      <div className="admin-accordion-group-header" style={{ marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
            Visuels & Médias des pages publiques
          </h3>
          <p className="admin-muted" style={{ fontSize: 12, margin: "2px 0 0" }}>
            Vidéos d’ambiance, posters de secours et photos par section.
          </p>
        </div>
        <div className="admin-actions">
          <button
            type="button"
            className="admin-btn admin-btn-ghost admin-btn-small"
            onClick={expandAll}
          >
            Tout déplier
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-ghost admin-btn-small"
            onClick={collapseAll}
          >
            Tout replier
          </button>
        </div>
      </div>

      {/* Volet 1: Accueil */}
      <div
        className={`admin-collapsible-section ${openSections.has("home") ? "is-open" : "is-collapsed"}`}
      >
        <div
          className="admin-collapsible-header"
          onClick={() => toggle("home")}
          role="button"
          tabIndex={0}
        >
          <div className="admin-collapsible-title-wrap">
            <span className="admin-collapsible-icon">🎬</span>
            <div>
              <h4 className="admin-collapsible-title">Page d’Accueil (Hero & Ambiance)</h4>
              <p className="admin-collapsible-desc">
                Vidéo plein écran, poster de préchargement et section culture
              </p>
            </div>
          </div>
          <button
            type="button"
            className="admin-accordion-toggle-btn"
            aria-label="Basculer"
          >
            {openSections.has("home") ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
        </div>
        {openSections.has("home") && (
          <div className="admin-collapsible-body">
            {homeKeys.map((key) =>
              key in value ? (
                <ObjectFields
                  key={key}
                  name={key}
                  value={value[key] as Editable}
                  onChange={(v) => onChange({ ...value, [key]: v })}
                />
              ) : null,
            )}
          </div>
        )}
      </div>

      {/* Volet 2: Contact */}
      <div
        className={`admin-collapsible-section ${openSections.has("contact") ? "is-open" : "is-collapsed"}`}
      >
        <div
          className="admin-collapsible-header"
          onClick={() => toggle("contact")}
          role="button"
          tabIndex={0}
        >
          <div className="admin-collapsible-title-wrap">
            <span className="admin-collapsible-icon">✉️</span>
            <div>
              <h4 className="admin-collapsible-title">Page Réservation & Formulaire</h4>
              <p className="admin-collapsible-desc">
                Vidéo d’arrière-plan et poster de chargement
              </p>
            </div>
          </div>
          <button
            type="button"
            className="admin-accordion-toggle-btn"
            aria-label="Basculer"
          >
            {openSections.has("contact") ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
        </div>
        {openSections.has("contact") && (
          <div className="admin-collapsible-body">
            {contactKeys.map((key) =>
              key in value ? (
                <ObjectFields
                  key={key}
                  name={key}
                  value={value[key] as Editable}
                  onChange={(v) => onChange({ ...value, [key]: v })}
                />
              ) : null,
            )}
          </div>
        )}
      </div>

      {/* Volet 3: À propos & Équipe */}
      <div
        className={`admin-collapsible-section ${openSections.has("about") ? "is-open" : "is-collapsed"}`}
      >
        <div
          className="admin-collapsible-header"
          onClick={() => toggle("about")}
          role="button"
          tabIndex={0}
        >
          <div className="admin-collapsible-title-wrap">
            <span className="admin-collapsible-icon">👥</span>
            <div>
              <h4 className="admin-collapsible-title">Section À Propos & Équipe</h4>
              <p className="admin-collapsible-desc">
                Visuel de présentation et texte d’introduction
              </p>
            </div>
          </div>
          <button
            type="button"
            className="admin-accordion-toggle-btn"
            aria-label="Basculer"
          >
            {openSections.has("about") ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
        </div>
        {openSections.has("about") && (
          <div className="admin-collapsible-body">
            {aboutKeys.map((key) =>
              key in value ? (
                <ObjectFields
                  key={key}
                  name={key}
                  value={value[key] as Editable}
                  onChange={(v) => onChange({ ...value, [key]: v })}
                />
              ) : null,
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ObjectFields({
  value,
  onChange,
  name = "",
}: {
  value: Editable;
  onChange: (value: Editable) => void;
  name?: string;
}) {
  const label = fieldLabels[name] || name;

  if (typeof value === "boolean")
    return (
      <label className="admin-actions admin-checkbox-label">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>{label}</span>
      </label>
    );

  if (Array.isArray(value))
    return (
      <AccordionArrayFields
        value={value}
        name={name}
        label={label}
        onChange={onChange}
      />
    );

  if (value && typeof value === "object")
    return (
      <div className="admin-stack" style={{ gap: 14 }}>
        {name && <h3 style={{ fontSize: 15, fontWeight: 700, margin: "8px 0 0" }}>{label}</h3>}
        {Object.entries(value).map(([key, item]) => (
          <ObjectFields
            key={key}
            value={item}
            name={key}
            onChange={(next) => onChange({ ...value, [key]: next })}
          />
        ))}
      </div>
    );

  if (/(?:Video|Poster|Image)$/.test(name))
    return (
      <MediaPicker
        label={label}
        kind={name.endsWith("Video") ? "video" : "image"}
        value={String(value || "")}
        onChange={onChange}
      />
    );

  if (name === "pole")
    return (
      <label className="admin-field">
        <span>Pôle d’intervention OPUS</span>
        <select
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="design">Design</option>
          <option value="branding">Branding</option>
          <option value="event">Event</option>
        </select>
      </label>
    );

  return (
    <Field
      label={label || "Valeur"}
      value={value === null ? "" : String(value)}
      type={typeof value === "number" ? "number" : "text"}
      multiline={[
        "description",
        "seoDescription",
        "mission",
        "promise",
        "a",
        "desc",
        "aboutSubtitle",
        "cultureText",
      ].includes(name)}
      onChange={(next) =>
        onChange(typeof value === "number" ? Number(next) : next)
      }
    />
  );
}

function Configuration({
  resource,
  snapshot,
  refresh,
}: {
  resource: "site" | "pages" | "faq" | "services";
  snapshot: Snapshot;
  refresh: () => Promise<void>;
}) {
  const [value, setValue] = useState<Editable>(
    snapshot.content[resource] as unknown as Editable,
  );
  const [revision, setRevision] = useState(snapshot.revisions[resource]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const names = {
    site: "Paramètres généraux du site",
    pages: "Visuels & Textes des pages",
    faq: "Questions fréquentes (FAQ)",
    services: "Services de l'agence",
  };

  const descriptions = {
    site: "Coordonnées, réseaux sociaux, informations légales et liens de navigation.",
    pages: "Vidéos d’accueil et du formulaire, posters de secours, photos des sections.",
    faq: "Les réponses aux questions récurrentes posées par vos clients et partenaires.",
    services: "Les 3 pôles d’intervention (Design, Branding, Event) et leurs prestations.",
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        setBusy(true);
        try {
          const result = await adminApi<{ revision: number }>(resource, "PUT", {
            data: value,
            revision,
          });
          setRevision(result.revision);
          await refresh();
          setSuccess(true);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <Heading
        title={names[resource]}
        description={descriptions[resource]}
      >
        <button
          type="submit"
          disabled={busy}
          className="admin-btn admin-btn-primary"
        >
          <Save size={15} />
          {busy ? "Enregistrement…" : "Enregistrer les modifications"}
        </button>
      </Heading>

      {error && (
        <div role="alert" className="admin-notice admin-error">
          <AlertCircle size={16} />
          <span style={{ whiteSpace: "pre-line" }}>{error}</span>
        </div>
      )}
      {success && (
        <div role="status" className="admin-notice admin-success">
          <Check size={16} />
          <span>✓ Modifications enregistrées avec succès et visibles en direct.</span>
        </div>
      )}

      <div className="admin-card" style={{ maxWidth: 960 }}>
        {resource === "site" && typeof value === "object" && !Array.isArray(value) ? (
          <SiteConfigSections
            value={value as Record<string, unknown>}
            onChange={(v) => {
              setValue(v as Editable);
              setSuccess(false);
            }}
          />
        ) : resource === "pages" && typeof value === "object" && !Array.isArray(value) ? (
          <PagesConfigSections
            value={value as Record<string, unknown>}
            onChange={(v) => {
              setValue(v as Editable);
              setSuccess(false);
            }}
          />
        ) : (
          <ObjectFields
            value={value}
            name={Array.isArray(value) ? resource : ""}
            onChange={(v) => {
              setValue(v);
              setSuccess(false);
            }}
          />
        )}
      </div>
    </form>
  );
}

/* ==========================================================================
   Boîte de Réception des Messages (Demandes de Devis)
   ========================================================================== */
function Messages({
  user,
  onUpdate,
}: {
  user: AdminUser;
  onUpdate?: () => void;
}) {
  const [items, setItems] = useState<Message[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const refresh = useCallback(async () => {
    try {
      const res = await adminApi<{ items: Message[] }>("messages");
      setItems(res.items);
      onUpdate?.();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [onUpdate]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function update(item: Message, status: Message["status"]) {
    try {
      await adminApi(`messages/${item.id}`, "PATCH", { status });
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  const list = items.filter(
    (item) =>
      (filter === "all" || item.status === filter) &&
      Object.values(item.data)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  return (
    <>
      <Heading
        title="Messages & Demandes"
        description="Les demandes de projets et réservations envoyées depuis le formulaire du site public."
      />

      {error && (
        <div role="alert" className="admin-notice admin-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Barre de filtre et recherche */}
      <div className="admin-media-header" style={{ marginBottom: 18 }}>
        <div className="admin-status-tabs">
          {[
            { id: "all", label: "Tous", count: items.length },
            { id: "new", label: "Nouveaux", count: items.filter((m) => m.status === "new").length },
            { id: "read", label: "Lus", count: items.filter((m) => m.status === "read").length },
            { id: "done", label: "Traités", count: items.filter((m) => m.status === "done").length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`admin-status-tab ${filter === tab.id ? "is-active" : ""}`}
              onClick={() => setFilter(tab.id)}
            >
              {tab.label}
              <span className="admin-status-tab-count">{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="admin-search-wrap" style={{ minWidth: 260 }}>
          <Search size={14} className="admin-search-icon" />
          <input
            aria-label="Rechercher un message"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, e-mail, projet…"
            className="admin-search-input"
          />
          {search && (
            <button
              type="button"
              className="admin-search-clear"
              onClick={() => setSearch("")}
              aria-label="Effacer la recherche"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="admin-stack" style={{ gap: 14 }}>
        {loading ? (
          <p role="status" className="admin-empty">Chargement de vos messages…</p>
        ) : list.length ? (
          list.map((item) => (
            <article
              key={item.id}
              className={`admin-card admin-message-card ${item.status === "new" ? "is-unread" : ""}`}
            >
              <div className="admin-message-header">
                <div className="admin-actions">
                  <div className="admin-avatar" style={{ background: item.status === "new" ? "#ffedd5" : "#f1f5f9", color: item.status === "new" ? "#c2410c" : "#475569" }}>
                    {item.data.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="admin-actions" style={{ gap: 8 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{item.data.name}</h3>
                      {item.status === "new" && (
                        <span className="admin-new-badge">Nouveau</span>
                      )}
                    </div>
                    <p className="admin-muted" style={{ fontSize: 12, marginTop: 2 }}>
                      Reçu le {dateLabel(item.created_at)} ·{" "}
                      <a href={`mailto:${item.data.email}`} className="admin-link">
                        {item.data.email}
                      </a>
                      {item.data.phone && (
                        <>
                          {" · "}
                          <a href={`tel:${item.data.phone}`} className="admin-link">
                            <Phone size={11} style={{ display: "inline", verticalAlign: "middle" }} /> {item.data.phone}
                          </a>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="admin-actions">
                  <select
                    className="admin-message-status-select"
                    aria-label={`Statut du message de ${item.data.name}`}
                    value={item.status}
                    onChange={(e) =>
                      void update(item, e.target.value as Message["status"])
                    }
                  >
                    <option value="new">● Nouveau</option>
                    <option value="read">○ Lu</option>
                    <option value="done">✓ Traité</option>
                  </select>
                </div>
              </div>

              <div className="admin-message-body-box">
                <p className="admin-message-project-type">
                  Projet envisagé : <strong>{item.data.project || "Non précisé"}</strong>
                </p>
              </div>

              <div className="admin-message-actions-bar">
                <a
                  href={`mailto:${item.data.email}?subject=${encodeURIComponent("Votre demande de projet — OPUS CORP")}`}
                  className="admin-btn admin-btn-small admin-btn-primary"
                >
                  <Mail size={13} />
                  Répondre par e-mail
                </a>
                {user.role === "admin" && (
                  <button
                    type="button"
                    className="admin-btn admin-btn-small admin-btn-danger"
                    onClick={async () => {
                      if (
                        !window.confirm(
                          `Supprimer définitivement la demande de « ${item.data.name} » ?`,
                        )
                      )
                        return;
                      try {
                        await adminApi(`messages/${item.id}`, "DELETE");
                        await refresh();
                      } catch (err) {
                        setError((err as Error).message);
                      }
                    }}
                  >
                    <Trash2 size={13} />
                    Supprimer
                  </button>
                )}
              </div>
            </article>
          ))
        ) : (
          <div className="admin-card admin-empty-box">
            <Mail size={36} style={{ color: "#a0a8be", margin: "0 auto 12px" }} />
            <p style={{ fontWeight: 600, fontSize: 16 }}>Aucun message</p>
            <p className="admin-muted" style={{ fontSize: 13, marginTop: 4 }}>
              {search ? "Aucun message ne correspond à vos filtres." : "Toutes les demandes ont été traitées."}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

/* ==========================================================================
   Gestion des Utilisateurs (Administrateurs & Éditeurs)
   ========================================================================== */
function Accounts() {
  const [items, setItems] = useState<Account[]>([]);
  const [editing, setEditing] = useState<{
    id?: string;
    name: string;
    email: string;
    role: "admin" | "editor";
    active: boolean;
    password: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setItems((await adminApi<{ items: Account[] }>("users")).items);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <>
      <Heading
        title="Comptes Utilisateurs"
        description="Gérez les accès administrateurs et éditeurs à l'espace de gestion."
      >
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={() =>
            setEditing({
              name: "",
              email: "",
              role: "editor",
              active: true,
              password: "",
            })
          }
        >
          <Plus size={15} />
          Créer un compte
        </button>
      </Heading>

      {error && (
        <div role="alert" className="admin-notice admin-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="admin-actions">
                      <div className="admin-avatar">
                        {item.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 13, margin: 0 }}>{item.name}</p>
                        <p className="admin-muted" style={{ fontSize: 12, margin: 0 }}>{item.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`admin-role-badge ${item.role === "admin" ? "is-admin" : "is-editor"}`}>
                      {item.role === "admin" ? "Administrateur" : "Éditeur"}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${item.active ? "admin-badge-published" : "admin-badge-draft"}`}>
                      {item.active ? "Actif" : "Désactivé"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions" style={{ justifyContent: "flex-end" }}>
                      <button
                        className="admin-btn admin-btn-small"
                        onClick={() =>
                          setEditing({
                            ...item,
                            active: Boolean(item.active),
                            password: "",
                          })
                        }
                      >
                        Modifier
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: 20, background: "#f8f9fc" }}>
        <h4 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 6px" }}>À propos des rôles d’accès :</h4>
        <p className="admin-muted" style={{ fontSize: 12, lineHeight: 1.6, margin: 0 }}>
          <strong>Éditeurs</strong> : peuvent rédiger des articles, ajouter des événements, gérer l’équipe, téléverser des visuels et répondre aux messages.<br />
          <strong>Administrateurs</strong> : ont un contrôle complet sur les paramètres généraux, la suppression définitive et la création de comptes.
        </p>
      </div>

      {editing && (
        <div className="admin-modal-backdrop">
          <form
            className="admin-modal admin-stack"
            style={{ maxWidth: 520 }}
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              setError("");
              try {
                await adminApi("users", "POST", {
                  ...editing,
                  password: editing.password || undefined,
                });
                setEditing(null);
                await refresh();
              } catch (err) {
                setError((err as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <div className="admin-heading">
              <h2>{editing.id ? "Modifier le compte" : "Créer un nouveau compte"}</h2>
              <button
                type="button"
                className="admin-btn"
                aria-label="Fermer"
                onClick={() => setEditing(null)}
              >
                <X size={14} />
              </button>
            </div>

            {error && (
              <div role="alert" className="admin-notice admin-error">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            <Field
              label="Nom complet de la personne"
              required
              value={editing.name}
              onChange={(name) => setEditing({ ...editing, name })}
            />

            <Field
              label="Adresse e-mail de connexion"
              type="email"
              required
              value={editing.email}
              onChange={(email) => setEditing({ ...editing, email })}
            />

            <Field
              label={
                editing.id
                  ? "Nouveau mot de passe (laisser vide pour ne pas changer)"
                  : "Mot de passe initial"
              }
              type="password"
              required={!editing.id}
              value={editing.password}
              onChange={(password) => setEditing({ ...editing, password })}
              hint="12 caractères minimum. La modification révoque les sessions actives du compte."
            />

            <label className="admin-field">
              <span>Niveau de permissions</span>
              <select
                value={editing.role}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    role: e.target.value as "admin" | "editor",
                  })
                }
              >
                <option value="editor">Éditeur (Articles, Événements, Équipe, Médias)</option>
                <option value="admin">Administrateur (Contrôle total + Configuration)</option>
              </select>
            </label>

            <label className="admin-actions admin-checkbox-label">
              <input
                type="checkbox"
                checked={editing.active}
                onChange={(e) =>
                  setEditing({ ...editing, active: e.target.checked })
                }
              />
              <span>Compte actif (autoriser la connexion)</span>
            </label>

            <button
              type="submit"
              disabled={busy}
              className="admin-btn admin-btn-primary"
              style={{ marginTop: 10 }}
            >
              {busy ? "Enregistrement…" : "Enregistrer le compte"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

/* ==========================================================================
   Journal d'Audit / Traçabilité des Connexions & Actions
   ========================================================================== */
function Audit() {
  const [items, setItems] = useState<
    {
      id: number;
      user_id?: string;
      actor: string;
      email?: string;
      action: string;
      target: string;
      ip?: string;
      device?: string;
      details?: string;
      date: string;
    }[]
  >([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<"all" | "auth" | "content" | "media" | "security">("all");
  const [search, setSearch] = useState("");
  const [copiedIp, setCopiedIp] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    adminApi<{ items: typeof items }>("audit")
      .then((data) => {
        setItems(data.items);
        setCurrentTime(Date.now());
      })
      .catch((err) => setError(err.message));
  }, []);

  const loadAudit = () => {
    setBusy(true);
    adminApi<{ items: typeof items }>("audit")
      .then((data) => {
        setItems(data.items);
        setCurrentTime(Date.now());
      })
      .catch((err) => setError(err.message))
      .finally(() => setBusy(false));
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedIp(text);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  const getRelativeTime = (dateStr: string) => {
    try {
      if (!currentTime) {
        return new Date(dateStr).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "short",
        });
      }
      const past = new Date(dateStr).getTime();
      const diffSec = Math.floor((currentTime - past) / 1000);
      if (diffSec < 60) return "À l’instant";
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `il y a ${diffMin} min`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `il y a ${diffHours} h`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return "hier";
      if (diffDays < 7) return `il y a ${diffDays} j`;
      return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
      });
    } catch {
      return "";
    }
  };

  const getActionBadge = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes("connexion") && !act.includes("échec")) {
      return {
        bg: "rgba(16, 185, 129, 0.12)",
        color: "#059669",
        border: "rgba(16, 185, 129, 0.25)",
        Icon: LogIn,
      };
    }
    if (act.includes("échec")) {
      return {
        bg: "rgba(239, 68, 68, 0.12)",
        color: "#dc2626",
        border: "rgba(239, 68, 68, 0.25)",
        Icon: AlertCircle,
      };
    }
    if (act.includes("déconnexion")) {
      return {
        bg: "rgba(100, 116, 139, 0.12)",
        color: "#475569",
        border: "rgba(100, 116, 139, 0.25)",
        Icon: LogOut,
      };
    }
    if (act.includes("création")) {
      return {
        bg: "rgba(139, 92, 246, 0.12)",
        color: "#7c3aed",
        border: "rgba(139, 92, 246, 0.25)",
        Icon: Plus,
      };
    }
    if (act.includes("publication")) {
      return {
        bg: "rgba(248, 177, 51, 0.15)",
        color: "#b45309",
        border: "rgba(248, 177, 51, 0.3)",
        Icon: Globe,
      };
    }
    if (act.includes("suppression")) {
      return {
        bg: "rgba(244, 63, 94, 0.12)",
        color: "#e11d48",
        border: "rgba(244, 63, 94, 0.25)",
        Icon: Trash2,
      };
    }
    if (act.includes("média")) {
      return {
        bg: "rgba(20, 184, 166, 0.12)",
        color: "#0d9488",
        border: "rgba(20, 184, 166, 0.25)",
        Icon: ImageIcon,
      };
    }
    if (act.includes("message")) {
      return {
        bg: "rgba(237, 106, 61, 0.12)",
        color: "#c2410c",
        border: "rgba(237, 106, 61, 0.25)",
        Icon: Mail,
      };
    }
    return {
      bg: "rgba(59, 130, 246, 0.12)",
      color: "#2563eb",
      border: "rgba(59, 130, 246, 0.25)",
      Icon: Activity,
    };
  };

  const filteredItems = items.filter((item) => {
    // Filter tabs
    if (filter === "auth") {
      const isAuth =
        item.action.includes("Connexion") ||
        item.action.includes("Échec") ||
        item.action.includes("Déconnexion");
      if (!isAuth) return false;
    } else if (filter === "content") {
      const isContent =
        item.action.includes("Création") ||
        item.action.includes("Modification") ||
        item.action.includes("Publication") ||
        (item.action.includes("Suppression") && !item.action.includes("média") && !item.action.includes("message"));
      if (!isContent) return false;
    } else if (filter === "media") {
      if (!item.action.includes("média")) return false;
    } else if (filter === "security") {
      const isSec =
        item.action.includes("compte") ||
        item.action.includes("Configuration") ||
        item.action.includes("Initialisation");
      if (!isSec) return false;
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        item.actor.toLowerCase().includes(q) ||
        (item.email || "").toLowerCase().includes(q) ||
        item.action.toLowerCase().includes(q) ||
        item.target.toLowerCase().includes(q) ||
        (item.details || "").toLowerCase().includes(q) ||
        (item.ip || "").toLowerCase().includes(q) ||
        (item.device || "").toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const exportCsv = () => {
    const headers = [
      "ID",
      "Date",
      "Heure",
      "Auteur",
      "Email",
      "Action",
      "Cible",
      "Adresse IP",
      "Appareil / Navigateur",
      "Détails",
    ];
    const rows = filteredItems.map((i) => {
      const d = new Date(i.date);
      return [
        i.id,
        `"${d.toLocaleDateString("fr-FR")}"`,
        `"${d.toLocaleTimeString("fr-FR")}"`,
        `"${i.actor.replace(/"/g, '""')}"`,
        `"${(i.email || "").replace(/"/g, '""')}"`,
        `"${i.action.replace(/"/g, '""')}"`,
        `"${(labels[i.target as Collection] || i.target).replace(/"/g, '""')}"`,
        `"${(i.ip || "").replace(/"/g, '""')}"`,
        `"${(i.device || "").replace(/"/g, '""')}"`,
        `"${(i.details || "").replace(/"/g, '""')}"`,
      ];
    });
    const csvContent =
      "\uFEFF" + [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `opus-journal-audit-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalLogs = items.length;
  const uniqueIps = new Set(items.map((i) => i.ip).filter(Boolean)).size;
  const loginCount = items.filter((i) => i.action.includes("Connexion")).length;
  const lastItem = items[0];

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="admin-eyebrow">OPUS CORP / ADMINISTRATION</p>
          <h1>Journal d’Audit & Traçabilité</h1>
          <p className="admin-lead">
            Traçabilité exhaustive de toutes les activités : qui s’est connecté, quand, depuis quel appareil et les opérations effectuées.
          </p>
        </div>
        <div className="admin-actions">
          <button
            type="button"
            className="admin-btn"
            onClick={loadAudit}
            disabled={busy}
            title="Actualiser la liste"
          >
            <RefreshCw size={15} className={busy ? "spin-icon" : ""} />
            <span>Actualiser</span>
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={exportCsv}
            disabled={!filteredItems.length}
            title="Exporter l'historique en CSV"
          >
            <Download size={15} />
            <span>Exporter CSV</span>
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="admin-notice admin-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Cartes KPI modernes & épurées */}
      <div className="admin-audit-kpi-grid">
        <div className="admin-audit-kpi-card">
          <div className="admin-audit-kpi-top">
            <span className="admin-audit-kpi-icon-box">
              <History size={16} />
            </span>
            <span className="admin-audit-kpi-badge">Traçabilité</span>
          </div>
          <div className="admin-audit-kpi-body">
            <p className="admin-audit-kpi-label">Événements consignés</p>
            <p className="admin-audit-kpi-value">{totalLogs}</p>
          </div>
          <div className="admin-audit-kpi-footer">
            <span className="admin-audit-kpi-dot" />
            <span>150 dernières opérations</span>
          </div>
        </div>

        <div className="admin-audit-kpi-card">
          <div className="admin-audit-kpi-top">
            <span className="admin-audit-kpi-icon-box" style={{ color: "#10b981" }}>
              <Clock size={16} />
            </span>
            <span className="admin-audit-kpi-badge is-live">
              <span className="admin-kpi-pulse" />
              Temps réel
            </span>
          </div>
          <div className="admin-audit-kpi-body">
            <p className="admin-audit-kpi-label">Dernière activité</p>
            <p className="admin-audit-kpi-value is-text">
              {lastItem ? getRelativeTime(lastItem.date) : "—"}
            </p>
          </div>
          <div className="admin-audit-kpi-footer">
            <span className="admin-audit-kpi-dot" style={{ background: "#10b981" }} />
            <span>{lastItem ? `Par ${lastItem.actor}` : "Aucune activité"}</span>
          </div>
        </div>

        <div className="admin-audit-kpi-card">
          <div className="admin-audit-kpi-top">
            <span className="admin-audit-kpi-icon-box" style={{ color: "#f8b133" }}>
              <LogIn size={16} />
            </span>
            <span className="admin-audit-kpi-badge">Sécurité</span>
          </div>
          <div className="admin-audit-kpi-body">
            <p className="admin-audit-kpi-label">Connexions système</p>
            <p className="admin-audit-kpi-value">{loginCount}</p>
          </div>
          <div className="admin-audit-kpi-footer">
            <span className="admin-audit-kpi-dot" style={{ background: "#f8b133" }} />
            <span>Sessions authentifiées</span>
          </div>
        </div>

        <div className="admin-audit-kpi-card">
          <div className="admin-audit-kpi-top">
            <span className="admin-audit-kpi-icon-box" style={{ color: "#8b5cf6" }}>
              <Laptop size={16} />
            </span>
            <span className="admin-audit-kpi-badge">Réseau</span>
          </div>
          <div className="admin-audit-kpi-body">
            <p className="admin-audit-kpi-label">Adresses IP actives</p>
            <p className="admin-audit-kpi-value">{uniqueIps || 1}</p>
          </div>
          <div className="admin-audit-kpi-footer">
            <span className="admin-audit-kpi-dot" style={{ background: "#8b5cf6" }} />
            <span>Origine réseau & matériel</span>
          </div>
        </div>
      </div>

      {/* Cadre Unifié : Filtres, Recherche & Tableau d'audit */}
      <div className="admin-audit-main-card">
        <div className="admin-audit-toolbar">
          <div className="admin-audit-tabs">
            <button
              type="button"
              className={`admin-audit-tab ${filter === "all" ? "is-active" : ""}`}
              onClick={() => setFilter("all")}
            >
              Toutes les activités ({items.length})
            </button>
            <button
              type="button"
              className={`admin-audit-tab ${filter === "auth" ? "is-active" : ""}`}
              onClick={() => setFilter("auth")}
            >
              Connexions & Sessions
            </button>
            <button
              type="button"
              className={`admin-audit-tab ${filter === "content" ? "is-active" : ""}`}
              onClick={() => setFilter("content")}
            >
              Contenus & Pages
            </button>
            <button
              type="button"
              className={`admin-audit-tab ${filter === "media" ? "is-active" : ""}`}
              onClick={() => setFilter("media")}
            >
              Médiathèque
            </button>
            <button
              type="button"
              className={`admin-audit-tab ${filter === "security" ? "is-active" : ""}`}
              onClick={() => setFilter("security")}
            >
              Comptes & Sécurité
            </button>
          </div>

          <div className="admin-audit-search-wrap">
            <Search size={15} className="admin-audit-search-icon" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par auteur, e-mail, IP, action, cible…"
              className="admin-audit-search-input"
            />
            {search && (
              <button
                type="button"
                className="admin-audit-search-clear"
                onClick={() => setSearch("")}
                aria-label="Effacer la recherche"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="admin-table-wrap">
          <table className="admin-table admin-audit-table">
            <thead>
              <tr>
                <th style={{ width: "165px" }}>Quand (Date & Heure)</th>
                <th style={{ width: "220px" }}>Qui (Auteur & Compte)</th>
                <th>Action & Événement réalisé</th>
                <th style={{ width: "240px" }}>Où (Origine & Appareil)</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const badge = getActionBadge(item.action);
                const BadgeIcon = badge.Icon;
                const isMobile =
                  (item.device || "").includes("iOS") ||
                  (item.device || "").includes("Android");

                return (
                  <tr key={item.id} className="admin-audit-row">
                    {/* QUAND */}
                    <td>
                      <div className="admin-audit-when">
                        <span className="admin-audit-rel-time">
                          {getRelativeTime(item.date)}
                        </span>
                        <span className="admin-audit-full-time">
                          {new Date(item.date).toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>

                    {/* QUI */}
                    <td>
                      <div className="admin-audit-who">
                        <div
                          className="admin-avatar"
                          style={{
                            width: 32,
                            height: 32,
                            fontSize: 12,
                            background: "#1e293b",
                            color: "#f8fafc",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
                          }}
                        >
                          {item.actor.slice(0, 1).toUpperCase()}
                        </div>
                        <div className="admin-audit-who-info">
                          <p className="admin-audit-who-name">{item.actor}</p>
                          {item.email ? (
                            <p className="admin-audit-who-email">{item.email}</p>
                          ) : (
                            <span className="admin-audit-who-role">Système</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* À FAIRE QUOI */}
                    <td>
                      <div className="admin-audit-what">
                        <div className="admin-audit-action-line">
                          <span
                            className="admin-audit-badge"
                            style={{
                              background: badge.bg,
                              color: badge.color,
                              borderColor: badge.border,
                            }}
                          >
                            <BadgeIcon size={13} />
                            <span>{item.action}</span>
                          </span>
                          <span className="admin-audit-target-pill">
                            {labels[item.target as Collection] || item.target}
                          </span>
                        </div>
                        {item.details && (
                          <p className="admin-audit-details">{item.details}</p>
                        )}
                      </div>
                    </td>

                    {/* OÙ */}
                    <td>
                      <div className="admin-audit-where">
                        <button
                          type="button"
                          className="admin-audit-ip-chip"
                          onClick={() => copyToClipboard(item.ip || "127.0.0.1")}
                          title="Cliquer pour copier l'IP"
                        >
                          <span className="admin-audit-ip-dot" />
                          <span>{item.ip || "127.0.0.1"}</span>
                          {copiedIp === (item.ip || "127.0.0.1") ? (
                            <CheckCircle2 size={12} style={{ color: "#10b981" }} />
                          ) : (
                            <Copy size={11} className="admin-audit-ip-copy" />
                          )}
                        </button>
                        <div className="admin-audit-device-chip">
                          {isMobile ? (
                            <Smartphone size={12} className="admin-muted" />
                          ) : (
                            <Laptop size={12} className="admin-muted" />
                          )}
                          <span>{item.device || "Navigateur · Bureau"}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!filteredItems.length && (
          <div className="admin-audit-empty-state">
            <History size={36} className="admin-muted" />
            <p className="admin-audit-empty-title">
              {search
                ? "Aucun événement ne correspond à votre recherche"
                : "Aucune opération enregistrée pour le moment"}
            </p>
            <p className="admin-muted" style={{ fontSize: 13 }}>
              {search
                ? "Essayez d’élargir vos termes de recherche ou réinitialisez les filtres."
                : "Toutes les connexions, modifications et suppressions apparaîtront ici automatiquement."}
            </p>
            {search && (
              <button
                type="button"
                className="admin-btn"
                onClick={() => setSearch("")}
                style={{ marginTop: 12 }}
              >
                Réinitialiser la recherche
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
