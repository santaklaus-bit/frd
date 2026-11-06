"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ImagePlus,
  Upload,
  X,
  Film,
  Trash2,
  Search,
  Check,
  Copy,
  ExternalLink,
  Eye,
  AlertCircle,
  ImageIcon,
} from "lucide-react";
import { adminApi } from "./api";
import type { MediaItem } from "@/lib/cms/media";

export function MediaLibrary({
  onSelect,
  canDelete = true,
  kind,
}: {
  onSelect?: (item: MediaItem) => void;
  canDelete?: boolean;
  kind?: "image" | "video";
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "image" | "video" | "unused" | "used"
  >("all");
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "name" | "size">("recent");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [alt, setAlt] = useState("");
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  async function refresh() {
    try {
      setItems((await adminApi<{ items: MediaItem[] }>("media")).items);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const counts = useMemo(() => {
    return {
      all: items.length,
      image: items.filter((i) => i.mime.startsWith("image/")).length,
      video: items.filter((i) => i.mime.startsWith("video/")).length,
      unused: items.filter((i) => !i.inUse).length,
      used: items.filter((i) => i.inUse).length,
    };
  }, [items]);

  const filteredList = useMemo(() => {
    let result = items.filter((item) => {
      // Kind restriction
      if (kind && !item.mime.startsWith(`${kind}/`)) return false;
      // Tab filter
      if (activeTab === "image" && !item.mime.startsWith("image/")) return false;
      if (activeTab === "video" && !item.mime.startsWith("video/")) return false;
      if (activeTab === "unused" && item.inUse) return false;
      if (activeTab === "used" && !item.inUse) return false;
      // Search filter
      const q = search.toLowerCase().trim();
      if (q && !`${item.name} ${item.alt} ${item.url}`.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "recent") return b.created_at.localeCompare(a.created_at);
      if (sortBy === "oldest") return a.created_at.localeCompare(b.created_at);
      if (sortBy === "name") return a.name.localeCompare(b.name, "fr", { numeric: true });
      if (sortBy === "size") return b.size - a.size;
      return 0;
    });

    return result;
  }, [items, kind, activeTab, search, sortBy]);

  async function upload(file: File) {
    setError("");
    setBusy(true);
    try {
      if (file.size > 50 * 1024 * 1024)
        throw new Error("Le fichier dépasse la limite de 50 Mo.");
      const data = new FormData();
      data.set("file", file);
      data.set("alt", alt);
      const { item } = await adminApi<{ item: MediaItem }>(
        "media",
        "POST",
        data,
      );
      setItems((old) => [item, ...old]);
      setAlt("");
      if (onSelect && (!kind || item.mime.startsWith(`${kind}/`))) {
        onSelect(item);
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  async function remove(item: MediaItem) {
    if (item.inUse) {
      window.alert(
        `Impossible de supprimer « ${item.name} » car ce média est actuellement utilisé sur le site (fiche événement, article ou page).\n\nPour pouvoir le retirer, remplacez-le d'abord dans les contenus concernés.`,
      );
      return;
    }

    const confirmed = window.confirm(
      `Confirmer la suppression définitive de « ${item.name} » ?\n\nCe média sera retiré de la médiathèque et ne sera plus accessible.`,
    );
    if (!confirmed) return;

    setBusy(true);
    setError("");
    try {
      // Use URL encoding or path format
      const targetParam = item.id.startsWith("/") ? item.id.slice(1) : item.id;
      await adminApi(`media/${targetParam}`, "DELETE");
      setItems((old) => old.filter((val) => val.id !== item.id && val.url !== item.url));
      if (selected?.id === item.id) setSelected(null);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function copyUrl(item: MediaItem) {
    const fullUrl = window.location.origin + item.url;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2200);
    }).catch(() => {
      prompt("Copiez l'URL du média :", fullUrl);
    });
  }

  return (
    <div className="admin-stack">
      {error && (
        <div role="alert" className="admin-notice admin-error">
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            style={{ marginLeft: "auto", background: "none", border: 0, cursor: "pointer" }}
            aria-label="Fermer l'alerte"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Zone de téléversement moderne avec drag & drop */}
      <div
        className={`admin-upload-zone ${isDragging ? "is-dragover" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (!busy && e.dataTransfer.files[0]) {
            void upload(e.dataTransfer.files[0]);
          }
        }}
      >
        <div className="admin-upload-icon-circle">
          <Upload size={22} />
        </div>
        <p className="admin-upload-title">
          Glissez-déposez une photo ou une vidéo ici, ou{" "}
          <button
            type="button"
            className="admin-link-btn"
            onClick={() => input.current?.click()}
          >
            parcourez vos fichiers
          </button>
        </p>
        <p className="admin-muted" style={{ fontSize: 12, margin: "4px 0 16px" }}>
          Images (WebP, JPEG, PNG, GIF) et vidéos (MP4, WebM) jusqu’à 50 Mo. Les images sont automatiquement optimisées en WebP.
        </p>

        <div className="admin-actions" style={{ justifyContent: "center", width: "100%", maxWidth: 540 }}>
          <input
            aria-label="Description facultative de l’image pour l’accessibilité"
            placeholder="Description facultative (texte alternatif pour le SEO)…"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            style={{ flex: 1, minWidth: 200 }}
          />
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            disabled={busy}
            onClick={() => input.current?.click()}
          >
            <Upload size={14} />
            {busy ? "Envoi en cours…" : "Sélectionner un fichier"}
          </button>
        </div>

        <input
          ref={input}
          hidden
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
          onChange={(e) => {
            if (e.target.files?.[0]) void upload(e.target.files[0]);
          }}
        />
      </div>

      {/* Barre d'onglets et filtres */}
      <div className="admin-media-header">
        <div className="admin-media-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "all"}
            className={`admin-media-tab ${activeTab === "all" ? "is-active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            Tous les fichiers
            <span className="admin-tab-count">{counts.all}</span>
          </button>
          {!kind && (
            <>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "image"}
                className={`admin-media-tab ${activeTab === "image" ? "is-active" : ""}`}
                onClick={() => setActiveTab("image")}
              >
                Photos
                <span className="admin-tab-count">{counts.image}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "video"}
                className={`admin-media-tab ${activeTab === "video" ? "is-active" : ""}`}
                onClick={() => setActiveTab("video")}
              >
                Vidéos
                <span className="admin-tab-count">{counts.video}</span>
              </button>
            </>
          )}
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "unused"}
            className={`admin-media-tab ${activeTab === "unused" ? "is-active" : ""}`}
            onClick={() => setActiveTab("unused")}
          >
            Non utilisés
            <span className="admin-tab-count admin-tab-count-muted">{counts.unused}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "used"}
            className={`admin-media-tab ${activeTab === "used" ? "is-active" : ""}`}
            onClick={() => setActiveTab("used")}
          >
            En ligne
            <span className="admin-tab-count admin-tab-count-active">{counts.used}</span>
          </button>
        </div>

        <div className="admin-media-filters">
          <div className="admin-search-wrap">
            <Search size={14} className="admin-search-icon" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, description…"
              aria-label="Rechercher un média"
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

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            aria-label="Trier les médias"
            className="admin-sort-select"
          >
            <option value="recent">Plus récents</option>
            <option value="oldest">Plus anciens</option>
            <option value="name">Nom (A-Z)</option>
            <option value="size">Poids décroissant</option>
          </select>
        </div>
      </div>

      {/* Grille des médias */}
      {loading ? (
        <p role="status" className="admin-empty">Chargement de la médiathèque…</p>
      ) : filteredList.length === 0 ? (
        <div className="admin-card admin-empty-box">
          <ImageIcon size={36} style={{ color: "#a0a8be", margin: "0 auto 12px" }} />
          <p style={{ fontWeight: 600, fontSize: 16 }}>Aucun média ne correspond à vos critères</p>
          <p className="admin-muted" style={{ fontSize: 13, marginTop: 4 }}>
            {search ? "Essayez d'ajuster votre recherche." : "Ajoutez vos premiers visuels via la zone ci-dessus."}
          </p>
          {search && (
            <button
              type="button"
              className="admin-btn admin-btn-small"
              style={{ marginTop: 14 }}
              onClick={() => setSearch("")}
            >
              Réinitialiser la recherche
            </button>
          )}
        </div>
      ) : (
        <div className="admin-media-grid-pro">
          {filteredList.map((item) => (
            <div
              className={`admin-media-card ${selected?.id === item.id ? "is-selected" : ""}`}
              key={item.id}
            >
              {/* Vignette avec survol d'actions rapides */}
              <div className="admin-media-thumb-wrap">
                {item.mime.startsWith("image/") ? (
                  <img
                    className="admin-media-thumb"
                    src={item.url}
                    alt={item.alt || item.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="admin-media-thumb admin-media-thumb-video">
                    <Film size={34} />
                  </div>
                )}

                {/* Badge d'utilisation en haut à gauche */}
                <span
                  className={`admin-media-badge ${item.inUse ? "is-used" : "is-unused"}`}
                  title={item.inUse ? "Ce média est actuellement utilisé sur le site" : "Média libre (non utilisé)"}
                >
                  <span className="admin-media-badge-dot" />
                  {item.inUse ? "En ligne" : "Libre"}
                </span>

                {/* Badge du format en haut à droite */}
                <span className="admin-media-format-badge">
                  {item.mime.split("/")[1].toUpperCase()}
                </span>

                {/* Barre d'actions au survol */}
                <div className="admin-media-overlay-actions">
                  <button
                    type="button"
                    className="admin-icon-btn"
                    title="Voir les détails et prévisualiser"
                    aria-label={`Détails de ${item.name}`}
                    onClick={() => setSelected(item)}
                  >
                    <Eye size={15} />
                  </button>

                  <button
                    type="button"
                    className="admin-icon-btn"
                    title={copiedId === item.id ? "Lien copié !" : "Copier le lien public"}
                    aria-label="Copier le lien"
                    onClick={() => copyUrl(item)}
                  >
                    {copiedId === item.id ? <Check size={15} style={{ color: "#22c55e" }} /> : <Copy size={15} />}
                  </button>

                  {canDelete && (
                    <button
                      type="button"
                      className="admin-icon-btn admin-icon-btn-danger"
                      title={item.inUse ? "Média en cours d'utilisation sur le site" : "Supprimer ce média"}
                      aria-label={`Supprimer ${item.name}`}
                      disabled={busy}
                      onClick={() => void remove(item)}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              {/* Informations sous la vignette */}
              <div className="admin-media-card-body">
                <button
                  type="button"
                  className="admin-media-name-btn"
                  title={item.name}
                  onClick={() => (onSelect ? onSelect(item) : setSelected(item))}
                >
                  {item.name}
                </button>

                <div className="admin-media-card-meta">
                  <span>{(item.size / 1024 / 1024).toFixed(2)} Mo</span>
                  {item.alt ? (
                    <span className="admin-media-alt-indicator" title={`Description : ${item.alt}`}>
                      Alt ✓
                    </span>
                  ) : (
                    <span className="admin-media-alt-indicator-empty" title="Aucune description alt renseignée">
                      Sans alt
                    </span>
                  )}
                </div>

                {onSelect && (
                  <button
                    type="button"
                    className="admin-btn admin-btn-small admin-btn-select-media"
                    onClick={() => onSelect(item)}
                  >
                    Choisir ce média
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de détail et édition du média */}
      {selected && (
        <div className="admin-modal-backdrop" onClick={() => setSelected(null)}>
          <div
            className="admin-modal admin-media-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-label={selected.name}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-heading" style={{ marginBottom: 20 }}>
              <div>
                <h2>{selected.name}</h2>
                <p className="admin-muted" style={{ fontSize: 12 }}>
                  Ajouté le {new Date(selected.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <button
                className="admin-btn"
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Fermer la vue détaillée"
              >
                <X size={16} />
              </button>
            </div>

            <div className="admin-media-modal-content">
              {/* Côté gauche : aperçu grand format */}
              <div className="admin-media-viewer-pane">
                {selected.mime.startsWith("image/") ? (
                  <img
                    src={selected.url}
                    alt={selected.alt || selected.name}
                    className="admin-media-modal-image"
                  />
                ) : (
                  <video
                    src={selected.url}
                    controls
                    className="admin-media-modal-video"
                  />
                )}
                <div className="admin-actions" style={{ justifyContent: "center", marginTop: 12 }}>
                  <a
                    href={selected.url}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-btn admin-btn-small"
                  >
                    <ExternalLink size={13} />
                    Ouvrir l’original en plein écran
                  </a>
                  <button
                    type="button"
                    className="admin-btn admin-btn-small"
                    onClick={() => copyUrl(selected)}
                  >
                    {copiedId === selected.id ? (
                      <>
                        <Check size={13} style={{ color: "#22c55e" }} />
                        Lien public copié !
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        Copier le lien public
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Côté droit : métadonnées et actions */}
              <div className="admin-media-meta-pane">
                <div className="admin-card" style={{ padding: 18, background: "#fafaf8" }}>
                  <h3 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>
                    Informations du fichier
                  </h3>
                  <div className="admin-meta-list">
                    <div>
                      <span className="admin-muted">URL publique :</span>
                      <code style={{ fontSize: 11, background: "#fff", padding: "2px 6px", borderRadius: 4, display: "block", marginTop: 2, overflowWrap: "anywhere" }}>
                        {selected.url}
                      </code>
                    </div>
                    <div>
                      <span className="admin-muted">Poids du fichier :</span>
                      <strong style={{ marginLeft: 8 }}>{(selected.size / 1024 / 1024).toFixed(2)} Mo</strong>
                    </div>
                    <div>
                      <span className="admin-muted">Format MIME :</span>
                      <strong style={{ marginLeft: 8 }}>{selected.mime}</strong>
                    </div>
                    <div>
                      <span className="admin-muted">Statut sur le site :</span>
                      <span
                        className={`admin-media-badge ${selected.inUse ? "is-used" : "is-unused"}`}
                        style={{ display: "inline-flex", marginLeft: 8 }}
                      >
                        <span className="admin-media-badge-dot" />
                        {selected.inUse ? "Utilisé sur le site" : "Non utilisé (peut être supprimé)"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Champ texte alternatif pour le SEO */}
                <label className="admin-field" style={{ marginTop: 16 }}>
                  <span>Texte alternatif (Accessibilité & SEO)</span>
                  <textarea
                    rows={3}
                    placeholder="Décrivez précisément ce visuel pour les moteurs de recherche et lecteurs d’écran…"
                    value={selected.alt}
                    onChange={(e) =>
                      setSelected({ ...selected, alt: e.target.value })
                    }
                  />
                  <small>Important pour le référencement naturel et les personnes malvoyantes.</small>
                </label>

                <div className="admin-actions" style={{ marginTop: 12 }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn-primary"
                    disabled={busy}
                    onClick={async () => {
                      setBusy(true);
                      try {
                        const targetParam = selected.id.startsWith("/") ? selected.id.slice(1) : selected.id;
                        await adminApi(`media/${targetParam}`, "PATCH", {
                          alt: selected.alt,
                        });
                        await refresh();
                        window.alert("Description du média enregistrée avec succès.");
                      } catch (error) {
                        setError((error as Error).message);
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    <Check size={14} />
                    Enregistrer la description
                  </button>

                  {onSelect && (
                    <button
                      type="button"
                      className="admin-btn"
                      onClick={() => {
                        onSelect(selected);
                        setSelected(null);
                      }}
                    >
                      Insérer ce média
                    </button>
                  )}
                </div>

                {/* Zone de suppression avec confirmation */}
                <div className="admin-media-danger-zone">
                  <h4 style={{ fontSize: 13, color: "#b91c1c", marginBottom: 6 }}>
                    Zone de suppression
                  </h4>
                  {selected.inUse ? (
                    <p style={{ fontSize: 12, color: "#854d0e", background: "#fef9c3", padding: "8px 12px", borderRadius: 6, margin: 0 }}>
                      ⚠️ Ce média est actuellement utilisé sur le site. Vous devez d’abord le remplacer dans la fiche ou la page concernée avant de pouvoir le supprimer.
                    </p>
                  ) : (
                    <p className="admin-muted" style={{ fontSize: 12, marginBottom: 10 }}>
                      Ce fichier n’est actuellement lié à aucun contenu publié ou brouillon. Vous pouvez le retirer définitivement.
                    </p>
                  )}

                  {canDelete && (
                    <button
                      type="button"
                      disabled={busy || selected.inUse}
                      className="admin-btn admin-btn-danger"
                      style={{ marginTop: 10, width: "100%" }}
                      onClick={() => void remove(selected)}
                    >
                      <Trash2 size={14} /> Supprimer définitivement ce média
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function MediaPicker({
  value,
  onChange,
  kind = "image",
  label = "Image",
  onAlt,
}: {
  value: string;
  onChange: (url: string) => void;
  kind?: "image" | "video";
  label?: string;
  onAlt?: (alt: string) => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);

  return (
    <div className="admin-field">
      <span>{label}</span>
      <div className="admin-picker-box">
        {value ? (
          <div className="admin-picker-preview-wrap">
            {kind === "image" ? (
              <img src={value} alt="Aperçu de la sélection" className="admin-picker-preview-img" />
            ) : (
              <video
                src={value}
                controls
                className="admin-picker-preview-video"
              />
            )}
            <div className="admin-picker-actions">
              <button
                type="button"
                className="admin-btn admin-btn-small"
                onClick={() => setOpen(true)}
              >
                <ImagePlus size={14} />
                Remplacer le média
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-small admin-btn-danger"
                onClick={() => onChange("")}
                title="Retirer ce média de la fiche"
              >
                <Trash2 size={14} />
                Retirer
              </button>
            </div>
            <p className="admin-muted" style={{ fontSize: 11, marginTop: 4, overflowWrap: "anywhere" }}>
              {value}
            </p>
          </div>
        ) : (
          <div className="admin-picker-empty" onClick={() => setOpen(true)}>
            <div className="admin-picker-empty-icon">
              <ImagePlus size={22} />
            </div>
            <p style={{ fontWeight: 500, fontSize: 13 }}>Aucun visuel sélectionné</p>
            <p className="admin-muted" style={{ fontSize: 11, marginTop: 2 }}>
              Cliquez pour parcourir la médiathèque ou téléverser
            </p>
            <button
              type="button"
              className="admin-btn admin-btn-small admin-btn-primary"
              style={{ marginTop: 8 }}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
            >
              Choisir un fichier
            </button>
          </div>
        )}
      </div>

      {open && (
        <div className="admin-modal-backdrop" onClick={() => setOpen(false)}>
          <div
            className="admin-modal admin-media-picker-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Choisir un média"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-heading">
              <div>
                <h2>Sélectionner un média</h2>
                <p className="admin-muted">
                  Choisissez une photo ou vidéo existante, ou téléversez un nouveau fichier.
                </p>
              </div>
              <button
                type="button"
                className="admin-btn"
                aria-label="Fermer"
                onClick={() => setOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            <MediaLibrary
              kind={kind}
              canDelete={true}
              onSelect={(item) => {
                onChange(item.url);
                if (onAlt) onAlt(item.alt);
                setOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
