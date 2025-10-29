// src/components/RichTextEditor.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Wpisz treść regulaminu...",
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Zapewniamy, że komponent działa tylko po stronie klienta
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#26a69a] underline hover:text-[#00897b]",
        },
      }),
      Image.configure({
        HTMLAttributes: { class: "max-w-full h-auto rounded-lg" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: isMounted ? content : "", // pusty string zapobiega inicjalizacji SSR
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[400px] p-4",
      },
    },
  });

  const addLink = useCallback(() => {
    const url = window.prompt("Wprowadź URL:");
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt("Wprowadź adres URL obrazu:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  // Nie renderujemy zawartości, dopóki hook się nie zainicjalizuje
  if (!editor || !isMounted) return null;

  return (
    <div className="border border-[#26a69a]/20 rounded-xl overflow-hidden bg-gray-900">
      {/* Toolbar */}
      <div className="border-b border-[#26a69a]/20 bg-gray-800/50 p-2 flex flex-wrap gap-1">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Pogrubienie"
          Icon={Bold}
        />
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Kursywa"
          Icon={Italic}
        />
        <ToolbarButton
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Podkreślenie"
          Icon={UnderlineIcon}
        />
        <ToolbarButton
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Przekreślenie"
          Icon={Strikethrough}
        />
        <ToolbarButton
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
          title="Kod"
          Icon={Code}
        />

        {/* Headings */}
        {[1, 2, 3].map((level) => (
          <ToolbarButton
            key={level}
            active={editor.isActive("heading", { level })}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
            title={`Nagłówek ${level}`}
            Icon={
              level === 1 ? Heading1 : level === 2 ? Heading2 : Heading3
            }
          />
        ))}

        {/* Lists and alignment */}
        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Lista punktowana"
          Icon={List}
        />
        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Lista numerowana"
          Icon={ListOrdered}
        />
        <ToolbarButton
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Cytat"
          Icon={Quote}
        />
        <ToolbarButton
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          title="Wyrównaj do lewej"
          Icon={AlignLeft}
        />
        <ToolbarButton
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          title="Wyrównaj do środka"
          Icon={AlignCenter}
        />
        <ToolbarButton
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          title="Wyrównaj do prawej"
          Icon={AlignRight}
        />

        {/* Insert */}
        <ToolbarButton
          active={editor.isActive("link")}
          onClick={addLink}
          title="Dodaj link"
          Icon={LinkIcon}
        />
        <ToolbarButton
          active={false}
          onClick={addImage}
          title="Dodaj obraz"
          Icon={ImageIcon}
        />

        {/* Undo/Redo */}
        <ToolbarButton
          active={false}
          onClick={() => editor.chain().focus().undo().run()}
          title="Cofnij"
          Icon={Undo}
        />
        <ToolbarButton
          active={false}
          onClick={() => editor.chain().focus().redo().run()}
          title="Ponów"
          Icon={Redo}
        />
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="bg-gray-900/50" />
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  title,
  Icon,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  Icon: React.ElementType;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded transition-colors ${
        active
          ? "bg-[#26a69a] text-white"
          : "text-gray-400 hover:bg-gray-700"
      }`}
      title={title}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
