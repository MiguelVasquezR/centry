"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLazyGetMovieByIdQuery } from "@/src/redux/store/api/moviesApi";
import { Movie } from "@/src/types/movie";
import Image from "next/image";
import PageHeader from "@/src/component/PageHeader";

const MovieDetailsView = () => {
  const [movie, setMovie] = useState<Movie>();
  const { id } = useParams();

  const [getMovieById, { data: dataMovie, isLoading: isLoadingMovie }] =
    useLazyGetMovieByIdQuery();

  useEffect(() => {
    if (id && typeof id === "string") {
      getMovieById(id);
    }
  }, [id, getMovieById]);

  useEffect(() => {
    if (dataMovie) {
      setMovie(dataMovie as Movie);
    }
  }, [dataMovie]);

  if (isLoadingMovie) {
    return <div className="loading">Loading</div>;
  }

  return (
    <div className="container">
      <br />
      <PageHeader
        title={movie?.titulo ?? "Detalle de película"}
        description={
          movie?.director
            ? `Dirigida por ${movie.director}${
                movie?.anioEstreno ? ` · ${movie.anioEstreno}` : ""
              }`
            : undefined
        }
      />

      <div className="columns">
        <div className="column is-two-thirds">
          <p className="title is-3">{movie?.titulo}</p>
          <p className="subtitle is-6 has-text-grey">
            Dirigida por{" "}
            <strong className="has-text-weight-semibold">
              {movie?.director}
            </strong>{" "}
            · {movie?.anioEstreno}
          </p>
          <div className="tags">
            <span className="tag is-info is-light">{movie?.genero}</span>
            <span className="tag is-light">{movie?.duracion}</span>
            <span className="tag is-light">{movie?.clasificacion}</span>
          </div>
          <br />
          <p className="is-size-5 has-text-weight-semibold">Sinopsis</p>
          <p className="mt-3">{movie?.sinopsis}</p>
        </div>

        <div className="column is-one-third">
          {movie?.imagen && (
            <figure
              className="image is-3by4"
              style={{
                borderRadius: "14px",
                overflow: "hidden",
                maxWidth: "280px",
                margin: "0 auto",
                position: "relative",
              }}
            >
              <Image
                src={movie.imagen}
                alt={`Carátula de ${movie.titulo}`}
                fill
                sizes="280px"
                style={{ objectFit: "cover" }}
              />
            </figure>
          )}
          <div className="mt-4 has-text-centered">
            <p className="is-size-6 has-text-grey">Disponible en</p>
            <p className="is-size-5 has-text-weight-semibold">
              {movie?.plataforma}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsView;
