import React from "react";

export type ShelfDefinition = {
  id: string;
  label: string;
  rows: number;
  cols: number;
};

export type BookLocation = {
  repisa: number;
  row: number;
  col: number;
};

export interface BookShelfMapProps {
  value?: BookLocation | null;
  onChange?: (value: BookLocation) => void;
  mode?: "select" | "view";
  shelves?: ShelfDefinition[];
  activeShelfId?: string;
  className?: string;
  disabled?: boolean;
}

export const DEFAULT_SHELVES: ShelfDefinition[] = [
  {
    id: "1",
    label: "Repisa 1 · 3 x 4",
    rows: 3,
    cols: 4,
  },
  {
    id: "2",
    label: "Repisa 2 · 4 x 6",
    rows: 4,
    cols: 6,
  },
];

const cellBaseStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "10px",
  borderWidth: "2px",
  borderStyle: "solid",
  borderColor: "#e2e8f0",
  backgroundColor: "#ffffff",
  height: "44px",
  fontSize: "0.75rem",
  fontWeight: 600,
  color: "#475569",
  transition:
    "border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease",
};

const activeCellStyle: React.CSSProperties = {
  borderColor: "#485fc7",
  backgroundColor: "#eef2ff",
  color: "#1d4ed8",
};

const selectableCellStyle: React.CSSProperties = {
  cursor: "pointer",
};

const BookShelfMap: React.FC<BookShelfMapProps> = ({
  value,
  onChange,
  mode = "view",
  shelves = DEFAULT_SHELVES,
  activeShelfId,
  className,
  disabled = false,
}) => {
  const selectable = mode === "select" && !disabled;

  const availableShelves = shelves.length ? shelves : DEFAULT_SHELVES;
  const shelfToRender =
    activeShelfId !== undefined
      ? availableShelves.find((shelf) => shelf.id === activeShelfId) ??
        availableShelves[0]
      : availableShelves[0];

  if (!shelfToRender) {
    return (
      <div
        className={className}
        style={{ color: "#64748b", fontSize: "0.85rem" }}
      >
        No hay repisas configuradas.
      </div>
    );
  }

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${shelfToRender.cols}, minmax(0, 1fr))`,
    gap: "0.5rem",
  };

  return (
    <div
      className={className}
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <div
        style={{
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#e2e8f0",
          borderRadius: "14px",
          padding: "1rem",
          backgroundColor: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.75rem",
          }}
        >
          <p
            style={{
              margin: 0,
              fontWeight: 600,
              color: "#1f2937",
            }}
          >
            {shelfToRender.label}
          </p>
          <span
            style={{
              fontSize: "0.7rem",
              color: "#64748b",
            }}
          >
            Coordenadas 0-index
          </span>
        </div>
        <div style={gridStyle}>
          {Array.from({ length: shelfToRender.rows }).map((_, rowIndex) =>
            Array.from({ length: shelfToRender.cols }).map((__, colIndex) => {
              
              console.log(shelfToRender)
              console.log(value)
              
              const isSelected =
                String(value?.repisa) === shelfToRender.id &&
                value?.row === rowIndex &&
                value?.col === colIndex;

              const handleSelect = () => {
                if (!selectable) {
                  return;
                }
                onChange?.({
                  repisa: Number(shelfToRender.id),
                  row: rowIndex,
                  col: colIndex,
                });
              };

              return (
                <button
                  key={`${shelfToRender.id}-${rowIndex}-${colIndex}`}
                  type="button"
                  onClick={handleSelect}
                  tabIndex={selectable ? 0 : -1}
                  aria-disabled={selectable ? undefined : true}
                  aria-pressed={selectable ? isSelected : undefined}
                  title={`Repisa ${shelfToRender.id} · fila ${rowIndex} · columna ${colIndex}`}
                  style={{
                    ...cellBaseStyle,
                    ...(isSelected ? activeCellStyle : {}),
                    ...(selectable ? selectableCellStyle : {}),
                    opacity: selectable || isSelected ? 1 : 0.9,
                  }}
                >
                  📖
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default BookShelfMap;
