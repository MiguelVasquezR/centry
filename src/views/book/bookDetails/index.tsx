"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLazyGetBookByIdQuery } from "../../../redux/store/api/booksApi";
import { useFetchPostsByBookQuery } from "../../../redux/store/api/postsApi";
import BookShelfMap, { DEFAULT_SHELVES } from "@/src/component/BookShelfMap";
import Loader from "@/src/component/Loader";
import { Book } from "@/src/types/book";
import type { Post } from "@/src/types/post";
import Image from "next/image";
import PageHeader from "@/src/component/PageHeader";
import { DateTime } from "luxon";
import toast from "react-hot-toast";
import { useGetCurrentUserQuery } from "@/src/redux/store/api/usersApi";
import {
  useCreateLoanMutation,
  useGetLoansByBookQuery,
} from "@/src/redux/store/api/loanApi";
import type { Loan } from "@/src/types/loan";

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
  const {
    data: loansData = [],
    isLoading: isLoadingLoans,
    isFetching: isFetchingLoans,
    refetch: refetchLoans,
  } = useGetLoansByBookQuery(bookId, {
    skip: !bookId,
  });
  const loans = (loansData as Loan[]) ?? [];
  const [createLoan, { isLoading: isCreatingLoan }] = useCreateLoanMutation();
  const { data: currentUser } = useGetCurrentUserQuery(undefined);
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

  useEffect(() => {
    if (bookId) {
      getBookById(bookId);
    }
  }, [bookId, getBookById]);

  useEffect(() => {
    setBook(dataBook);
  }, [dataBook]);

  useEffect(() => {
    if (
      !hasLoadedInitialData &&
      !isLoadingBook &&
      !isLoadingComments &&
      !isFetchingComments &&
      !isLoadingLoans &&
      !isFetchingLoans
    ) {
      setHasLoadedInitialData(true);
    }
  }, [
    hasLoadedInitialData,
    isLoadingBook,
    isLoadingComments,
    isFetchingComments,
    isLoadingLoans,
    isFetchingLoans,
  ]);

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

  const currentUserId = currentUser?.id ?? "";
  const hasActiveLoan = loans.some((loan) => loan.status === "active");
  const hasRequestedLoan = loans.some((loan) => loan.status === "requested");
  const requiresLogin = !currentUserId;
  const loanButtonLabel = hasActiveLoan
    ? "Prestado"
    : hasRequestedLoan
    ? "En espera"
    : isCreatingLoan
    ? "Solicitando..."
    : "Solicitar préstamo";
  const isLoanButtonDisabled =
    !book ||
    hasActiveLoan ||
    hasRequestedLoan ||
    isCreatingLoan ||
    isLoadingLoans ||
    isFetchingLoans;
  const loanStatusMessage = hasActiveLoan
    ? "Este libro está prestado actualmente."
    : hasRequestedLoan
    ? "Este libro tiene una solicitud pendiente."
    : null;

  const handleLoanRequest = async () => {
    if (!book || !book.id) {
      toast.error("No pudimos identificar el libro.");
      return;
    }

    if (requiresLogin) {
      toast.error("Inicia sesión para solicitar un préstamo.");
      router.push("/login");
      return;
    }

    if (hasActiveLoan || hasRequestedLoan) {
      return;
    }

    try {
      const now = DateTime.now();
      const startDateISO =
        now.toISODate() ?? new Date().toISOString().slice(0, 10);
      const dueDateISO =
        now.plus({ days: 15 }).toISODate() ??
        new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10);

      const payload = {
        bookId: book.id,
        bookTitle: book.titulo,
        userId: currentUserId,
        userName: currentUser?.name ?? currentUser?.email ?? "Usuario",
        userEmail: currentUser?.email ?? "",
        startDate: startDateISO,
        dueDate: dueDateISO,
        status: "requested" as const,
        notes: "Solicitud enviada desde el detalle del libro",
      };

      const response = await createLoan(payload).unwrap();

      if (response.status === 200) {
        toast.success("Solicitud enviada. Pronto recibirás una respuesta.");
        await refetchLoans();
      } else {
        toast.error("No pudimos registrar tu solicitud.");
      }
    } catch (error) {
      console.error("Error al solicitar préstamo:", error);
      toast.error("Ocurrió un error al solicitar el préstamo.");
    }
  };

  if (!hasLoadedInitialData) {
    return <Loader />;
  }

  return (
    <div className="container">
      <br />
      <PageHeader
        title={book?.titulo ?? "Detalles del libro"}
        description={book?.autor ? `Por ${book.autor}` : undefined}
      />

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
              <button
                type="button"
                className={`button is-primary has-text-white ${
                  isCreatingLoan ? "is-loading" : ""
                }`}
                onClick={handleLoanRequest}
                disabled={isLoanButtonDisabled}
              >
                {loanButtonLabel}
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
            {loanStatusMessage && (
              <p className="help is-warning mt-2">{loanStatusMessage}</p>
            )}
            {!loanStatusMessage && requiresLogin && (
              <p className="help is-warning mt-2">
                Inicia sesión para solicitar el préstamo.
              </p>
            )}
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
