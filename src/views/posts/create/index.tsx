"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Upload, X, Info, ListChecks, ImagePlus, Sparkles } from "lucide-react";
import Image from "next/image";
import { Book } from "../../../types/book";
import TipTapEditor from "../../../component/TipTapEditor";
import Select, { StylesConfig } from "react-select";
import { useCreatePostMutation } from "../../../redux/store/api/postsApi";
import { useGetBooksQuery } from "../../../redux/store/api/booksApi";
import Loader from "@/src/component/Loader";
import PageHeader from "@/src/component/PageHeader";

// Zod schema for post validation
const postSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  content: z.string().min(10, "El contenido debe tener al menos 10 caracteres"),
  authorId: z.string().min(1, "El autor es requerido"),
  preference: z.object({
    visibleBy: z.enum(["general", "generation"]),
    book: z.string().optional(),
  }),
});

type PostFormData = z.infer<typeof postSchema>;
type BookOption = { value: string; label: string };

const CreatePostView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookIdParam = searchParams.get("bookId");
  const [content, setContent] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const [createPost, { isLoading: isAddingPost }] = useCreatePostMutation();
  const { data: dataBooks, isLoading: isLoadingBooks } = useGetBooksQuery({});
  const bookOptions = useMemo<BookOption[]>(() => {
    const currentBooks = dataBooks?.data ?? [];
    return currentBooks.map((book: Book) => ({
      value: book.id,
      label: `${book.titulo} — ${book.author ?? book.autor}`,
    }));
  }, [dataBooks]);

  const defaultBookValue = useMemo(() => {
    if (
      bookIdParam &&
      bookOptions.some((option) => option.value === bookIdParam)
    ) {
      return bookIdParam;
    }

    return bookOptions[0]?.value;
  }, [bookIdParam, bookOptions]);

  const hasAppliedDefaultBook = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      authorId: "current-user-id", // TODO: Get from auth context
      preference: {
        visibleBy: "general",
        book: defaultBookValue,
      },
    },
  });

  useEffect(() => {
    if (hasAppliedDefaultBook.current) {
      return;
    }

    if (defaultBookValue) {
      setValue("preference.book", defaultBookValue, {
        shouldDirty: false,
        shouldTouch: false,
      });
      hasAppliedDefaultBook.current = true;
    }
  }, [defaultBookValue, setValue]);

  const watchedVisibility = watch("preference.visibleBy");
  const watchedTitle = watch("title");
  const plainContent = content.replace(/<[^>]*>/g, " ").trim();
  const wordCount = plainContent ? plainContent.split(/\s+/).length : 0;
  const completionFactors = [
    watchedTitle ? 1 : 0,
    plainContent.length >= 10 ? 1 : 0,
    selectedImages.length > 0 ? 1 : 0,
  ];
  const completion =
    completionFactors.length === 0
      ? 0
      : Math.round(
          (completionFactors.reduce((sum, factor) => sum + factor, 0) /
            completionFactors.length) *
            100
        );

  const addImages = (files: File[]) => {
    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (!validFiles.length) {
      alert("Solo se permiten archivos de imagen.");
      return;
    }

    const availableSlots = Math.max(0, 5 - selectedImages.length);

    if (availableSlots === 0) {
      alert("Máximo 5 imágenes permitidas");
      return;
    }

    const filesToAdd = validFiles.slice(0, availableSlots);

    setSelectedImages((prev) => [...prev, ...filesToAdd]);

    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    if (validFiles.length > filesToAdd.length) {
      alert("Se alcanzó el límite de 5 imágenes. Algunas no se agregaron.");
    }
  };

  const selectStyles: StylesConfig<BookOption, false> = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: 12,
      borderColor: state.isFocused ? "#3b5bfd" : "#d7d8dd",
      boxShadow: state.isFocused ? "0 0 0 1px #3b5bfd33" : "none",
      padding: "4px",
      minHeight: "44px",
      ":hover": {
        borderColor: "#3b5bfd",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 0.75rem",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#1f2937",
      fontWeight: 500,
    }),
    option: (provided, state) => ({
      ...provided,
      padding: "10px 14px",
      borderRadius: 8,
      backgroundColor: state.isFocused
        ? "rgba(59, 91, 253, 0.08)"
        : state.isSelected
        ? "#3b5bfd"
        : "transparent",
      color: state.isSelected ? "#fff" : "#1f2937",
      cursor: "pointer",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: 12,
      boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)",
      overflow: "hidden",
      border: "1px solid #eef1f8",
    }),
    menuList: (provided) => ({
      ...provided,
      padding: "8px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: state.isFocused ? "#3b5bfd" : "#94a3b8",
      ":hover": {
        color: "#3b5bfd",
      },
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: "#94a3b8",
      ":hover": {
        color: "#ef4444",
      },
    }),
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    addImages(files);
    event.target.value = "";
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
    const files = Array.from(event.dataTransfer.files || []);
    addImages(files);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "dvt4vznxn");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dvt4vznxn/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error uploading image");
      }

      const data = await response.json();
      return data.secure_url;
    } catch {
      throw new Error("Error uploading image to Cloudinary");
    }
  };

  const onFormSubmit = async (data: PostFormData) => {
    setIsUploading(true);

    try {
      let imageUrls: string[] = [];

      if (selectedImages.length > 0) {
        imageUrls = await Promise.all(
          selectedImages.map((image) => uploadToCloudinary(image))
        );
      }

      // Save to Firebase using RTK Query
      const normalizedPreference = {
        ...data.preference,
        book: data.preference.book ?? undefined,
      };

      const postData = {
        ...data,
        preference: normalizedPreference,
        content,
        imageUrl: imageUrls,
        createdAt: new Date(),
        authorId: localStorage.getItem("userId") || "",
        reactions: [],
        readings: [],
      };

      const result = await createPost(postData).unwrap();

      if (result.status === 200) {
        alert("¡Post creado exitosamente!");
        router.push("/posts"); // Redirect to posts list (you'll need to create this route)
      } else {
        throw new Error("Error al guardar el post");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error al crear el post. Por favor, intenta de nuevo.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoadingBooks) {
    return <Loader />;
  }

  return (
    <div className="container">
      <br />
      <PageHeader
        title="Crear nueva publicación"
        description="Comparte una actualización editorial con la comunidad."
        badges={
          <div className="tags">
            <span className="tag is-info is-light">
              <Sparkles size={14} style={{ marginRight: 6 }} />
              Inspira a tu comunidad
            </span>
            <span className="tag is-light">
              <ListChecks size={14} style={{ marginRight: 6 }} />
              {completion}% completado
            </span>
          </div>
        }
      >
        <div className="is-flex is-justify-content-flex-end">
          <div style={{ minWidth: "220px" }}>
            <progress
              className="progress is-primary is-small"
              value={completion}
              max={100}
            >
              {completion}%
            </progress>
            <p className="is-size-7 has-text-grey mt-1">
              Completa los campos para publicar
            </p>
          </div>
        </div>
      </PageHeader>

      <div className="columns is-variable is-5">
        <div className="column is-8-desktop is-12-tablet">
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="card mb-5">
              <div className="card-content">
                <div className="is-flex is-justify-content-space-between is-align-items-start">
                  <div>
                    <h2 className="title is-5 mb-1">Información principal</h2>
                    <p className="is-size-7 has-text-grey">
                      Define el título y el enfoque del post.
                    </p>
                  </div>
                  <span className="tag is-light">
                    <Info size={14} style={{ marginRight: 6 }} />
                    Campo requerido
                  </span>
                </div>

                <div className="field mt-4">
                  <label className="label">Título del post</label>
                  <div className="control">
                    <input
                      {...register("title")}
                      className={`input is-medium ${
                        errors.title ? "is-danger" : ""
                      }`}
                      type="text"
                      placeholder="Ej. Voces invisibles: nuevas autoras de la selva amazónica"
                    />
                  </div>
                  <p className="help">
                    Sé claro y directo. Este texto se mostrará en la tarjeta de
                    publicación.
                  </p>
                  {errors.title && (
                    <p className="help is-danger">{errors.title.message}</p>
                  )}
                </div>

                <div className="field">
                  <div className="is-flex is-align-items-center is-justify-content-space-between mb-2">
                    <label className="label mb-0">Contenido</label>
                    <span className="tag is-light is-info">
                      {wordCount} {wordCount === 1 ? "palabra" : "palabras"}
                    </span>
                  </div>
                  <div
                    className={`control ${errors.content ? "is-danger" : ""}`}
                  >
                    <TipTapEditor
                      content={content}
                      onChange={(newContent) => {
                        setContent(newContent);
                        setValue("content", newContent);
                      }}
                      placeholder="Comparte tus pensamientos, reflexiones o reseñas sobre libros..."
                    />
                  </div>
                  <p className="help">
                    Incluye contexto, citas o fragmentos. El editor soporta
                    formato enriquecido.
                  </p>
                  {errors.content && (
                    <p className="help is-danger">{errors.content.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="card mb-5">
              <div className="card-content">
                <div className="is-flex is-justify-content-space-between is-align-items-center">
                  <div>
                    <h2 className="title is-5 mb-1">Multimedia</h2>
                    <p className="is-size-7 has-text-grey">
                      Añade imágenes para ilustrar tu publicación (máx. 5
                      archivos).
                    </p>
                  </div>
                  <span className="tag is-light">
                    <Upload size={14} style={{ marginRight: 6 }} />
                    {selectedImages.length}/5
                  </span>
                </div>

                <label
                  htmlFor="post-images"
                  className={`is-flex is-flex-direction-column is-align-items-center is-justify-content-center has-text-centered mt-4 p-5 ${
                    isDragActive
                      ? "has-background-primary-light"
                      : "has-background-light"
                  }`}
                  style={{
                    border: `2px dashed ${
                      isDragActive ? "#485fc7" : "#d7d8dd"
                    }`,
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
                    Arrastra y suelta tus imágenes aquí
                  </span>
                  <span className="is-size-7 has-text-grey">
                    o{" "}
                    <span className="has-text-link">
                      haz clic para seleccionarlas
                    </span>
                  </span>
                  <input
                    id="post-images"
                    className="is-hidden"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                  />
                </label>

                <div className="mt-3">
                  <progress
                    className="progress is-info is-small"
                    value={selectedImages.length}
                    max={5}
                  >
                    {selectedImages.length}
                  </progress>
                  <p className="is-size-7 has-text-grey">
                    Sugerencia: utiliza imágenes horizontales en alta
                    resolución.
                  </p>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="columns is-multiline is-variable is-2 mt-4">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="column is-4-tablet is-6-mobile is-3-desktop"
                      >
                        <div
                          className="card is-clickable"
                          style={{ position: "relative" }}
                        >
                          <div className="card-image">
                            <figure
                              className="image is-square"
                              style={{
                                borderRadius: "16px",
                                overflow: "hidden",
                                position: "relative",
                              }}
                            >
                              <Image
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                fill
                                sizes="(max-width: 768px) 45vw, 140px"
                                style={{ objectFit: "cover" }}
                              />
                            </figure>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="button is-small is-white is-rounded"
                            style={{
                              position: "absolute",
                              top: 12,
                              right: 12,
                            }}
                            aria-label={`Eliminar imagen ${index + 1}`}
                          >
                            <X size={14} />
                          </button>
                          <div className="card-content py-2">
                            <p className="is-size-7 has-text-centered has-text-grey">
                              Imagen {index + 1}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-content">
                <div className="level is-align-items-center">
                  <div className="level-left">
                    <p className="is-size-7 has-text-grey">
                      Revisa la vista previa antes de publicar. Puedes editar en
                      cualquier momento.
                    </p>
                  </div>
                  <div className="level-right">
                    <button
                      type="submit"
                      className={`button is-primary has-text-white is-medium has-text-weight-semibold ${
                        isUploading || isAddingPost ? "is-loading" : ""
                      }`}
                      disabled={isUploading || isAddingPost}
                    >
                      Publicar ahora
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="column is-4-desktop is-12-tablet">
          <div style={{ position: "sticky", top: "2rem" }}>
            <div className="card mb-4">
              <div className="card-content">
                <h3 className="title is-5 mb-2">Preferencias</h3>
                <p className="is-size-7 has-text-grey mb-4">
                  Controla quién puede ver esta publicación y vincúlala con un
                  libro.
                </p>

                <input {...register("authorId")} type="hidden" />

                <div className="field">
                  <label className="label">Visibilidad</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select {...register("preference.visibleBy")}>
                        <option value="general">Público general</option>
                        <option value="generation">Mi generación</option>
                      </select>
                    </div>
                  </div>
                  {errors.preference?.visibleBy && (
                    <p className="help is-danger">
                      {errors.preference.visibleBy.message}
                    </p>
                  )}
                  <p className="help">
                    {watchedVisibility === "general"
                      ? "Visible para toda la comunidad"
                      : "Solo usuarios de tu generación podrán acceder"}
                  </p>
                </div>

                <div className="field">
                  <label className="label">Libro asociado (opcional)</label>
                  <Controller
                    control={control}
                    name="preference.book"
                    render={({ field }) => (
                      <Select<BookOption, false>
                        instanceId="associated-book-select"
                        inputId="associated-book-select"
                        options={bookOptions}
                        classNamePrefix="react-select"
                        placeholder="Selecciona un libro (opcional)"
                        isClearable
                        isSearchable
                        noOptionsMessage={() =>
                          bookOptions.length
                            ? "Sin coincidencias"
                            : "No hay libros disponibles"
                        }
                        value={
                          bookOptions.find(
                            (option) => option.value === field.value
                          ) ?? null
                        }
                        onChange={(option) =>
                          field.onChange(option ? option.value : undefined)
                        }
                        onBlur={field.onBlur}
                        styles={selectStyles}
                      />
                    )}
                  />
                  {errors.preference?.book && (
                    <p className="help is-danger">
                      {errors.preference.book.message}
                    </p>
                  )}
                  <p className="help">
                    Vincula la publicación con una lectura recomendada o deja el
                    campo vacío si no aplica.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-content">
                <h4 className="title is-6 mb-3">Vista previa rápida</h4>
                <div className="notification is-light">
                  <p className="is-size-7">
                    <strong>Título:</strong> {watchedTitle || "Sin título"}
                  </p>
                  <p className="is-size-7">
                    <strong>Extracto:</strong>{" "}
                    {plainContent
                      ? `${plainContent.slice(0, 120)}${
                          plainContent.length > 120 ? "..." : ""
                        }`
                      : "Sin contenido"}
                  </p>
                  <p className="is-size-7">
                    <strong>Imágenes:</strong> {selectedImages.length}
                  </p>
                  <p className="is-size-7">
                    <strong>Visibilidad:</strong>{" "}
                    {watchedVisibility === "general" ? "Público" : "Generación"}
                  </p>
                  <p className="is-size-7">
                    <strong>Palabras:</strong> {wordCount}
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
                  Tu progreso como borrador.
                </p>
                <div className="notification is-info is-light mt-3 is-flex is-align-items-center">
                  <Info size={14} style={{ marginRight: 8 }} />
                  <span className="is-size-7">
                    Recuerda agregar enlaces o menciones relevantes dentro del
                    contenido.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostView;
