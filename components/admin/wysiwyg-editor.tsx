"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link as LinkIcon,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) {
    return null;
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      editor.chain().focus().setImage({ src: data.url }).run();
      toast.success("Image insérée !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'envoi de l'image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const addImage = () => {
    fileInputRef.current?.click();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL du lien", previousUrl);
    
    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-muted/20">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded-md hover:bg-muted ${editor.isActive("bold") ? "bg-muted text-primary" : "text-muted-foreground"}`}
        title="Gras"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded-md hover:bg-muted ${editor.isActive("italic") ? "bg-muted text-primary" : "text-muted-foreground"}`}
        title="Italique"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={`p-2 rounded-md hover:bg-muted ${editor.isActive("underline") ? "bg-muted text-primary" : "text-muted-foreground"}`}
        title="Souligné"
      >
        <UnderlineIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`p-2 rounded-md hover:bg-muted ${editor.isActive("strike") ? "bg-muted text-primary" : "text-muted-foreground"}`}
        title="Barré"
      >
        <Strikethrough className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-border mx-1 self-center" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded-md hover:bg-muted ${editor.isActive("heading", { level: 2 }) ? "bg-muted text-primary" : "text-muted-foreground"}`}
        title="Titre 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded-md hover:bg-muted ${editor.isActive("heading", { level: 3 }) ? "bg-muted text-primary" : "text-muted-foreground"}`}
        title="Titre 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-border mx-1 self-center" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-md hover:bg-muted ${editor.isActive("bulletList") ? "bg-muted text-primary" : "text-muted-foreground"}`}
        title="Liste à puces"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded-md hover:bg-muted ${editor.isActive("orderedList") ? "bg-muted text-primary" : "text-muted-foreground"}`}
        title="Liste numérotée"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-border mx-1 self-center" />

      <button
        type="button"
        onClick={setLink}
        className={`p-2 rounded-md hover:bg-muted ${editor.isActive("link") ? "bg-muted text-primary" : "text-muted-foreground"}`}
        title="Insérer un lien"
      >
        <LinkIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={addImage}
        disabled={uploading}
        className="p-2 rounded-md hover:bg-muted text-muted-foreground disabled:opacity-50"
        title="Insérer une image"
      >
        {uploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ImageIcon className="w-4 h-4" />
        )}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export function WysiwygEditor({
  value,
  onChange,
  className,
}: WysiwygEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert max-w-none focus:outline-none p-4 min-h-[400px]",
      },
    },
  });

  return (
    <div className={`border border-border rounded-xl overflow-hidden bg-background flex flex-col ${className || ""}`}>
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-y-auto cursor-text" onClick={() => editor?.commands.focus()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
