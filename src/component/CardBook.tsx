import Image from "next/image";
import { Book } from "../types/book";
import { cutText } from "../utils/utils";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

const CardBook = ({ book }: { book: Book }) => {
  const [isActiveMenu, setIsActiveMenu] = useState<boolean>(false);

  return (
    <div className="card p-5 is-relative">
      <div style={{ position: "absolute", right: 12, top: 12 }}>
        <div className={clsx("dropdown ", { "is-active": isActiveMenu })}>
          <div className="dropdown-trigger">
            <EllipsisVertical
              className="is-clickable"
              onClick={() => setIsActiveMenu(!isActiveMenu)}
            />
          </div>
          <div className="dropdown-menu" id="dropdown-menu" role="menu">
            <div className="dropdown-content">
              <a href="#" className="dropdown-item">
                Editar
              </a>
              <a href="#" className="dropdown-item has-text-danger">
                Eliminar
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="is-flex is-justify-content-center">
        <Image src={book.imagen} width={130} height={130} alt="Image from " />
      </div>
      <br />
      <div>
        <p className="has-text-centered has-text-weight-medium">
          {cutText(book.titulo, 72)}
        </p>
      </div>
    </div>
  );
};

export default CardBook;
