"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import type { Book } from "@/src/types/book";

// Zod schema for book validation
const bookSchema = z.object({
  titulo: z.string().min(1, "El título es requerido"),
  author: z.string().min(1, "El autor es requerido"),
  descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  editorial: z.string().min(1, "La editorial es requerida"),
  anioPublicacion: z.string().min(4, "El año de publicación es requerido"),
  numPag: z.string().min(1, "El número de páginas es requerido"),
  tipo: z.string().min(1, "El tipo de libro es requerido"),
  ubicacion: z.object({
    repisa: z.string().min(1, "La repisa es requerida"),
    col: z.number().min(1, "La columna debe ser mayor a 0"),
    row: z.number().min(1, "La fila debe ser mayor a 0"),
  }),
});

type BookFormData = z.infer<typeof bookSchema>;

interface BookFormProps {
  onSubmit: (data: BookFormData & { image: string }) => void;
  initialData?: Partial<Book>;
}

const BookForm: React.FC<BookFormProps> = ({ onSubmit, initialData }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image || "");
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      titulo: initialData?.titulo || "",
      author: initialData?.author || "",
      descripcion: initialData?.descripcion || "",
      editorial: initialData?.editorial || "",
      anioPublicacion: initialData?.anioPublicacion || "",
      numPag: initialData?.numPag || "",
      tipo: initialData?.tipo || "",
      ubicacion: {
        repisa: initialData?.ubicacion?.repisa || "",
        col: initialData?.ubicacion?.col || 1,
        row: initialData?.ubicacion?.row || 1,
      },
    },
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_upload_preset"); // You'll need to set this up in Cloudinary
    
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`, // Replace with your cloud name
        {
          method: "POST",
          body: formData,
        }
      );
      
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw new Error("Error uploading image");
    }
  };

  const onFormSubmit = async (data: BookFormData) => {
    setIsUploading(true);
    
    try {
      let imageUrl = initialData?.image || "";
      
      if (selectedImage) {
        imageUrl = await uploadToCloudinary(selectedImage);
      }
      
      onSubmit({ ...data, image: imageUrl });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error al subir la imagen. Por favor, intenta de nuevo.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit(onFormSubmit)} className="box">
        <h2 className="title is-4 has-text-centered mb-5">
          {initialData ? "Editar Libro" : "Agregar Nuevo Libro"}
        </h2>

        {/* Image Upload Section */}
        <div className="field">
          <label className="label">Imagen del Libro</label>
          <div className="file has-name is-fullwidth">
            <label className="file-label">
              <input
                className="file-input"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
              />
              <span className="file-cta">
                <span className="file-icon">
                  <i className="fas fa-upload"></i>
                </span>
                <span className="file-label">Seleccionar imagen...</span>
              </span>
              <span className="file-name">
                {selectedImage ? selectedImage.name : "No hay archivo seleccionado"}
              </span>
            </label>
          </div>
          {imagePreview && (
            <div className="mt-3">
              <Image
                src={imagePreview}
                alt="Preview"
                width={200}
                height={250}
                className="image"
                style={{ objectFit: "cover" }}
              />
            </div>
          )}
        </div>

        {/* Title */}
        <div className="field">
          <label className="label">Título *</label>
          <div className="control">
            <input
              className={`input ${errors.titulo ? "is-danger" : ""}`}
              type="text"
              placeholder="Título del libro"
              {...register("titulo")}
            />
          </div>
          {errors.titulo && (
            <p className="help is-danger">{errors.titulo.message}</p>
          )}
        </div>

        {/* Author */}
        <div className="field">
          <label className="label">Autor *</label>
          <div className="control">
            <input
              className={`input ${errors.author ? "is-danger" : ""}`}
              type="text"
              placeholder="Nombre del autor"
              {...register("author")}
            />
          </div>
          {errors.author && (
            <p className="help is-danger">{errors.author.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="field">
          <label className="label">Descripción *</label>
          <div className="control">
            <textarea
              className={`textarea ${errors.descripcion ? "is-danger" : ""}`}
              placeholder="Descripción del libro"
              rows={4}
              {...register("descripcion")}
            />
          </div>
          {errors.descripcion && (
            <p className="help is-danger">{errors.descripcion.message}</p>
          )}
        </div>

        {/* Editorial and Year */}
        <div className="columns">
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
                <p className="help is-danger">{errors.editorial.message}</p>
              )}
            </div>
          </div>
          <div className="column">
            <div className="field">
              <label className="label">Año de Publicación *</label>
              <div className="control">
                <input
                  className={`input ${errors.anioPublicacion ? "is-danger" : ""}`}
                  type="text"
                  placeholder="Año"
                  {...register("anioPublicacion")}
                />
              </div>
              {errors.anioPublicacion && (
                <p className="help is-danger">{errors.anioPublicacion.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Number of Pages and Type */}
        <div className="columns">
          <div className="column">
            <div className="field">
              <label className="label">Número de Páginas *</label>
              <div className="control">
                <input
                  className={`input ${errors.numPag ? "is-danger" : ""}`}
                  type="text"
                  placeholder="Número de páginas"
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

        {/* Location Section */}
        <div className="field">
          <label className="label">Ubicación *</label>
          <div className="columns">
            <div className="column">
              <div className="field">
                <label className="label">Repisa</label>
                <div className="control">
                  <input
                    className={`input ${errors.ubicacion?.repisa ? "is-danger" : ""}`}
                    type="text"
                    placeholder="Código de repisa"
                    {...register("ubicacion.repisa")}
                  />
                </div>
                {errors.ubicacion?.repisa && (
                  <p className="help is-danger">{errors.ubicacion.repisa.message}</p>
                )}
              </div>
            </div>
            <div className="column">
              <div className="field">
                <label className="label">Columna</label>
                <div className="control">
                  <input
                    className={`input ${errors.ubicacion?.col ? "is-danger" : ""}`}
                    type="number"
                    placeholder="Columna"
                    min="1"
                    {...register("ubicacion.col", { valueAsNumber: true })}
                  />
                </div>
                {errors.ubicacion?.col && (
                  <p className="help is-danger">{errors.ubicacion.col.message}</p>
                )}
              </div>
            </div>
            <div className="column">
              <div className="field">
                <label className="label">Fila</label>
                <div className="control">
                  <input
                    className={`input ${errors.ubicacion?.row ? "is-danger" : ""}`}
                    type="number"
                    placeholder="Fila"
                    min="1"
                    {...register("ubicacion.row", { valueAsNumber: true })}
                  />
                </div>
                {errors.ubicacion?.row && (
                  <p className="help is-danger">{errors.ubicacion.row.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="field is-grouped is-grouped-centered">
          <div className="control">
            <button
              type="submit"
              className={`button is-primary is-large ${isUploading ? "is-loading" : ""}`}
              disabled={isUploading}
            >
              {initialData ? "Actualizar Libro" : "Agregar Libro"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
