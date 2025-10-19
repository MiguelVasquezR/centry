import {
  Book,
  CalendarDays,
  EllipsisVertical,
  Film,
  Sparkles,
} from "lucide-react";

type CategoryTypeKey = Category["type"];

export const CATEGORY_TYPE_META: Record<
  CategoryTypeKey,
  {
    label: string;
    icon: typeof Book;
    accent: string;
    surface: string;
    border: string;
    badge: string;
    shadow: string;
  }
> = {
  event: {
    label: "Eventos y actividades",
    icon: CalendarDays,
    accent: "#0ea5e9",
    surface: "linear-gradient(135deg, rgba(14,165,233,0.12), rgba(14,165,233,0.02))",
    border: "rgba(14, 165, 233, 0.25)",
    badge: "rgba(14,165,233,0.16)",
    shadow: "0 25px 45px -35px rgba(14,165,233,0.65)",
  },
  movie: {
    label: "Filmoteca y proyecciones",
    icon: Film,
    accent: "#a855f7",
    surface: "linear-gradient(135deg, rgba(168,85,247,0.12), rgba(168,85,247,0.02))",
    border: "rgba(168, 85, 247, 0.25)",
    badge: "rgba(168,85,247,0.16)",
    shadow: "0 25px 45px -35px rgba(168,85,247,0.65)",
  },
  book: {
    label: "Biblioteca y archivos",
    icon: Book,
    accent: "#22c55e",
    surface: "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(34,197,94,0.02))",
    border: "rgba(34, 197, 94, 0.25)",
    badge: "rgba(34,197,94,0.16)",
    shadow: "0 25px 45px -35px rgba(34,197,94,0.65)",
  },
};

const CardCategory = ({ category }: { category: Category }) => {
  const meta = CATEGORY_TYPE_META[category.type] ?? CATEGORY_TYPE_META.book;
  const Icon = meta.icon;

  return (
    <article className="category-card">
      <div className="category-card__accent">
        <Sparkles size={16} />
      </div>
      <div className="category-card__body">
        <div className="category-card__icon">
          <Icon size={26} />
        </div>

        <div className="category-card__content">
          <header className="category-card__header">
            <span className="category-card__badge">{meta.label}</span>
            <button
              type="button"
              className="category-card__action"
              aria-label="Más opciones de categoría"
            >
              <EllipsisVertical size={18} />
            </button>
          </header>

          <h3 className="category-card__title">{category.title}</h3>
          <p className="category-card__description">{category.description}</p>
        </div>
      </div>

      <style jsx>{`
        .category-card {
          position: relative;
          border-radius: 20px;
          padding: 1.25rem;
          background: ${meta.surface};
          border: 1px solid ${meta.border};
          box-shadow: ${meta.shadow};
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          overflow: hidden;
        }

        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 35px 55px -40px rgba(15, 23, 42, 0.5);
        }

        .category-card__accent {
          position: absolute;
          inset: auto auto 10px 12px;
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${meta.accent};
          background: rgba(255, 255, 255, 0.4);
        }

        .category-card__body {
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
        }

        .category-card__icon {
          width: 56px;
          height: 56px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${meta.badge};
          color: ${meta.accent};
          flex-shrink: 0;
        }

        .category-card__content {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          width: 100%;
        }

        .category-card__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
        }

        .category-card__badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.66);
          color: ${meta.accent};
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .category-card__action {
          border: none;
          background: rgba(255, 255, 255, 0.45);
          color: ${meta.accent};
          border-radius: 12px;
          padding: 0.25rem;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .category-card__action:hover {
          background: rgba(255, 255, 255, 0.7);
        }

        .category-card__title {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f172a;
        }

        .category-card__description {
          margin: 0;
          font-size: 0.8rem;
          color: #475569;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media screen and (max-width: 768px) {
          .category-card {
            padding: 1rem;
          }

          .category-card__body {
            gap: 1rem;
          }

          .category-card__description {
            -webkit-line-clamp: 4;
          }
        }
      `}</style>
    </article>
  );
};

export default CardCategory;
