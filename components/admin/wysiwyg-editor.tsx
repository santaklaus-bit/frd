"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
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

import { toast } from "sonner";
import "./editorjs.css"; // Custom tweaks for dark mode

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  holder?: string; // Optional unique ID for the editor container
}

export function WysiwygEditor({
  value,
  onChange,
  placeholder,
  className,
  holder = "editorjs-container",
}: WysiwygEditorProps) {
  const ejInstance = useRef<EditorJS | null>(null);

  // Safe initial data parsing
  const getInitialData = useCallback(() => {
    if (!value) return undefined;
    try {
      const parsed = JSON.parse(value);
      if (parsed.blocks) {
        return parsed;
      }
    } catch (e) {
      // Not JSON
    }
    // Fallback: raw text as a paragraph
    return {
      time: new Date().getTime(),
      blocks: [
        {
          type: "paragraph",
          data: {
            text: value,
          },
        },
      ],
      version: "2.30.0",
    };
  }, [value]);

  const isReady = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !isReady.current) {
      const initEditor = async () => {
        try {
          const editor = new EditorJS({
            holder: holder,
            placeholder: placeholder || "Commencez à rédiger...",
            initialBlock: "paragraph",
            data: getInitialData(),
            tools: {
              header: {
                class: Header as any, // eslint-disable-line @typescript-eslint/no-explicit-any
                config: {
                  levels: [1, 2, 3, 4],
                  defaultLevel: 2,
                },
                inlineToolbar: true,
              },
              paragraph: {
                class: Paragraph as any, // eslint-disable-line @typescript-eslint/no-explicit-any
                inlineToolbar: true,
              },
              list: {
                class: List,
                inlineToolbar: true,
              },
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
                        return {
                          success: 1,
                          file: {
                            url: data.url,
                          },
                        };
                      } catch (err) {
                        toast.error("Erreur lors de l'upload de l'image");
                        return { success: 0 };
                      }
                    },
                  },
                },
              },
              quote: {
                class: Quote,
                inlineToolbar: true,
              },
              marker: Marker,
              delimiter: Delimiter,
              inlineCode: InlineCode,
              linkTool: LinkTool,
              embed: {
                class: Embed,
                inlineToolbar: true,
                config: {
                  services: {
                    youtube: true,
                    twitter: true,
                    instagram: true,
                  },
                },
              },
            },
            onChange: async (api) => {
              const data = await api.saver.save();
              onChange(JSON.stringify(data));
            },
            autofocus: false,
          });

          ejInstance.current = editor;
          isReady.current = true;
        } catch (err) {
          console.error("Failed to initialize Editor.js", err);
        }
      };

      initEditor();
    }

    return () => {
      // Cleanup to avoid multiple instances in dev mode
      if (ejInstance.current && typeof ejInstance.current.destroy === "function") {
        // ejInstance.current.destroy();
        // isReady.current = false;
      }
    };
  }, [holder, placeholder, getInitialData, onChange]); // Depend on holder

  return (
    <div
      className={`border border-border rounded-xl bg-card flex flex-col ${className || ""}`}
    >
      <div className="flex-1 overflow-y-auto cursor-text p-6">
        <div id={holder} className="w-full prose dark:prose-invert max-w-none focus:outline-none" />
      </div>
    </div>
  );
}
