"use client";
import CardBook from "@/src/component/CardBook";
import Pagination from "@/src/component/Pagination";
import { useLazyFetchBooksQuery } from "@/src/redux/store/api/booksApi";
import Link from "next/link";
import { useEffect, useState } from "react";

const BookLibraryView = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const [getMore, { data: dataBooks, isLoading: booksIsLoading }] =
    useLazyFetchBooksQuery();

  const { books, totalPages } = dataBooks || {};

  useEffect(() => {
    getMore({ page: page, limit });
  }, []);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
    getMore({ page: newPage, limit });
  };

  if (booksIsLoading) {
    return <div className="loading">Loading</div>;
  }

  return (
    <div className="container">
      <br />
      <div className="is-flex is-justify-content-space-between is-align-items-center">
        <p className="is-size-4">Biblioteca</p>
        <div>
          <Link href={"/book/add"} className="button is-primary has-text-white">
            Agregar Libro
          </Link>
        </div>
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
          </div>
        </div>
      </div>

      <div className="fixed-grid has-4-cols">
        <div className="grid ">
          {books && books.map((book) => <CardBook key={book.id} book={book} />)}
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
