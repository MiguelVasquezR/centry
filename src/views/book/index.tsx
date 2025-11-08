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
import PageHeader from "@/src/component/PageHeader";

const BookLibraryView = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedShelf, setSelectedShelf] = useState("");

  const { data: currentUser, isLoading: isLoadingCurrentUser } =
    useGetCurrentUserQuery(undefined);
  const { rol = "student" } = currentUser || {};

  const [getMore, { data: dataBooks, isLoading: isLoadingBooks, error }] =
    useLazyFetchBooksQuery();

  const { books = [], totalPages } = dataBooks || {};

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const FILTER_FETCH_LIMIT = 500;
  const isFilteringActive =
    Boolean(normalizedSearch) ||
    Boolean(selectedCategory) ||
    Boolean(selectedShelf);

  useEffect(() => {
    const fetchParams = isFilteringActive
      ? { page: 1, limit: FILTER_FETCH_LIMIT }
      : { page, limit };
    getMore(fetchParams);
  }, [getMore, isFilteringActive, limit, page]);

  useEffect(() => {
    if (error) {
      toast.error("Error al cargar los libros. Por favor, intenta de nuevo.");
    }
  }, [error]);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const categories = Array.from(
    new Set(
      books
        .map((book: Book) => book.tipo?.trim())
        .filter((value): value is string => Boolean(value))
    )
  ).sort((a, b) => a.localeCompare(b));

  const shelves = Array.from(
    new Set(
      books
        .map((book: Book) => {
          const shelf =
            book.ubicacion?.repisa ??
            book.ubicacion?.respisa ??
            book.ubicacion?.row ??
            "";
          return typeof shelf === "number" ? String(shelf) : shelf?.toString();
        })
        .filter((value): value is string => Boolean(value))
    )
  ).sort((a, b) => a.localeCompare(b));

  const filteredBooks = books.filter((book: Book) => {
    const title = (book.titulo ?? "").toLowerCase();
    const author = (book.autor ?? book.author ?? "").toLowerCase();
    const matchesSearch = normalizedSearch
      ? title.includes(normalizedSearch) || author.includes(normalizedSearch)
      : true;
    const matchesCategory = selectedCategory
      ? (book.tipo ?? "").toLowerCase() === selectedCategory.toLowerCase()
      : true;
    const normalizedShelf =
      book.ubicacion?.repisa ??
      book.ubicacion?.respisa ??
      book.ubicacion?.row ??
      "";
    const matchesShelf = selectedShelf
      ? String(normalizedShelf).toLowerCase() === selectedShelf.toLowerCase()
      : true;

    return matchesSearch && matchesCategory && matchesShelf;
  });

  if (isLoadingBooks || isLoadingCurrentUser) {
    return <Loader />;
  }

  return (
    <div className="container">
      <br />
      <PageHeader
        title="Biblioteca"
        description="Explora y administra el catálogo de libros."
        hideBack
        actions={
          rol === "admin" ? (
            <Link
              href="/book/add"
              className="button is-primary has-text-white has-text-weight-semibold"
            >
              Agregar libro
            </Link>
          ) : undefined
        }
      />

      <div className="box">
        <div className="columns">
          <div className="column">
            <input
              type="text"
              className="input"
              placeholder="Buscar por título o autor"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="column is-4">
            <div className="select mx-2">
              <select
                value={selectedCategory}
                onChange={(event) => {
                  setSelectedCategory(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="select mx-2">
              <select
                value={selectedShelf}
                onChange={(event) => {
                  setSelectedShelf(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">Todas las repisas</option>
                {shelves.map((shelf) => (
                  <option key={shelf} value={shelf}>
                    {shelf}
                  </option>
                ))}
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
          {filteredBooks.length ? (
            filteredBooks.map((book: Book) => (
              <CardBook key={book.id} book={book} />
            ))
          ) : (
            <div className="column is-12">
              <div className="notification is-light has-text-centered">
                No encontramos libros con los filtros aplicados.
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        {!isFilteringActive && (
          <Pagination
            currentPage={page}
            totalPages={totalPages || 0}
            onPageChange={handleChangePage}
          />
        )}
      </div>
    </div>
  );
};

export default BookLibraryView;
