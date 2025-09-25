"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetBookByIdQuery } from "../../../redux/store/api/booksApi";

interface BookDetailsViewProps {
  bookId: string;
}

const BookDetailsView = ({ bookId }: BookDetailsViewProps) => {
  const { data: book, isLoading, error } = useGetBookByIdQuery(bookId);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [readingStatus, setReadingStatus] = useState("want-to-read");
  const router = useRouter();

  // In a real app, you'd fetch book data using params.id
  // Loading state
  if (isLoading) {
    return (
      <div className="container">
        <div className="has-text-centered" style={{ padding: "4rem" }}>
          <div className="is-size-2">📚</div>
          <p className="title is-4">Cargando libro...</p>
          <progress className="progress is-primary" max="100">
            15%
          </progress>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !book) {
    return (
      <div className="container">
        <div className="has-text-centered" style={{ padding: "4rem" }}>
          <div className="is-size-2">❌</div>
          <p className="title is-4">Libro no encontrado</p>
          <p className="subtitle is-6">
            El libro que buscas no existe o no se pudo cargar.
          </p>
          <Link href="/book" className="button is-primary">
            <ChevronLeft className="mr-2" />
            Volver a la biblioteca
          </Link>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container">
        <div className="has-text-centered py-6">
          <h1 className="title">Libro no encontrado</h1>
          <Link href="/book" className="button is-primary">
            Volver a la Biblioteca
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToWishlist = () => {
    setIsInWishlist(!isInWishlist);
  };

  const handleReadingStatusChange = (status: string) => {
    setReadingStatus(status);
  };

  return (
    <div className="container">
      <br />

      {/* Back button */}
      <div className="mb-4">
        <ChevronLeft
          className="is-clickable"
          size={32}
          onClick={() => {
            router.back();
          }}
        />
      </div>

      <div className="columns">
        {/* Book cover and action buttons */}
        <div className="column is-one-third">
          <div className="has-text-centered">
            <figure className="image is-inline-block mb-4">
              <Image
                src={book.image}
                alt={book.titulo}
                width={300}
                height={450}
                className="book-detail-cover"
                style={{
                  objectFit: "cover",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              />
            </figure>

            {/* Action buttons */}
            <div className="buttons is-centered mb-4">
              <button
                className={`button is-medium ${
                  readingStatus === "want-to-read" ? "is-warning" : "is-light"
                }`}
                onClick={() => handleReadingStatusChange("want-to-read")}
              >
                <span className="icon">
                  <i className="fas fa-bookmark"></i>
                </span>
                <span>Quiero Leer</span>
              </button>
            </div>

            <div className="buttons is-centered mb-4">
              <button
                className={`button is-medium ${
                  readingStatus === "reading" ? "is-info" : "is-light"
                }`}
                onClick={() => handleReadingStatusChange("reading")}
              >
                <span className="icon">
                  <i className="fas fa-book-open"></i>
                </span>
                <span>Leyendo</span>
              </button>
            </div>

            <div className="buttons is-centered mb-4">
              <button
                className={`button is-medium ${
                  readingStatus === "read" ? "is-success" : "is-light"
                }`}
                onClick={() => handleReadingStatusChange("read")}
              >
                <span className="icon">
                  <i className="fas fa-check"></i>
                </span>
                <span>Leído</span>
              </button>
            </div>

            <div className="buttons is-centered">
              <button
                className={`button is-medium ${
                  isInWishlist ? "is-danger" : "is-light"
                }`}
                onClick={handleAddToWishlist}
              >
                <span className="icon">
                  <i
                    className={`fas ${isInWishlist ? "fa-heart" : "fa-heart"}`}
                  ></i>
                </span>
                <span>
                  {isInWishlist ? "En Favoritos" : "Agregar a Favoritos"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Book information */}
        <div className="column is-two-thirds">
          <div className="content">
            <h1 className="title is-2 mb-2">{book.titulo}</h1>
            <h2 className="subtitle is-4 has-text-grey mb-4">
              por {book.author}
            </h2>

            {/* Book metadata */}
            <div className="box mb-4">
              <div className="columns is-mobile">
                <div className="column">
                  <p className="heading">Editorial</p>
                  <p className="title is-6">{book.editorial}</p>
                </div>
                <div className="column">
                  <p className="heading">Año de Publicación</p>
                  <p className="title is-6">{book.anioPublicacion}</p>
                </div>
                <div className="column">
                  <p className="heading">Páginas</p>
                  <p className="title is-6">{book.numPag}</p>
                </div>
                <div className="column">
                  <p className="heading">Tipo</p>
                  <p className="title is-6">{book.tipo}</p>
                </div>
              </div>
            </div>

            {/* Location information */}
            <div className="box mb-4">
              <h3 className="title is-5 mb-3">
                <span className="icon-text">
                  <span className="icon has-text-info">
                    <i className="fas fa-map-marker-alt"></i>
                  </span>
                  <span>Ubicación en Biblioteca</span>
                </span>
              </h3>
              <div className="columns is-mobile">
                <div className="column">
                  <p className="heading">Repisa</p>
                  <span className="tag is-info is-medium">
                    {book.ubicacion.repisa}
                  </span>
                </div>
                <div className="column">
                  <p className="heading">Columna</p>
                  <span className="tag is-primary is-medium">
                    {book.ubicacion.col}
                  </span>
                </div>
                <div className="column">
                  <p className="heading">Fila</p>
                  <span className="tag is-success is-medium">
                    {book.ubicacion.row}
                  </span>
                </div>
              </div>
              <div className="notification is-light mt-3">
                <p>
                  <strong>Ubicación completa:</strong> Repisa{" "}
                  {book.ubicacion.repisa}, Columna {book.ubicacion.col}, Fila{" "}
                  {book.ubicacion.row}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="box">
              <h3 className="title is-5 mb-3">Descripción</h3>
              <div className="content">
                <p style={{ textAlign: "justify", lineHeight: "1.6" }}>
                  {book.descripcion}
                </p>
              </div>
            </div>

            {/* Additional actions */}
            <div className="box">
              <h3 className="title is-5 mb-3">Acciones</h3>
              <div className="buttons">
                <Link
                  href={`/book/edit/${book.id}`}
                  className="button is-warning"
                >
                  <span className="icon">
                    <i className="fas fa-edit"></i>
                  </span>
                  <span>Editar Libro</span>
                </Link>
                <button className="button is-info">
                  <span className="icon">
                    <i className="fas fa-share"></i>
                  </span>
                  <span>Compartir</span>
                </button>
                <button className="button is-danger">
                  <span className="icon">
                    <i className="fas fa-trash"></i>
                  </span>
                  <span>Eliminar</span>
                </button>
              </div>
            </div>

            {/* Stats section (similar to the image) */}
            <div className="box">
              <h3 className="title is-5 mb-3">Estadísticas</h3>
              <div className="columns is-mobile has-text-centered">
                <div className="column">
                  <p className="heading">Veces Prestado</p>
                  <p className="title is-4 has-text-info">12</p>
                </div>
                <div className="column">
                  <p className="heading">Calificación Promedio</p>
                  <p className="title is-4 has-text-warning">4.2/5</p>
                </div>
                <div className="column">
                  <p className="heading">En Lista de Deseos</p>
                  <p className="title is-4 has-text-success">8</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <br />
    </div>
  );
};

export default BookDetailsView;
