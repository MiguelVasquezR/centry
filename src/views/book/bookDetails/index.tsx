"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLazyGetBookByIdQuery } from "../../../redux/store/api/booksApi";
import { Book } from "@/src/types/book";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";

const BookDetailsView = () => {
  const [book, setBook] = useState<Book>();
  const { id: idBook } = useParams();
  const router = useRouter();

  const [getBookById, { data: dataBook, isLoading: isLoadingBook }] =
    useLazyGetBookByIdQuery();

  useEffect(() => {
    if (idBook && typeof idBook === "string") {
      getBookById(idBook);
    }
  }, [idBook, getBookById]);

  useEffect(() => {
    setBook(dataBook);
  }, [dataBook]);

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
              <button className="button is-primary is-outlined">
                Comentar
              </button>
            </div>
          </div>
        </div>

        <div className="column">
          <div className="is-flex is-justify-content-center is-flex-direction-column is-align-items-center is-gap-2">
            <Image
              src={book?.imagen || ""}
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
        </div>
        <div className="column">
          <div>
            <p className="is-size-5 has-text-weight-bold">Comentarios</p>
            <br />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsView;
