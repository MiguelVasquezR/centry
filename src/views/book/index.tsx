"use client";
import CardBook from "@/src/component/CardBook";
import Pagination from "@/src/component/Pagination";
import { useLazyFetchBooksQuery } from "@/src/redux/store/api/booksApi";
import { useGetCurrentUserQuery } from "@/src/redux/store/api/usersApi";
import { Book } from "@/src/types/book";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "@/src/component/Loader";

const BookLibraryView = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);

  const { data: currentUser, isLoading: isLoadingCurrentUser } =
    useGetCurrentUserQuery(undefined);
  const { rol = "student" } = currentUser || {};

  const [
    getMore,
    { data: dataBooks, isLoading: isLoadingBooks, error },
  ] =
    useLazyFetchBooksQuery();

  const { books, totalPages } = dataBooks || {};

  useEffect(() => {
    getMore({ page, limit });
  }, [getMore, limit, page]);

  useEffect(() => {
    if (error) {
      toast.error("Error al cargar los libros. Por favor, intenta de nuevo.");
    }
  }, [error]);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoadingBooks || isLoadingCurrentUser) {
    return <Loader />;
  }

  return (
    <div className="container">
      <br />
      <div className="is-flex is-justify-content-space-between is-align-items-center">
        <p className="is-size-4">Biblioteca</p>
        {rol === "admin" && (
          <div>
            <Link
              href={"/book/add"}
              className="button is-primary has-text-white"
            >
              Agregar Libro
            </Link>
          </div>
        )}
      </div>

      <br />

      <div className="box">
        <div className="columns">
          <div className="column">
            <input
              type="text"
              className="input"
              placeholder="Buscar por nombre"
            />
          </div>

          <div className="column is-4">
            <div className="select mx-2">
              <select>
                <option>Categoría</option>
                <option>With options</option>
              </select>
            </div>

            <div className="select mx-2">
              <select>
                <option>Repisa</option>
                <option>Lateral</option>
                <option>Central</option>
              </select>
            </div>

            <div className="select mx-2">
              <select
                onChange={(e) => {
                  e.preventDefault();
                  setLimit(parseInt(e.currentTarget.value));
                }}
                defaultValue={20}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1) // 1 al 10
                  .concat(Array.from({ length: 9 }, (_, i) => (i + 2) * 10)) // 20 al 100
                  .map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed-grid has-4-cols">
        <div className="grid ">
          {books &&
            books.map((book: Book) => <CardBook key={book.id} book={book} />)}
        </div>
      </div>

      <div>
        <Pagination
          currentPage={page}
          totalPages={totalPages || 0}
          onPageChange={handleChangePage}
        />
      </div>
    </div>
  );
};

export default BookLibraryView;
