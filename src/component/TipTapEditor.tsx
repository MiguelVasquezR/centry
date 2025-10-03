"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Bold, Italic, Type, Palette } from "lucide-react";

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const TipTapEditor = ({
  content,
  onChange,
  placeholder = "Escribe tu contenido aquí...",
}: TipTapEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4",
      },
    },
  });

  if (!editor) {
    return null;
  }

  const fontSizes = [
    { label: "Pequeño", value: "12px" },
    { label: "Normal", value: "14px" },
    { label: "Mediano", value: "16px" },
    { label: "Grande", value: "18px" },
    { label: "Muy Grande", value: "24px" },
  ];

  const colors = [
    "#000000",
    "#374151",
    "#DC2626",
    "#EA580C",
    "#D97706",
    "#65A30D",
    "#059669",
    "#0891B2",
    "#2563EB",
    "#7C3AED",
    "#C026D3",
    "#DB2777",
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-300 p-2 bg-gray-50">
        <div className="flex flex-wrap items-center gap-2">
          {/* Bold */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("bold") ? "bg-blue-200 text-blue-800" : ""
            }`}
            title="Negrita"
          >
            <Bold size={16} />
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("italic") ? "bg-blue-200 text-blue-800" : ""
            }`}
            title="Cursiva"
          >
            <Italic size={16} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          {/* Font Size */}
          <div className="flex items-center gap-1">
            <Type size={16} />
            <select
              onChange={(e) => {
                if (e.target.value) {
                  editor.chain().focus().run();
                  // Apply inline style for font size since TipTap doesn't have built-in fontSize
                  const selection = editor.state.selection;
                  if (!selection.empty) {
                    editor.commands.insertContent(
                      `<span style="font-size: ${
                        e.target.value
                      }">${editor.state.doc.textBetween(
                        selection.from,
                        selection.to
                      )}</span>`
                    );
                  }
                }
              }}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="">Tamaño</option>
              {fontSizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>

          {/* Color Picker */}
          <div className="flex items-center gap-1">
            <Palette size={16} />
            <div className="flex flex-wrap gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => editor.chain().focus().setColor(color).run()}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={`Color ${color}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="min-h-[200px] bg-white">
        <EditorContent editor={editor} />
        {!content && (
          <div className="absolute top-16 left-4 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};

export default TipTapEditor;
