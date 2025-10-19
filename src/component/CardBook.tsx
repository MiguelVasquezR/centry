import Image from "next/image";
import Link from "next/link";
import { Book } from "../types/book";
import { cutText } from "../utils/utils";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { useDeleteBookMutation } from "@/src/redux/store/api/booksApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useGetCurrentUserQuery } from "../redux/store/api/usersApi";

const CardBook = ({ book }: { book: Book }) => {
  const [isActiveMenu, setIsActiveMenu] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();

  const { data: currentUser, isLoading: isLoadingCurrentUser } =
    useGetCurrentUserQuery(undefined);
  const { rol = "student" } = currentUser || {};

  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteBook(book.id);
      toast.success("Libro se ha eliminado correctamente");
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Error al eliminar el libro, por favor vuelve a intentarlo.");
    }
  };

  return (
    <div
      className="card p-5 is-relative is-clickable"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        router.push(`/book/${book.id}`);
      }}
    >
      <div style={{ position: "absolute", right: 12, top: 12 }}>
        <div
          className={clsx(
            "dropdown ",
            { "is-active": isActiveMenu },
            { "is-hidden": rol !== "admin" }
          )}
        >
          <div className="dropdown-trigger">
            <EllipsisVertical
              className="is-clickable"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsActiveMenu(!isActiveMenu);
              }}
            />
          </div>
          <div className="dropdown-menu" id="dropdown-menu" role="menu">
            <div className="dropdown-content">
              <Link href={`/book/edit/${book.id}`} className="dropdown-item">
                Editar
              </Link>
              <a
                href="#"
                className="dropdown-item has-text-danger"
                onClick={(e) => {
                  e.preventDefault();
                  setShowDeleteConfirm(true);
                  setIsActiveMenu(false);
                }}
              >
                Eliminar
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="is-flex is-justify-content-center">
        <Image
          src={book.imagen || book.image}
          width={130}
          height={130}
          alt="Image from "
        />
      </div>
      <br />
      <div>
        <p className="has-text-centered has-text-weight-medium">
          {cutText(book.titulo, 72)}
        </p>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal is-active">
          <div
            className="modal-background"
            onClick={() => setShowDeleteConfirm(false)}
          ></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Confirmar Eliminación</p>
              <button
                className="delete"
                aria-label="close"
                onClick={() => setShowDeleteConfirm(false)}
              ></button>
            </header>
            <section className="modal-card-body">
              <p className="is-size-5">
                ¿Estás seguro de que quieres eliminar el libro{" "}
                <strong>&ldquo;{book.titulo}&rdquo;</strong>?
              </p>

              <p className="has-text-danger is-size-6 mt-2 has-text-centered is-underlined">
                Esta acción no se puede deshacer
              </p>
            </section>
            <footer className="modal-card-foot">
              <button
                className="button is-danger mx-2 has-text-white"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </button>
              <button
                className="button mx-2"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancelar
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardBook;
