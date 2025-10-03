"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { ChevronLeft, Upload, X } from "lucide-react";
import Image from "next/image";
import { Book } from "../../../types/book";
import TipTapEditor from "../../../component/TipTapEditor";
import { useCreatePostMutation } from "../../../redux/store/api/postsApi";
import { useLazyFetchBooksQuery } from "../../../redux/store/api/booksApi";

// Zod schema for post validation
const postSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  content: z.string().min(10, "El contenido debe tener al menos 10 caracteres"),
  authorId: z.string().min(1, "El autor es requerido"),
  preference: z.object({
    visibleBy: z.enum(["general", "generation"]),
    book: z.string().min(1, "El libro asociado es requerido"),
  }),
});

type PostFormData = z.infer<typeof postSchema>;

const CreatePostView = () => {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [createPost, { isLoading: isAddingPost }] = useCreatePostMutation();
  const [fetchBooks, { data: booksResponse }] = useLazyFetchBooksQuery();
  const books = booksResponse?.books || [];

  // Load books when component mounts
  useEffect(() => {
    fetchBooks({ page: 1, limit: 100 });
  }, [fetchBooks]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      authorId: "current-user-id", // TODO: Get from auth context
      preference: {
        visibleBy: "general",
        book: "",
      },
    },
  });

  const watchedVisibility = watch("preference.visibleBy");

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + selectedImages.length > 5) {
      alert("Máximo 5 imágenes permitidas");
      return;
    }

    setSelectedImages((prev) => [...prev, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
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
      const postData = {
        ...data,
        content,
        imageUrl: imageUrls,
        createdAt: new Date(),
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

  return (
    <div className="container">
      <br />
      <div className="level mb-6">
        <div className="level-left">
          <div className="level-item">
            <button
              onClick={() => router.back()}
              className="button is-light is-medium mr-4"
            >
              <ChevronLeft className="mr-2" />
            </button>
          </div>
        </div>
      </div>

      <div className="columns">
        <div className="column is-8">
          <form onSubmit={handleSubmit(onFormSubmit)}>
            {/* Title */}
            <div className="field">
              <div className="control">
                <input
                  {...register("title")}
                  className={`input is-medium ${
                    errors.title ? "is-danger" : ""
                  }`}
                  type="text"
                  placeholder="Ingresa el título de tu post"
                />
              </div>
              {errors.title && (
                <p className="help is-danger">{errors.title.message}</p>
              )}
            </div>

            {/* Content Editor */}
            <div className="field">
              <label className="label">Contenido</label>
              <div className="control">
                <TipTapEditor
                  content={content}
                  onChange={(newContent) => {
                    setContent(newContent);
                    setValue("content", newContent);
                  }}
                  placeholder="Comparte tus pensamientos, reflexiones o reseñas sobre libros..."
                />
              </div>
              {errors.content && (
                <p className="help is-danger">{errors.content.message}</p>
              )}
            </div>

            {/* Images */}
            <div className="field">
              <label className="label">Imágenes (Opcional)</label>
              <div className="control">
                <div className="file is-boxed">
                  <label className="file-label">
                    <input
                      className="file-input"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                    />
                    <span className="file-cta">
                      <span className="file-icon">
                        <Upload />
                      </span>
                      <span className="file-label">
                        Seleccionar imágenes (máx. 5)
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="field">
                <div className="columns is-multiline">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="column is-3">
                      <div className="card">
                        <div className="card-image">
                          <figure className="image is-square">
                            <Image
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="is-rounded"
                              fill
                              style={{ objectFit: "cover" }}
                            />
                          </figure>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="delete is-medium"
                            style={{
                              position: "absolute",
                              top: "0.5rem",
                              right: "0.5rem",
                            }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="field is-grouped is-grouped-centered">
              <div className="control">
                <button
                  type="submit"
                  className={`button is-primary is-large ${
                    isUploading || isAddingPost ? "is-loading" : ""
                  }`}
                  disabled={isUploading || isAddingPost}
                >
                  Publicar Post
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Sidebar - Preferences */}
        <div className="column is-4">
          <div className="box">
            <h3 className="title is-5 has-text-primary">⚙️ Preferencias</h3>

            {/* Author ID (Hidden field for now) */}
            <input {...register("authorId")} type="hidden" />

            {/* Visibility */}
            <div className="field">
              <label className="label">Visibilidad</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select {...register("preference.visibleBy")}>
                    <option value="general">Público General</option>
                    <option value="generation">Mi Generación</option>
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
                  ? "Visible para todos los usuarios"
                  : "Solo visible para usuarios de tu generación"}
              </p>
            </div>

            {/* Associated Book */}
            <div className="field">
              <label className="label">Libro Asociado</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select {...register("preference.book")}>
                    <option value="">Selecciona un libro</option>
                    {books.map((book: Book) => (
                      <option key={book.id} value={book.id}>
                        {book.titulo} - {book.author}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {errors.preference?.book && (
                <p className="help is-danger">
                  {errors.preference.book.message}
                </p>
              )}
              <p className="help">
                Asocia tu post con un libro de la biblioteca
              </p>
            </div>

            {/* Post Statistics Preview */}
            <div className="content">
              <hr />
              <h4 className="title is-6">📊 Vista Previa</h4>
              <div className="notification is-light">
                <p>
                  <strong>Título:</strong> {watch("title") || "Sin título"}
                </p>
                <p>
                  <strong>Contenido:</strong>{" "}
                  {content.replace(/<[^>]*>/g, "").slice(0, 100) ||
                    "Sin contenido"}
                  ...
                </p>
                <p>
                  <strong>Imágenes:</strong> {selectedImages.length}
                </p>
                <p>
                  <strong>Visibilidad:</strong>{" "}
                  {watchedVisibility === "general" ? "Público" : "Generación"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostView;
