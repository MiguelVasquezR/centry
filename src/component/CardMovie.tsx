import Image from "next/image";
import Link from "next/link";
import { Movie } from "../types/movie";
import { cutText } from "../utils/utils";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { useDeleteMovieMutation } from "@/src/redux/store/api/moviesApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const CardMovie = ({ movie }: { movie: Movie }) => {
  const [isActiveMenu, setIsActiveMenu] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [deleteMovie, { isLoading: isDeleting }] = useDeleteMovieMutation();

  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteMovie(movie.id);
      toast.success("Película eliminada correctamente");
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting movie:", error);
      toast.error("Error al eliminar la película. Intenta nuevamente.");
    }
  };

  return (
    <div
      className="card p-5 is-relative is-clickable"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        router.push(`/movies/${movie.id}`);
      }}
    >
      <div style={{ position: "absolute", right: 12, top: 12 }}>
        <div className={clsx("dropdown ", { "is-active": isActiveMenu })}>
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
          <div className="dropdown-menu" id="dropdown-menu-movie" role="menu">
            <div className="dropdown-content">
              <Link href={`/movies/edit/${movie.id}`} className="dropdown-item">
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
          src={movie.imagen}
          width={130}
          height={190}
          alt={`Carátula de ${movie.titulo}`}
          style={{ borderRadius: "12px", objectFit: "cover" }}
        />
      </div>
      <br />
      <div>
        <p className="has-text-centered has-text-weight-semibold">
          {cutText(movie.titulo, 72)}
        </p>
        <p className="has-text-centered is-size-7 has-text-grey">
          {movie.genero} · {movie.anioEstreno}
        </p>
        <p className="has-text-centered is-size-7 has-text-grey">
          Dirigida por {movie.director}
        </p>
      </div>

      {showDeleteConfirm && (
        <div className="modal is-active">
          <div
            className="modal-background"
            onClick={() => setShowDeleteConfirm(false)}
          ></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Confirmar eliminación</p>
              <button
                className="delete"
                aria-label="close"
                onClick={() => setShowDeleteConfirm(false)}
              ></button>
            </header>
            <section className="modal-card-body">
              <p className="is-size-5">
                ¿Seguro que quieres eliminar la película{" "}
                <strong>&ldquo;{movie.titulo}&rdquo;</strong>?
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

export default CardMovie;
