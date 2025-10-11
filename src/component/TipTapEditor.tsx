"use client";

import { ReactNode, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import clsx from "clsx";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  Code2,
  Undo2,
  Redo2,
  Eraser,
  Palette,
} from "lucide-react";

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

type ToolbarButtonProps = {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
};

const ToolbarButton = ({
  label,
  icon,
  onClick,
  isActive = false,
  disabled = false,
}: ToolbarButtonProps) => (
  <button
    type="button"
    className={clsx(
      "button is-small",
      isActive ? "is-info is-light" : "is-white",
      disabled && "is-static"
    )}
    onClick={onClick}
    title={label}
    aria-label={label}
    disabled={disabled}
    style={{ minWidth: 36 }}
  >
    {icon}
  </button>
);

const ToolbarDivider = () => (
  <span
    style={{
      width: 1,
      alignSelf: "stretch",
      background: "#e3e6ed",
      opacity: 0.8,
    }}
  />
);

const colorPalette = [
  "#111827",
  "#4B5563",
  "#DB2777",
  "#F97316",
  "#F59E0B",
  "#0EA5E9",
  "#2563EB",
  "#7C3AED",
  "#10B981",
  "#059669",
  "#9D174D",
  "#1F2937",
];

const fontFamilyOptions = [
  { label: "Predeterminada", value: "default" },
  { label: "Inter", value: "Inter, 'Helvetica Neue', Arial, sans-serif" },
  { label: "Serif clásica", value: "'Georgia', 'Times New Roman', serif" },
  { label: "Monospace", value: "'JetBrains Mono', Menlo, monospace" },
];

const TipTapEditor = ({
  content,
  onChange,
  placeholder = "Escribe tu contenido aquí...",
}: TipTapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextStyle.configure({ types: ["textStyle"] }),
      Color.configure({ types: ["textStyle"] }),
      FontFamily.configure({ types: ["textStyle"] }),
    ],
    content,
    immediatelyRender: false,
    autofocus: false,
    onCreate: ({ editor }) => {
      editor.commands.blur();
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "tiptap-content content",
        style:
          "min-height: 240px; padding: 1.25rem; outline: none; font-size: 1rem; line-height: 1.6;",
      },
    },
  });

  useEffect(() => {
    if (editor && editor.isFocused) {
      editor.commands.blur();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  const textStyleAttributes = editor.getAttributes("textStyle") || {};
  const currentFontFamily =
    (textStyleAttributes.fontFamily as string | undefined) || "default";
  const currentColor =
    (textStyleAttributes.color as string | undefined) || "#111827";
  const showPlaceholder =
    editor.isEmpty &&
    !editor.isFocused &&
    (!content || content === "<p></p>" || content === "");

  return (
    <div
      style={{
        border: "1px solid #e4e7ef",
        borderRadius: "18px",
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
      }}
    >
      <div
        style={{
          padding: "12px 18px",
          borderBottom: "1px solid #eef1f8",
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div className="buttons has-addons">
            <ToolbarButton
              label="Párrafo"
              icon={<Pilcrow size={16} />}
              onClick={() => editor.chain().focus().setParagraph().run()}
              isActive={editor.isActive("paragraph")}
            />
            <ToolbarButton
              label="Encabezado 1"
              icon={<Heading1 size={16} />}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              isActive={editor.isActive("heading", { level: 1 })}
            />
            <ToolbarButton
              label="Encabezado 2"
              icon={<Heading2 size={16} />}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              isActive={editor.isActive("heading", { level: 2 })}
            />
            <ToolbarButton
              label="Encabezado 3"
              icon={<Heading3 size={16} />}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              isActive={editor.isActive("heading", { level: 3 })}
            />
          </div>

          <ToolbarDivider />

          <div className="buttons has-addons">
            <ToolbarButton
              label="Negrita"
              icon={<Bold size={16} />}
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
            />
            <ToolbarButton
              label="Cursiva"
              icon={<Italic size={16} />}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
            />
            <ToolbarButton
              label="Tachado"
              icon={<Strikethrough size={16} />}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive("strike")}
            />
            <ToolbarButton
              label="Código en línea"
              icon={<Code2 size={16} />}
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive("code")}
            />
          </div>

          <ToolbarDivider />

          <div className="buttons has-addons">
            <ToolbarButton
              label="Lista ordenada"
              icon={<ListOrdered size={16} />}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
            />
            <ToolbarButton
              label="Lista con viñetas"
              icon={<List size={16} />}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
            />
            <ToolbarButton
              label="Cita"
              icon={<Quote size={16} />}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive("blockquote")}
            />
          </div>

          <ToolbarDivider />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <label className="is-size-7 has-text-grey">Fuente</label>
            <div className="select is-small">
              <select
                value={currentFontFamily}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === "default") {
                    editor.chain().focus().unsetFontFamily().run();
                  } else {
                    editor.chain().focus().setFontFamily(value).run();
                  }
                }}
              >
                {fontFamilyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span className="is-size-7 has-text-grey">Color</span>
            <button
              type="button"
              className="button is-small is-white"
              onClick={() => editor.chain().focus().unsetColor().run()}
              title="Restablecer color"
            >
              <Eraser size={16} />
            </button>
            <div
              style={{
                display: "flex",
                gap: "0.35rem",
                flexWrap: "wrap",
              }}
            >
              {colorPalette.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => editor.chain().focus().setColor(color).run()}
                  title={`Color ${color}`}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border:
                      currentColor === color
                        ? "2px solid #2563EB"
                        : "1px solid #d4d8e5",
                    background: color,
                    cursor: "pointer",
                  }}
                  aria-label={`Usar color ${color}`}
                />
              ))}
              <span
                className="tag is-white is-size-7"
                style={{ display: "inline-flex", alignItems: "center" }}
              >
                <Palette size={14} style={{ marginRight: 4 }} />
                {currentColor.replace("#", "").toUpperCase()}
              </span>
            </div>
          </div>

          <ToolbarDivider />

          <div className="buttons has-addons">
            <ToolbarButton
              label="Deshacer"
              icon={<Undo2 size={16} />}
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            />
            <ToolbarButton
              label="Rehacer"
              icon={<Redo2 size={16} />}
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            />
            <ToolbarButton
              label="Limpiar formato"
              icon={<Eraser size={16} />}
              onClick={() => {
                editor.chain().focus().clearNodes().unsetAllMarks().run();
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ position: "relative", background: "#fff" }}>
        <EditorContent editor={editor} />
        {showPlaceholder && (
          <div
            style={{
              position: "absolute",
              top: 18,
              left: 24,
              color: "#9ca3af",
              pointerEvents: "none",
              fontSize: "0.95rem",
            }}
          >
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};

export default TipTapEditor;
