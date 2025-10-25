"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLazyGetBookByIdQuery } from "../../../redux/store/api/booksApi";
import { useFetchPostsByBookQuery } from "../../../redux/store/api/postsApi";
import BookShelfMap, { DEFAULT_SHELVES } from "@/src/component/BookShelfMap";
import { Book } from "@/src/types/book";
import type { Post } from "@/src/types/post";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";

const SHELVES = DEFAULT_SHELVES;
const SHELF_LABELS: Record<string, string> = SHELVES.reduce((acc, shelf) => {
  acc[shelf.id] = shelf.label;
  return acc;
}, {} as Record<string, string>);

const BookDetailsView = () => {
  const [book, setBook] = useState<Book>();
  const params = useParams();
  const rawBookId = params?.id;
  const bookId =
    typeof rawBookId === "string"
      ? rawBookId
      : Array.isArray(rawBookId)
      ? rawBookId[0]
      : "";
  const router = useRouter();

  const [getBookById, { data: dataBook, isLoading: isLoadingBook }] =
    useLazyGetBookByIdQuery();
  const {
    data: bookComments = [],
    isLoading: isLoadingComments,
    isFetching: isFetchingComments,
  } = useFetchPostsByBookQuery(bookId, {
    skip: !bookId,
  });

  useEffect(() => {
    if (bookId) {
      getBookById(bookId);
    }
  }, [bookId, getBookById]);

  useEffect(() => {
    setBook(dataBook);
  }, [dataBook]);

  console.log(book?.ubicacion);

  const normalizedLocation = book?.ubicacion
    ? {
        repisa: Number(book.ubicacion.respisa ?? 1),
        row: Number(book.ubicacion.row ?? 0),
        col: Number(book.ubicacion.col ?? 0),
      }
    : null;

  const hasLocation =
    normalizedLocation !== null &&
    Number.isFinite(normalizedLocation.row) &&
    Number.isFinite(normalizedLocation.col) &&
    normalizedLocation.row >= 0 &&
    normalizedLocation.col >= 0;

  if (isLoadingBook) {
    return <div className="loading">Loading</div>;
  }

  return (
    <div className="container">
      <br />

      <div>
        <ChevronLeft
          className="is-clickable"
          size={32}
          onClick={() => {
            router.back();
          }}
        />
      </div>
      <br />

      <div className="columns">
        <div className="column">
          <div className="is-flex is-flex-direction-column is-align-items-start is-gap-2">
            <div>
              <p className="is-size-4 has-text-left">{book?.titulo}</p>
            </div>
            <div>
              <p className="is-size-6 has-text-left ">
                Por{" "}
                <strong className="is-underlined has-text-grey-light has-text-weight-normal is-clickable">
                  {book?.autor}
                </strong>{" "}
              </p>
            </div>
            <div className="buttons">
              <button className="button is-primary has-text-white">
                Solicitar Prestamo
              </button>
              <button
                type="button"
                className="button is-primary is-outlined"
                onClick={() => {
                  if (book?.id) {
                    router.push(
                      `/posts/create?bookId=${encodeURIComponent(book.id)}`
                    );
                  } else {
                    router.push("/posts/create");
                  }
                }}
              >
                Comentar
              </button>
            </div>
          </div>
        </div>

        <div className="column">
          <div className="is-flex is-justify-content-center is-flex-direction-column is-align-items-center is-gap-2">
            <Image
              src={
                book?.imagen ||
                book?.image ||
                "https://res.cloudinary.com/dvt4vznxn/image/upload/v1758764097/138617_ar3v0q.jpg"
              }
              alt="imagen"
              height={132}
              width={132}
            />
          </div>
        </div>
      </div>

      <hr className="line" />

      <div className="columns is-gap-5">
        <div className="column">
          <div>
            <p className="is-size-5 has-text-weight-bold">Descripción</p>
            <br />
          </div>
          <div>
            <p>{book?.descripcion}</p>
          </div>
          <br />
          <div>
            <p className="is-size-5 has-text-weight-bold">Ubicación</p>
            <br />
          </div>
          {hasLocation && normalizedLocation ? (
            <div className="is-flex is-flex-direction-column is-gap-3">
              <p className="is-size-6 has-text-grey-dark">
                {SHELF_LABELS[normalizedLocation.repisa] ??
                  normalizedLocation.repisa}{" "}
                · fila {normalizedLocation.row} · columna{" "}
                {normalizedLocation.col}
              </p>
              <BookShelfMap
                mode="view"
                shelves={SHELVES}
                activeShelfId={String(normalizedLocation.repisa)}
                value={normalizedLocation}
              />
            </div>
          ) : (
            <p className="has-text-grey">Sin ubicación registrada.</p>
          )}
        </div>
        <div className="column">
          <div>
            <p className="is-size-5 has-text-weight-bold">Comentarios</p>
            <br />
          </div>
          <div className="is-flex is-flex-direction-column is-gap-3">
            {isLoadingComments || isFetchingComments ? (
              <p className="has-text-grey">Cargando comentarios...</p>
            ) : bookComments.length ? (
              bookComments.map((comment: Post) => {
                const plainContent = comment.content
                  ?.replace(/<[^>]+>/g, " ")
                  .replace(/\s+/g, " ")
                  .trim();
                const preview = plainContent
                  ? `${plainContent.slice(0, 140)}${
                      plainContent.length > 140 ? "…" : ""
                    }`
                  : "Sin contenido";

                return (
                  <div
                    key={comment.id}
                    className="box has-background-light"
                    style={{ borderRadius: "12px" }}
                  >
                    <p className="has-text-weight-semibold mb-1">
                      {comment.title}
                    </p>
                    <p className="is-size-7 has-text-grey mb-2">{preview}</p>
                    <Link
                      href={`/posts/${comment.id}`}
                      className="is-size-7 has-text-link has-text-weight-semibold"
                    >
                      Ver detalle
                    </Link>
                  </div>
                );
              })
            ) : (
              <p className="has-text-grey">
                Aún no hay comentarios para este libro.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsView;
