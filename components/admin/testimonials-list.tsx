"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveTestimonial, deleteTestimonial } from "@/app/actions/testimonials";
import { Plus, Trash2, Edit2, Save, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Testimonial {
  id: number;
  name: { fr: string; en: string };
  role: { fr: string; en: string };
  content: { fr: string; en: string };
  image: string | null;
  certified: boolean;
  rating: number;
  order: number;
}

export default function TestimonialsList({ initialData }: { initialData: Testimonial[] }) {
  const [testimonials, setTestimonials] = useState(initialData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Testimonial> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setEditData({ ...testimonial });
  };

  const handleSave = async () => {
    if (!editData) return;

    setLoading(true);
    try {
      await saveTestimonial(editingId, editData as any);
      toast.success("Testimonial saved!");
      setEditingId(null);
      setEditData(null);
      // Refresh the list
      window.location.reload();
    } catch (err) {
      toast.error("Error saving testimonial");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this testimonial?")) return;

    setLoading(true);
    try {
      await deleteTestimonial(id);
      toast.success("Testimonial deleted!");
      setTestimonials(testimonials.filter(t => t.id !== id));
    } catch (err) {
      toast.error("Error deleting testimonial");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    const newId = Math.max(...testimonials.map(t => t.id), 0) + 1;
    setEditingId(newId);
    setEditData({
      id: newId,
      name: { fr: "", en: "" },
      role: { fr: "", en: "" },
      content: { fr: "", en: "" },
      image: null,
      certified: false,
      rating: 5,
      order: testimonials.length + 1,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-6 border-b border-border/50">
        <div>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage client testimonials and social proof
          </p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      {editingId !== null && editData && (
        <div className="p-6 rounded-xl border border-primary/40 bg-primary/5 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">
              {editingId === Math.max(...testimonials.map(t => t.id), 0) + 1 ? "New Testimonial" : "Edit Testimonial"}
            </h3>
            <button
              onClick={() => {
                setEditingId(null);
                setEditData(null);
              }}
              className="p-1 hover:bg-muted rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                Name (FR)
              </label>
              <Input
                value={editData.name?.fr || ""}
                onChange={(e) =>
                  setEditData({ ...editData, name: { ...editData.name!, fr: e.target.value } })
                }
                placeholder="Nom en français"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                Name (EN)
              </label>
              <Input
                value={editData.name?.en || ""}
                onChange={(e) =>
                  setEditData({ ...editData, name: { ...editData.name!, en: e.target.value } })
                }
                placeholder="Name in English"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                Role (FR)
              </label>
              <Input
                value={editData.role?.fr || ""}
                onChange={(e) =>
                  setEditData({ ...editData, role: { ...editData.role!, fr: e.target.value } })
                }
                placeholder="Rôle en français"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                Role (EN)
              </label>
              <Input
                value={editData.role?.en || ""}
                onChange={(e) =>
                  setEditData({ ...editData, role: { ...editData.role!, en: e.target.value } })
                }
                placeholder="Role in English"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                Rating (1-5)
              </label>
              <Input
                type="number"
                min="1"
                max="5"
                value={editData.rating || 5}
                onChange={(e) =>
                  setEditData({ ...editData, rating: parseInt(e.target.value) })
                }
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                Order
              </label>
              <Input
                type="number"
                value={editData.order || 0}
                onChange={(e) =>
                  setEditData({ ...editData, order: parseInt(e.target.value) })
                }
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-2 block">
              Content (FR)
            </label>
            <Textarea
              value={editData.content?.fr || ""}
              onChange={(e) =>
                setEditData({ ...editData, content: { ...editData.content!, fr: e.target.value } })
              }
              placeholder="Contenu en français"
              rows={3}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-2 block">
              Content (EN)
            </label>
            <Textarea
              value={editData.content?.en || ""}
              onChange={(e) =>
                setEditData({ ...editData, content: { ...editData.content!, en: e.target.value } })
              }
              placeholder="Content in English"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="certified"
              checked={editData.certified || false}
              onChange={(e) =>
                setEditData({ ...editData, certified: e.target.checked })
              }
              className="rounded"
            />
            <label htmlFor="certified" className="text-sm font-medium">
              Mark as certified ✓
            </label>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={loading} className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditingId(null);
                setEditData(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="p-4 rounded-xl border border-border/40 bg-card hover:border-border/60 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground">{testimonial.name.fr}</h3>
                <p className="text-sm text-muted-foreground">{testimonial.role.fr}</p>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  "{testimonial.content.fr}"
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">⭐ {testimonial.rating}/5</span>
                  {testimonial.certified && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-blue-500/15 rounded-full text-xs text-blue-600">
                      <CheckCircle2 className="h-3 w-3" />
                      Certified
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(testimonial)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                  onClick={() => handleDelete(testimonial.id)}
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
