"use client";

import React, { useEffect, useRef, useCallback } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Quote from "@editorjs/quote";
// @ts-ignore
import Marker from "@editorjs/marker";
// @ts-ignore
import Delimiter from "@editorjs/delimiter";
// @ts-ignore
import InlineCode from "@editorjs/inline-code";
// @ts-ignore
import LinkTool from "@editorjs/link";
// @ts-ignore
import Embed from "@editorjs/embed";
// @ts-ignore
import Paragraph from "@editorjs/paragraph";
// @ts-ignore
import Table from "@editorjs/table";
// @ts-ignore
import Warning from "@editorjs/warning";
// @ts-ignore
import Checklist from "@editorjs/checklist";
// @ts-ignore
import CodeTool from "@editorjs/code";

import { toast } from "sonner";
import "./editorjs.css";

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  holder?: string;
}

export function WysiwygEditor({
  value,
  onChange,
  placeholder,
  className,
  holder = "editorjs-container",
}: WysiwygEditorProps) {
  const ejInstance = useRef<EditorJS | null>(null);
  const isReady = useRef(false);

  const getInitialData = useCallback((): OutputData | undefined => {
    if (!value) return undefined;
    try {
      const parsed = JSON.parse(value);
      if (parsed.blocks) return parsed;
    } catch (e) {
      // Not JSON — wrap plain text
    }
    return {
      time: Date.now(),
      blocks: [{ type: "paragraph", data: { text: value } }],
      version: "2.30.0",
    };
  }, [value]);

  useEffect(() => {
    if (typeof window === "undefined" || isReady.current) return;

    const initEditor = async () => {
      try {
        const editor = new EditorJS({
          holder,
          placeholder: placeholder || "Commencez à rédiger votre article ici...",
          initialBlock: "paragraph",
          data: getInitialData(),
          inlineToolbar: ["bold", "italic", "marker", "inlineCode", "link"],
          tools: {
            // ─── Headings ───────────────────────────────────────────────────
            header: {
              class: Header as any,
              config: { levels: [2, 3, 4], defaultLevel: 2 },
              shortcut: "CMD+SHIFT+H",
              inlineToolbar: false,
            },
            // ─── Text ───────────────────────────────────────────────────────
            paragraph: {
              class: Paragraph as any,
              inlineToolbar: true,
            },
            // ─── Lists ──────────────────────────────────────────────────────
            list: {
              class: List,
              inlineToolbar: true,
              config: { defaultStyle: "unordered" },
              shortcut: "CMD+SHIFT+L",
            },
            checklist: {
              class: Checklist,
              inlineToolbar: true,
            },
            // ─── Media ──────────────────────────────────────────────────────
            image: {
              class: ImageTool,
              config: {
                uploader: {
                  async uploadByFile(file: File) {
                    const formData = new FormData();
                    formData.append("file", file);
                    try {
                      const res = await fetch("/api/upload", {
                        method: "POST",
                        body: formData,
                      });
                      if (!res.ok) throw new Error("Upload failed");
                      const data = await res.json();
                      return { success: 1, file: { url: data.url } };
                    } catch {
                      toast.error("Erreur lors de l'upload de l'image");
                      return { success: 0, file: { url: "" } };
                    }
                  },
                  async uploadByUrl(url: string) {
                    return { success: 1, file: { url } };
                  },
                },
              },
            },
            // ─── Rich blocks ────────────────────────────────────────────────
            quote: {
              class: Quote,
              inlineToolbar: true,
              config: { quotePlaceholder: "Saisir la citation...", captionPlaceholder: "Auteur" },
              shortcut: "CMD+SHIFT+O",
            },
            warning: {
              class: Warning,
              inlineToolbar: true,
              config: { titlePlaceholder: "Titre", messagePlaceholder: "Message important..." },
            },
            table: {
              class: Table as any,
              inlineToolbar: true,
              config: { rows: 2, cols: 3, withHeadings: true },
            },
            code: {
              class: CodeTool as any,
            },
            // ─── Inline tools ────────────────────────────────────────────────
            marker: {
              class: Marker,
              shortcut: "CMD+SHIFT+M",
            },
            inlineCode: {
              class: InlineCode,
              shortcut: "CMD+SHIFT+C",
            },
            delimiter: Delimiter,
            // ─── Embeds ──────────────────────────────────────────────────────
            linkTool: {
              class: LinkTool,
              config: { endpoint: "/api/link-meta" },
            },
            embed: {
              class: Embed,
              inlineToolbar: false,
              config: {
                services: {
                  youtube: true,
                  twitter: true,
                  instagram: true,
                  vimeo: true,
                },
              },
            },
          },
          onChange: async (api) => {
            const data = await api.saver.save();
            onChange(JSON.stringify(data));
          },
          autofocus: false,
          onReady: () => {
            isReady.current = true;
          },
        });

        ejInstance.current = editor;
      } catch (err) {
        console.error("Failed to initialize Editor.js", err);
      }
    };

    initEditor();

    return () => {
      // Intentionally not destroying: causes issues in strict mode
    };
  }, [holder, placeholder, getInitialData, onChange]);

  return (
    <div className={`flex flex-col ${className || ""}`}>
      {/* Toolbar hint */}
      <div className="px-4 py-2 bg-muted/30 border-b border-border/30 flex items-center gap-3 flex-wrap text-[10px] text-muted-foreground/60 font-mono">
        <span className="font-semibold text-muted-foreground/80">Outils :</span>
        <span>Tab → nouvelle ligne</span>
        <span>·</span>
        <span>/ → insérer un bloc</span>
        <span>·</span>
        <span>Sélectionner → mise en forme</span>
        <span>·</span>
        <span>⌘+Z → annuler</span>
      </div>
      {/* Editor area */}
      <div className="flex-1 overflow-y-auto cursor-text p-4 md:p-8 min-h-[400px]">
        <div
          id={holder}
          className="w-full prose prose-sm md:prose-base dark:prose-invert max-w-none focus:outline-none"
        />
      </div>
    </div>
  );
}
