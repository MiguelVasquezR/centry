"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ImagePlus, Info, Layers, ListChecks, Sparkles } from "lucide-react";
import {
  useCreateBookMutation,
  useUpdateBookMutation,
  useLazyGetBookByIdQuery,
} from "@/src/redux/store/api/booksApi";
import type { Book } from "@/src/types/book";
import toast from "react-hot-toast";
import BookShelfMap, { DEFAULT_SHELVES } from "@/src/component/BookShelfMap";
import Loader from "@/src/component/Loader";

const SHELVES = DEFAULT_SHELVES;
const SHELF_LABELS: Record<string, string> = SHELVES.reduce(
  (acc, shelf) => {
    acc[shelf.id] = shelf.label;
    return acc;
  },
  {} as Record<string, string>
);

// Zod schema for book validation
const bookSchema = z.object({
  titulo: z.string().min(1, "El título es requerido"),
  author: z.string().min(1, "El autor es requerido"),
  descripcion: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  editorial: z.string().min(1, "La editorial es requerida"),
  anioPublicacion: z.string().min(4, "El año de publicación es requerido"),
  numPag: z.string().min(1, "El número de páginas es requerido"),
  tipo: z.string().min(1, "El tipo de libro es requerido"),
  ubicacion: z.object({
    repisa: z.string().min(1, "Selecciona una repisa"),
    col: z
      .number()
      .int("Selecciona una columna válida")
      .min(0, "Selecciona una columna válida"),
    row: z
      .number()
      .int("Selecciona una fila válida")
      .min(0, "Selecciona una fila válida"),
  }),
});

type BookFormData = z.infer<typeof bookSchema>;

interface BookFormProps {
  bookId?: string;
  mode?: "add" | "edit";
}

const BookForm = ({ bookId, mode = "add" }: BookFormProps) => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [addBook, { isLoading: isAddingBook }] = useCreateBookMutation();
  const [updateBook, { isLoading: isUpdatingBook }] = useUpdateBookMutation();

  // Fetch book data if in edit mode
  const [getBookById, { data: bookData, isLoading: isLoadingBook }] = useLazyGetBookByIdQuery();
  const book = bookData;

  // Trigger query when in edit mode
  useEffect(() => {
    if (mode === "edit" && bookId) {
      getBookById(bookId);
    }
  }, [mode, bookId, getBookById]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
    setValue,
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
  defaultValues: {
      titulo: "",
      author: "",
      descripcion: "",
      editorial: "",
      anioPublicacion: "",
      numPag: "",
      tipo: "",
      ubicacion: {
        repisa: "",
        col: 0,
        row: 0,
      },
    },
  });

  // Update form when book data is loaded
  useEffect(() => {
    if (book && mode === "edit") {
      reset({
        titulo: book.titulo || "",
        author: book.autor || "",
        descripcion: book.descripcion || "",
        editorial: book.editorial || "",
        anioPublicacion: book.anioPublicacion || "",
        numPag: book.numPag || "",
        tipo: book.tipo || "",
        ubicacion: {
          repisa: book.ubicacion?.repisa || "",
          col: Number.isFinite(Number(book.ubicacion?.col))
            ? Number(book.ubicacion?.col)
            : 0,
          row: Number.isFinite(Number(book.ubicacion?.row))
            ? Number(book.ubicacion?.row)
            : 0,
        },
      });
      setImagePreview(book.imagen || "");
    }
  }, [book, mode, reset]);

  const watchedTitle = watch("titulo");
  const watchedAuthor = watch("author");
  const watchedDescripcion = watch("descripcion");
  const watchedEditorial = watch("editorial");
  const watchedYear = watch("anioPublicacion");
  const watchedPages = watch("numPag");
  const watchedType = watch("tipo");
  const watchedLocation = watch("ubicacion");

  const watchedShelf = watchedLocation?.repisa ?? "";
  const watchedCol =
    typeof watchedLocation?.col === "number" ? watchedLocation.col : null;
  const watchedRow =
    typeof watchedLocation?.row === "number" ? watchedLocation.row : null;

  const selectedShelfId = watchedShelf;

  const descriptionValue = watchedDescripcion || "";
  const descriptionWordCount = descriptionValue
    ? descriptionValue.trim().split(/\s+/).filter(Boolean).length
    : 0;

  const completionChecklist = [
    Boolean(watchedTitle),
    Boolean(watchedAuthor),
    Boolean(descriptionValue && descriptionValue.length >= 10),
    Boolean(watchedEditorial),
    Boolean(watchedYear),
    Boolean(watchedType),
    Boolean(watchedShelf),
    Boolean(imagePreview),
  ];

  const handleShelfChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newShelfId = event.target.value;

    if (!newShelfId) {
      setValue(
        "ubicacion",
        {
          repisa: "",
          row: 0,
          col: 0,
        },
        { shouldDirty: true, shouldTouch: true }
      );
      return;
    }

    const shelfDefinition = SHELVES.find((shelf) => shelf.id === newShelfId);
    const currentRow =
      typeof watchedRow === "number" && shelfDefinition && watchedRow < shelfDefinition.rows
        ? watchedRow
        : 0;
    const currentCol =
      typeof watchedCol === "number" && shelfDefinition && watchedCol < shelfDefinition.cols
        ? watchedCol
        : 0;

    setValue(
      "ubicacion",
      {
        repisa: newShelfId,
        row: currentRow,
        col: currentCol,
      },
      { shouldDirty: true, shouldTouch: true }
    );
  };

  const completion =
    completionChecklist.length > 0
      ? Math.round(
          (completionChecklist.filter(Boolean).length /
            completionChecklist.length) *
            100
        )
      : 0;

  const setPreviewFromFile = (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewFromFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setPreviewFromFile(file);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "dvt4vznxn"); // Using your existing cloud name

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dvt4vznxn/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      toast.error("Error al subir la imagen. Por favor, intenta de nuevo.");
      throw new Error("Error uploading image");
    }
  };

  const onFormSubmit = async (data: BookFormData) => {
    setIsUploading(true);

    try {
      let imageUrl =
        bookData?.imagen ||
        bookData?.image ||
        "https://res.cloudinary.com/dvt4vznxn/image/upload/v1758764097/138617_ar3v0q.jpg";

      if (selectedImage) {
        imageUrl = await uploadToCloudinary(selectedImage);
      }

      const bookPayload: Omit<Book, "id"> = {
        ...data,
        autor: data.author,
        image: imageUrl,
        imagen: imageUrl,
      };

      if (mode === "edit" && bookId) {
        // Update existing book
        console.log("Updating book with payload:", {
          ...bookPayload,
          id: bookId,
        });
        await updateBook({ ...bookPayload, id: bookId });
        toast.success("Libro actualizado correctamente");
      } else {
        // Create new book
        console.log("Creating book with payload:", bookPayload);
        await addBook(bookPayload);
        toast.success("Libro agregado correctamente");
      }

      router.push("/book");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        `Error al ${
          mode === "edit" ? "actualizar" : "agregar"
        } el libro. Por favor, intenta de nuevo.`
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Show loading state when fetching book data in edit mode
  if (mode === "edit" && isLoadingBook) {
    return <Loader />;
  }

  return (
    <div className="container">
      <br />

      <div className="card mb-5">
        <div className="card-content">
          <div className="level is-align-items-center is-mobile">
            <div className="level-left">
              <div className="level-item">
                <button
                  type="button"
                  className="button is-light is-medium"
                  onClick={() => router.back()}
                >
                  <ChevronLeft className="mr-2" />
                  Volver
                </button>
              </div>
              <div className="level-item">
                <div>
                  <p className="title is-4 mb-1">
                    {mode === "edit"
                      ? "Editar registro de libro"
                      : "Agregar nuevo libro"}
                  </p>
                  <p className="subtitle is-6 has-text-grey">
                    Completa la ficha bibliográfica para mantener ordenada la biblioteca.
                  </p>
                  <div className="tags">
                    <span className="tag is-info is-light">
                      <Sparkles size={14} style={{ marginRight: 6 }} />
                      Curaduría editorial
                    </span>
                    <span className="tag is-light">
                      <ListChecks size={14} style={{ marginRight: 6 }} />
                      {completion}% completado
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="level-right is-hidden-mobile">
              <div className="level-item" style={{ minWidth: "220px" }}>
                <progress
                  className="progress is-primary is-small"
                  value={completion}
                  max={100}
                >
                  {completion}%
                </progress>
                <p className="is-size-7 has-text-grey has-text-right mt-1">
                  Guarda el registro al llegar al 100 %
                </p>
              </div>
            </div>
          </div>
          <div className="is-hidden-tablet mt-3">
            <progress
              className="progress is-primary is-small"
              value={completion}
              max={100}
            >
              {completion}%
            </progress>
            <p className="is-size-7 has-text-grey mt-1">
              Guarda el registro al llegar al 100 %
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="columns is-variable is-5">
          <div className="column is-8-desktop is-12-tablet">
            <div className="card mb-5">
              <div className="card-content">
                <div className="is-flex is-justify-content-space-between is-align-items-center mb-3">
                  <div>
                    <h3 className="title is-5 mb-1">Ficha principal</h3>
                    <p className="is-size-7 has-text-grey">
                      Identifica el libro con información esencial.
                    </p>
                  </div>
                </div>

                <div className="columns is-variable is-4">
                  <div className="column">
                    <div className="field">
                      <label className="label">Título *</label>
                      <div className="control">
                        <input
                          className={`input ${errors.titulo ? "is-danger" : ""}`}
                          type="text"
                          placeholder="Ej. La casa de los espíritus"
                          {...register("titulo")}
                        />
                      </div>
                      {errors.titulo && (
                        <p className="help is-danger">{errors.titulo.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <label className="label">Autor *</label>
                      <div className="control">
                        <input
                          className={`input ${errors.author ? "is-danger" : ""}`}
                          type="text"
                          placeholder="Nombre y apellido"
                          {...register("author")}
                        />
                      </div>
                      {errors.author && (
                        <p className="help is-danger">{errors.author.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="field">
                  <div className="is-flex is-align-items-center is-justify-content-space-between mb-2">
                    <label className="label mb-0">Descripción *</label>
                    <span className="tag is-light is-info">
                      {descriptionWordCount}{" "}
                      {descriptionWordCount === 1 ? "palabra" : "palabras"}
                    </span>
                  </div>
                  <div className="control">
                    <textarea
                      className={`textarea ${
                        errors.descripcion ? "is-danger" : ""
                      }`}
                      placeholder="Describe la trama, el tono o la relevancia del libro en no más de 3 párrafos."
                      rows={6}
                      {...register("descripcion")}
                      style={{ minHeight: 140, maxHeight: 320 }}
                    />
                  </div>
                  {errors.descripcion && (
                    <p className="help is-danger">{errors.descripcion.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="card mb-5">
              <div className="card-content">
                <h3 className="title is-5 mb-3">Detalles editoriales</h3>
                <div className="columns is-variable is-4">
                  <div className="column">
                    <div className="field">
                      <label className="label">Editorial *</label>
                      <div className="control">
                        <input
                          className={`input ${errors.editorial ? "is-danger" : ""}`}
                          type="text"
                          placeholder="Editorial"
                          {...register("editorial")}
                        />
                      </div>
                      {errors.editorial && (
                        <p className="help is-danger">
                          {errors.editorial.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <label className="label">Año de publicación *</label>
                      <div className="control">
                        <input
                          className={`input ${
                            errors.anioPublicacion ? "is-danger" : ""
                          }`}
                          type="text"
                          placeholder="Ej. 1992"
                          maxLength={4}
                          {...register("anioPublicacion")}
                        />
                      </div>
                      {errors.anioPublicacion && (
                        <p className="help is-danger">
                          {errors.anioPublicacion.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="columns is-variable is-4">
                  <div className="column">
                    <div className="field">
                      <label className="label">Número de páginas *</label>
                      <div className="control">
                        <input
                          className={`input ${errors.numPag ? "is-danger" : ""}`}
                          type="text"
                          placeholder="Ej. 384"
                          {...register("numPag")}
                        />
                      </div>
                      {errors.numPag && (
                        <p className="help is-danger">{errors.numPag.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <label className="label">Tipo *</label>
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select
                            className={errors.tipo ? "is-danger" : ""}
                            {...register("tipo")}
                          >
                            <option value="">Seleccionar tipo</option>
                            <option value="Novela">Novela</option>
                            <option value="Ensayo">Ensayo</option>
                            <option value="Poesía">Poesía</option>
                            <option value="Teatro">Teatro</option>
                            <option value="Biografía">Biografía</option>
                            <option value="Historia">Historia</option>
                            <option value="Ciencia">Ciencia</option>
                            <option value="Técnico">Técnico</option>
                            <option value="Infantil">Infantil</option>
                            <option value="Otro">Otro</option>
                          </select>
                        </div>
                      </div>
                      {errors.tipo && (
                        <p className="help is-danger">{errors.tipo.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card mb-5">
              <div className="card-content">
                <div className="is-flex is-align-items-center is-justify-content-space-between mb-3">
                  <h3 className="title is-5 mb-0">
                    <span className="icon-text">
                      <span className="icon">
                        <Layers size={18} />
                      </span>
                      <span>Ubicación en biblioteca</span>
                    </span>
                  </h3>
                  <span className="tag is-light is-size-7">
                    Facilita la entrega presencial
                  </span>
                </div>

                <div className="field">
                  <label className="label">Repisa *</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select
                        className={errors.ubicacion?.repisa ? "is-danger" : ""}
                        value={selectedShelfId}
                        onChange={handleShelfChange}
                      >
                        <option value="">Selecciona una repisa</option>
                        {SHELVES.map((shelf) => (
                          <option key={shelf.id} value={shelf.id}>
                            {shelf.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {errors.ubicacion?.repisa && (
                    <p className="help is-danger">
                      {errors.ubicacion.repisa.message}
                    </p>
                  )}
                </div>

                {selectedShelfId ? (
                  <Controller
                    control={control}
                    name="ubicacion"
                    render={({ field }) => {
                      const shelfDefinition = SHELVES.find(
                        (shelf) => shelf.id === selectedShelfId
                      );
                      const fieldValue =
                        field.value && Number(field.value.repisa) === Number(selectedShelfId)
                          ? field.value
                          : {
                              repisa: Number(selectedShelfId),
                              row: 0,
                              col: 0,
                            };

                      return (
                        <BookShelfMap
                          mode="select"
                          shelves={SHELVES}
                          activeShelfId={selectedShelfId}
                          value={
                            fieldValue
                              ? {
                                  repisa: Number(fieldValue.repisa),
                                  row: fieldValue.row,
                                  col: fieldValue.col,
                                }
                              : null
                          }
                          onChange={(location) => {
                            const normalized = {
                              repisa: Number(selectedShelfId),
                              row:
                                shelfDefinition &&
                                location.row < shelfDefinition.rows
                                  ? location.row
                                  : 0,
                              col:
                                shelfDefinition &&
                                location.col < shelfDefinition.cols
                                  ? location.col
                                  : 0,
                            };
                            field.onChange(normalized);
                          }}
                        />
                      );
                    }}
                  />
                ) : (
                  <div className="notification is-light is-size-7">
                    Selecciona una repisa para mostrar la cuadrícula y elegir
                    una posición.
                  </div>
                )}

                {errors.ubicacion?.col && (
                  <p className="help is-danger mt-3">
                    {errors.ubicacion.col.message}
                  </p>
                )}
                {errors.ubicacion?.row && (
                  <p className="help is-danger">
                    {errors.ubicacion.row.message}
                  </p>
                )}

                <p className="help has-text-grey mt-3">
                  {selectedShelfId && watchedCol !== null && watchedRow !== null
                    ? `Seleccionado: ${SHELF_LABELS[selectedShelfId] ?? selectedShelfId} · fila ${watchedRow} · columna ${watchedCol}`
                    : "Selecciona cualquier recuadro. Las coordenadas comienzan en 0 (fila, columna)."}
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-content">
                <div className="is-flex is-align-items-center is-justify-content-space-between is-flex-wrap-wrap">
                  <p className="is-size-7 has-text-grey">
                    Verifica los datos antes de guardar. Siempre podrás editar el registro posteriormente.
                  </p>
                  <button
                    type="submit"
                    className={`button is-primary is-medium has-text-weight-semibold ${
                      isUploading || isAddingBook || isUpdatingBook
                        ? "is-loading"
                        : ""
                    }`}
                    disabled={isUploading || isAddingBook || isUpdatingBook}
                  >
                    {mode === "edit" ? "Guardar cambios" : "Registrar libro"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="column is-4-desktop is-12-tablet">
            <div style={{ position: "sticky", top: "2rem" }}>
              <div className="card mb-4">
                <div className="card-content">
                  <h3 className="title is-5">Carátula</h3>
                  <p className="is-size-7 has-text-grey">
                    La imagen ayuda a reconocer el libro rápidamente en la biblioteca digital.
                  </p>
                  <label
                    htmlFor="book-cover"
                    className={`is-flex is-flex-direction-column is-align-items-center is-justify-content-center has-text-centered mt-4 p-5 ${
                      isDragActive ? "has-background-primary-light" : "has-background-light"
                    }`}
                    style={{
                      border: `2px dashed ${isDragActive ? "#485fc7" : "#d7d8dd"}`,
                      borderRadius: "18px",
                      transition: "border-color 0.2s ease",
                      cursor: "pointer",
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <ImagePlus size={36} className="mb-2" />
                    <span className="is-size-6 has-text-weight-semibold">
                      Arrastra la portada aquí
                    </span>
                    <span className="is-size-7 has-text-grey">
                      o <span className="has-text-link">haz clic para buscarla</span>
                    </span>
                    <input
                      id="book-cover"
                      className="is-hidden"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                    />
                  </label>
                  <p className="is-size-7 has-text-grey mt-2">
                    Formato recomendado: JPG o PNG (mínimo 600 × 900 px).
                  </p>
                  {imagePreview && (
                    <figure
                      className="image is-3by4 mt-4"
                      style={{
                        maxWidth: "240px",
                        margin: "0 auto",
                        borderRadius: "16px",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <Image
                        src={imagePreview}
                        alt="Previsualización de portada"
                        fill
                        sizes="240px"
                        style={{ objectFit: "cover" }}
                      />
                    </figure>
                  )}
                </div>
              </div>

              <div className="card">
                <div className="card-content">
                  <h4 className="title is-6 mb-3">Resumen del registro</h4>
                  <div className="notification is-light">
                    <p className="is-size-7">
                      <strong>Título:</strong> {watchedTitle || "Sin título"}
                    </p>
                    <p className="is-size-7">
                      <strong>Autoría:</strong>{" "}
                      {watchedAuthor || "Autor por definir"}
                    </p>
                    <p className="is-size-7">
                      <strong>Editorial:</strong>{" "}
                      {watchedEditorial || "Sin editorial"}
                    </p>
                    <p className="is-size-7">
                      <strong>Páginas:</strong> {watchedPages || "—"}
                    </p>
                    <p className="is-size-7">
                      <strong>Ubicación:</strong>{" "}
                      {watchedShelf && watchedCol !== null && watchedRow !== null
                        ? `${SHELF_LABELS[watchedShelf] ?? watchedShelf} · fila ${watchedRow} · columna ${watchedCol}`
                        : "Sin asignar"}
                    </p>
                  </div>
                  <progress
                    className="progress is-primary is-small"
                    value={completion}
                    max={100}
                  >
                    {completion}%
                  </progress>
                  <p className="is-size-7 has-text-grey">
                    Avance del registro bibliográfico.
                  </p>
                  <div className="notification is-info is-light mt-3 is-flex is-align-items-center">
                    <Info size={14} style={{ marginRight: 8 }} />
                    <span className="is-size-7">
                      Verifica que la ubicación coincida con la etiqueta física del libro.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <br />
    </div>
  );
};

export default BookForm;
