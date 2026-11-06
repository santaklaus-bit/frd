"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon, Loader2, X, UploadCloud, FileText, Video } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ImageCropper } from "./image-cropper";

interface MediaUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  accept?: string;
  label?: string;
  className?: string;
  aspect?: number;
}

export function MediaUpload({
  value,
  onChange,
  onRemove,
  accept = "image/*,video/*,application/pdf",
  label = "Fichier",
  className,
  aspect = 1,
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith("image/") && !file.type.includes("svg")) {
      const reader = new FileReader();
      reader.onload = () => {
        setOriginalImage(reader.result as string);
        setCropperOpen(true);
      };
      reader.readAsDataURL(file);
    } else {
      await performUpload(file);
    }
  };

  const skipCrop = async () => {
    const fileInput = document.getElementById(`upload-${label}`) as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (file) {
      setCropperOpen(false);
      setOriginalImage(null);
      await performUpload(file);
    }
  };

  const performUpload = async (file: File | Blob) => {
    setUploading(true);
    const formData = new FormData();
    // Keep the real filename: forcing "upload.jpg" stored PDFs under a .jpg
    // name, so they were served as images and could not be previewed.
    // Cropped images arrive as a plain Blob and are genuinely JPEG.
    const filename = file instanceof File ? file.name : "upload.jpg";
    formData.append("file", file, filename);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      onChange(data.url);
      toast.success("Fichier mis en ligne !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'envoi du fichier.");
    } finally {
      setUploading(false);
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setCropperOpen(false);
    await performUpload(croppedBlob);
  };

  const isImage = value?.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i);
  const isVideo = value?.match(/\.(mp4|webm|ogg)$/i);
  const isPdf = value?.match(/\.pdf$/i);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
          {label}
        </label>
        {value && onRemove && (
          <button
            onClick={onRemove}
            type="button"
            className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
          >
            Supprimer
          </button>
        )}
      </div>

      <div
        className={cn(
          "relative group rounded-2xl border-2 border-dashed border-border/40 bg-muted/20 transition-all duration-200 overflow-hidden min-h-[140px] flex flex-col items-center justify-center",
          !value && "hover:border-primary/50 hover:bg-muted/30",
          value && "border-solid border-border/60"
        )}
      >
        {value ? (
          <div className="w-full h-full min-h-[140px] flex items-center justify-center p-4">
            {isImage ? (
              <img
                src={value}
                alt="Preview"
                className="max-h-40 w-auto rounded-lg object-contain shadow-sm"
              />
            ) : isVideo ? (
              <video
                src={value}
                className="max-h-40 w-auto rounded-lg shadow-sm"
                controls
              />
            ) : isPdf ? (
              <div className="flex flex-col items-center gap-2">
                <FileText className="h-10 w-10 text-primary" />
                <span className="text-xs font-medium truncate max-w-[200px]">
                  {value.split("/").pop()}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <UploadCloud className="h-8 w-8 text-muted-foreground/40" />
                <span className="text-xs font-medium">{value}</span>
              </div>
            )}

            <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full bg-background"
                onClick={() => document.getElementById(`upload-${label}`)?.click()}
              >
                Remplacer
              </Button>
              {onRemove && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="rounded-full"
                  onClick={onRemove}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-3 p-8 cursor-pointer"
            onClick={() => document.getElementById(`upload-${label}`)?.click()}
          >
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            ) : (
              <>
                <div className="p-3 rounded-full bg-background border border-border/50 shadow-sm transition-transform group-hover:scale-110">
                  <UploadCloud className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-foreground">
                    Cliquez pour uploader
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Image, Video ou PDF
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        <Input
          id={`upload-${label}`}
          type="file"
          accept={accept}
          onChange={onFileSelect}
          className="hidden"
          disabled={uploading}
        />
      </div>

      {originalImage && (
        <ImageCropper
          image={originalImage}
          open={cropperOpen}
          aspect={aspect}
          onClose={() => {
            setCropperOpen(false);
            setOriginalImage(null);
          }}
          onCropComplete={handleCropComplete}
          onSkip={skipCrop}
        />
      )}
    </div>
  );
}
