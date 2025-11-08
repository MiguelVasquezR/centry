"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PageHeader from "@/src/component/PageHeader";
import {
  useCreateMovieMutation,
  useUpdateMovieMutation,
  useLazyGetMovieByIdQuery,
} from "@/src/redux/store/api/moviesApi";
import toast from "react-hot-toast";

const movieSchema = z.object({
  titulo: z.string().min(1, "El título es requerido"),
  director: z.string().min(1, "El director es requerido"),
  sinopsis: z.string().min(10, "La sinopsis debe tener al menos 10 caracteres"),
  genero: z.string().min(1, "El género es requerido"),
  duracion: z.string().min(1, "La duración es requerida"),
  anioEstreno: z
    .string()
    .min(4, "El año debe tener 4 dígitos")
    .max(4, "El año debe tener 4 dígitos"),
  clasificacion: z.string().min(1, "La clasificación es requerida"),
  plataforma: z.string().optional(),
});

type MovieFormData = z.infer<typeof movieSchema>;

interface MovieFormProps {
  movieId?: string;
  mode?: "add" | "edit";
}

const MovieForm = ({ movieId, mode = "add" }: MovieFormProps) => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const [createMovie, { isLoading: isCreating }] = useCreateMovieMutation();
  const [updateMovie, { isLoading: isUpdating }] = useUpdateMovieMutation();
  const [getMovieById, { data: movieData, isLoading: isLoadingMovie }] =
    useLazyGetMovieByIdQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MovieFormData>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      titulo: "",
      director: "",
      sinopsis: "",
      genero: "",
      duracion: "",
      anioEstreno: "",
      clasificacion: "",
      plataforma: "",
    },
  });

  useEffect(() => {
    if (mode === "edit" && movieId) {
      getMovieById(movieId);
    }
  }, [mode, movieId, getMovieById]);

  useEffect(() => {
    if (movieData && mode === "edit") {
      reset({
        titulo: movieData.titulo,
        director: movieData.director,
        sinopsis: movieData.sinopsis,
        genero: movieData.genero,
        duracion: movieData.duracion,
        anioEstreno: movieData.anioEstreno,
        clasificacion: movieData.clasificacion,
        plataforma: movieData.plataforma,
      });
      setImagePreview(movieData.imagen);
    }
  }, [movieData, mode, reset]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);

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
    formData.append("upload_preset", "dvt4vznxn");

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
  };

  const onFormSubmit = async (data: MovieFormData) => {
    setIsUploading(true);

    try {
      let imageUrl =
        movieData?.imagen ||
        "https://res.cloudinary.com/dvt4vznxn/image/upload/v1758764097/138617_ar3v0q.jpg";

      if (selectedImage) {
        imageUrl = await uploadToCloudinary(selectedImage);
      }

      const payload = {
        ...data,
        imagen: imageUrl,
        plataforma: data.plataforma || "Disponible en sala",
      };

      if (mode === "edit" && movieId) {
        await updateMovie({ ...payload, id: movieId });
        toast.success("Película actualizada correctamente");
      } else {
        await createMovie(payload);
        toast.success("Película agregada correctamente");
      }

      router.push("/movies");
    } catch (error) {
      console.error("Error submitting movie form:", error);
      toast.error(
        `Error al ${mode === "edit" ? "actualizar" : "agregar"} la película.`
      );
    } finally {
      setIsUploading(false);
    }
  };

  if (mode === "edit" && isLoadingMovie) {
    return (
      <div className="container">
        <div className="has-text-centered">
          <div
            className="is-loading"
            style={{ width: "50px", height: "50px", margin: "50px auto" }}
          ></div>
          <p>Cargando datos de la película...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <br />

      <PageHeader
        title={mode === "edit" ? "Editar película" : "Registrar nueva película"}
        description="Comparte producciones audiovisuales con la comunidad."
      />

      <form className="card" onSubmit={handleSubmit(onFormSubmit)}>
        <div className="card-content">
          <div className="columns is-variable is-5">
            <div className="column is-8">
              <div className="field">
                <label className="label">Título</label>
                <div className="control">
                  <input
                    type="text"
                    className={`input ${errors.titulo ? "is-danger" : ""}`}
                    placeholder="Ingresa el título original"
                    {...register("titulo")}
                  />
                </div>
                {errors.titulo && (
                  <p className="help is-danger">{errors.titulo.message}</p>
                )}
              </div>

              <div className="field">
                <label className="label">Director</label>
                <div className="control">
                  <input
                    type="text"
                    className={`input ${errors.director ? "is-danger" : ""}`}
                    placeholder="Nombre del director o directora"
                    {...register("director")}
                  />
                </div>
                {errors.director && (
                  <p className="help is-danger">{errors.director.message}</p>
                )}
              </div>

              <div className="field">
                <label className="label">Sinopsis</label>
                <div className="control">
                  <textarea
                    className={`textarea ${errors.sinopsis ? "is-danger" : ""}`}
                    rows={6}
                    placeholder="Describe brevemente de qué trata la película"
                    {...register("sinopsis")}
                  />
                </div>
                {errors.sinopsis && (
                  <p className="help is-danger">{errors.sinopsis.message}</p>
                )}
              </div>

              <div className="field is-horizontal">
                <div className="field-body">
                  <div className="field">
                    <label className="label">Género</label>
                    <div className="control">
                      <div className={`select is-fullwidth`}>
                        <select {...register("genero")}>
                          <option value="">Selecciona una opción</option>
                          <option value="Documental">Documental</option>
                          <option value="Ficción">Ficción</option>
                          <option value="Animación">Animación</option>
                          <option value="Drama">Drama</option>
                          <option value="Acción">Acción</option>
                        </select>
                      </div>
                    </div>
                    {errors.genero && (
                      <p className="help is-danger">{errors.genero.message}</p>
                    )}
                  </div>

                  <div className="field">
                    <label className="label">Año de estreno</label>
                    <div className="control">
                      <input
                        type="text"
                        maxLength={4}
                        className={`input ${
                          errors.anioEstreno ? "is-danger" : ""
                        }`}
                        placeholder="Ej. 2024"
                        {...register("anioEstreno")}
                      />
                    </div>
                    {errors.anioEstreno && (
                      <p className="help is-danger">
                        {errors.anioEstreno.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="field is-horizontal">
                <div className="field-body">
                  <div className="field">
                    <label className="label">Duración</label>
                    <div className="control">
                      <input
                        type="text"
                        className={`input ${
                          errors.duracion ? "is-danger" : ""
                        }`}
                        placeholder="Ej. 1h 45m o 105 minutos"
                        {...register("duracion")}
                      />
                    </div>
                    {errors.duracion && (
                      <p className="help is-danger">
                        {errors.duracion.message}
                      </p>
                    )}
                  </div>

                  <div className="field">
                    <label className="label">Clasificación</label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select {...register("clasificacion")}>
                          <option value="">Selecciona</option>
                          <option value="ATP">ATP</option>
                          <option value="PG-13">PG-13</option>
                          <option value="+16">+16</option>
                          <option value="+18">+18</option>
                        </select>
                      </div>
                    </div>
                    {errors.clasificacion && (
                      <p className="help is-danger">
                        {errors.clasificacion.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="field">
                <label className="label">Plataforma / Sala</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    placeholder="Ej. Netflix, Amazon, Sala Principal"
                    {...register("plataforma")}
                  />
                </div>
              </div>
            </div>

            <div className="column is-4">
              <div className="box has-text-centered">
                <p className="title is-6">Carátula</p>
                <p className="is-size-7 has-text-grey">
                  Sube una imagen para identificar la película en el catálogo.
                </p>
                <div className="file is-boxed is-fullwidth mt-4">
                  <label className="file-label">
                    <input
                      className="file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                    />
                    <span className="file-cta">
                      <span className="file-label">
                        {selectedImage ? "Cambiar carátula" : "Elegir imagen"}
                      </span>
                    </span>
                  </label>
                </div>
                <div className="mt-4">
                  {imagePreview ? (
                    <figure
                      className="image"
                      style={{ position: "relative", width: "180px" }}
                    >
                      <Image
                        src={imagePreview}
                        alt="Previsualización"
                        width={180}
                        height={260}
                        style={{
                          objectFit: "cover",
                          borderRadius: "12px",
                          width: "100%",
                          height: "auto",
                        }}
                      />
                    </figure>
                  ) : (
                    <div
                      className="has-background-light p-5 is-flex is-flex-direction-column is-align-items-center is-justify-content-center"
                      style={{ borderRadius: "12px" }}
                    >
                      <span className="icon is-large has-text-grey-light">
                        🎬
                      </span>
                      <p className="is-size-7 has-text-grey">
                        Aún no has seleccionado una imagen
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="card-footer">
          <div className="card-footer-item">
            <button
              type="submit"
              className={`button is-primary has-text-white has-text-weight-semibold ${
                isUploading || isCreating || isUpdating ? "is-loading" : ""
              }`}
              disabled={isUploading || isCreating || isUpdating}
            >
              {mode === "edit" ? "Guardar cambios" : "Crear película"}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
};

export default MovieForm;
