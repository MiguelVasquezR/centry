import clsx from "clsx";
import {
  Book,
  Calendar,
  EllipsisVertical,
  FileVideoCamera,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const CardCategory = ({ category }: { category: Category }) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  return (
    <div className="card p-2">
      <div className="is-flex is-gap-1 is-justify-content-space-between is-align-items-center">
        <div className="is-flex is-gap-1 is-justify-content-center is-align-items-center">
          <div className="is-flex is-gap-1 is-justify-content-center is-align-items-center">
            {category.type === "book" && <Book />}
            {category.type === "event" && <Calendar />}
            {category.type === "movie" && <FileVideoCamera />}
          </div>
          <div>
            <p className="is-size-5">{category.title}</p>
            <p className="is-size-7">{category.description}</p>
          </div>
        </div>

        <div>
          <div className={clsx("dropdown", { "is-active": isActive })}>
            <div className="dropdown-trigger">
              <EllipsisVertical
                className="is-clickable"
                onClick={() => {
                  setIsActive(!isActive);
                }}
              />
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
              <div className="dropdown-content">
                <Link
                  className="dropdown-item"
                  href={`/categories/edit/${category.id}`}
                >
                  Editar
                </Link>
                <hr className="dropdown-divider" />
                <button type="button" className="dropdown-item has-text-danger">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCategory;
