"use client";

import CardMovie from "@/src/component/CardMovie";
import Pagination from "@/src/component/Pagination";
import { useLazyFetchMoviesQuery } from "@/src/redux/store/api/moviesApi";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const MoviesLibraryView = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");

  const [getMore, { data: dataMovies, isLoading: moviesIsLoading, error }] =
    useLazyFetchMoviesQuery();

  const { movies = [], totalPages = 0 } = dataMovies || {};

  useEffect(() => {
    getMore({ page, limit });
  }, []);

  useEffect(() => {
    handleChangePage(page);
  }, [page, limit]);

  useEffect(() => {
    if (error) {
      toast.error(
        "Error al cargar las películas. Por favor, intenta nuevamente."
      );
    }
  }, [error]);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
    getMore({ page: newPage, limit });
  };

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      movie.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.director.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre
      ? movie.genero.toLowerCase() === selectedGenre.toLowerCase()
      : true;
    return matchesSearch && matchesGenre;
  });

  if (moviesIsLoading) {
    return <div className="loading">Loading</div>;
  }

  return (
    <div className="container">
      <br />
      <div className="is-flex is-justify-content-space-between is-align-items-center">
        <p className="is-size-4 has-text-weight-bold">Cineteca</p>
        <div>
          <Link
            href="/movies/add"
            className="button is-primary has-text-white has-text-weight-semibold"
          >
            Agregar película
          </Link>
        </div>
      </div>

      <br />

      <div className="box">
        <div className="columns is-variable is-3">
          <div className="column is-6">
            <input
              type="text"
              className="input"
              placeholder="Buscar por título o director"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="column is-6">
            <div className="is-flex is-flex-wrap-wrap is-justify-content-flex-end is-gap-2">
              <div className="select">
                <select
                  value={selectedGenre}
                  onChange={(event) => setSelectedGenre(event.target.value)}
                >
                  <option value="">Todos los géneros</option>
                  <option value="documental">Documental</option>
                  <option value="ficción">Ficción</option>
                  <option value="drama">Drama</option>
                  <option value="acción">Acción</option>
                  <option value="animación">Animación</option>
                </select>
              </div>

              <div className="select">
                <select
                  onChange={(event) => {
                    event.preventDefault();
                    setLimit(parseInt(event.currentTarget.value));
                  }}
                  value={limit}
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1)
                    .concat(Array.from({ length: 9 }, (_, i) => (i + 2) * 10))
                    .map((num) => (
                      <option key={num} value={num}>
                        {num} por página
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed-grid has-4-cols">
        <div className="grid">
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
              <CardMovie key={movie.id} movie={movie} />
            ))
          ) : (
            <div className="column is-12 has-text-centered py-6">
              <p className="is-size-5 has-text-grey">
                No encontramos películas con los filtros actuales.
              </p>
            </div>
          )}
        </div>
      </div>

      <div>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handleChangePage}
        />
      </div>
    </div>
  );
};

export default MoviesLibraryView;
