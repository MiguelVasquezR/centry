"use client";

import { useMemo, useState, type ChangeEvent, type DragEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ImagePlus,
  Info,
  ListChecks,
  Sparkles,
  UserCircle2,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

import { useCreateUserMutation } from "@/src/redux/store/api/usersApi";
import type { User } from "@/src/types/user";

const userSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  topics: z.string().min(1, "Ingresa al menos un tema de interés"),
  biography: z.string().min(1, "La biografía es requerida"),
  tuition: z.string().min(1, "La matrícula es requerida"),
});

type UserFormData = z.infer<typeof userSchema>;

const AddUserView = () => {
  const router = useRouter();
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState<boolean>(false);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      topics: "",
      biography: "",
      tuition: "",
    },
  });

  const watchedName = watch("name");
  const watchedEmail = watch("email");
  const watchedTopics = watch("topics");
  const watchedBiography = watch("biography");
  const watchedTuition = watch("tuition");

  const biographyValue = watchedBiography || "";
  const biographyWordCount = biographyValue
    ? biographyValue.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const hasAvatar = Boolean(avatarPreview);

  const topicsPreview = useMemo(() => {
    const value = watchedTopics || "";
    return value
      .split(",")
      .map((topic) => topic.trim())
      .filter((topic) => topic.length > 0);
  }, [watchedTopics]);

  const completionChecklist = [
    Boolean(watchedName),
    Boolean(watchedEmail),
    Boolean(topicsPreview.length),
    Boolean(biographyValue && biographyValue.length >= 10),
    Boolean(watchedTuition),
    hasAvatar,
  ];

  const completion =
    completionChecklist.length > 0
      ? Math.round(
          (completionChecklist.filter(Boolean).length /
            completionChecklist.length) *
            100
        )
      : 0;

  const isSaving = isSubmitting || isLoading || isUploadingAvatar;

  const setAvatarFromFile = (file: File) => {
    setSelectedAvatar(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFromFile(file);
    }
    event.target.value = "";
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleAvatarDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setAvatarFromFile(file);
    }
  };

  const uploadAvatar = async (file: File): Promise<string> => {
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
      throw new Error("Error uploading avatar");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const onSubmit = async (data: UserFormData) => {
    if (!selectedAvatar) {
      toast.error("Por favor, sube una imagen de perfil.");
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const topicsArray = data.topics
        .split(",")
        .map((topic) => topic.trim())
        .filter((topic) => topic.length > 0);

      const imageUrl = await uploadAvatar(selectedAvatar);

      const payload: Omit<User, "id"> = {
        name: data.name,
        email: data.email,
        topics: topicsArray,
        biography: data.biography,
        tuition: data.tuition,
        imageUrl,
      };

      await createUser(payload).unwrap();
      toast.success("Usuario creado correctamente");
      reset();
      setSelectedAvatar(null);
      setAvatarPreview("");
      setIsDragActive(false);
      router.push("/users");
    } catch (error) {
      console.error("Error creating user", error);
      toast.error("Ocurrió un error al crear el usuario");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className="container">
      <br />
      <div className="card mb-5">
        <div className="card-content">
          <div className="level is-align-items-center is-mobile">
            <div className="level-left">
              <div className="level-item">
                <button
                  onClick={() => router.back()}
                  className="button is-light is-medium mr-4"
                  type="button"
                >
                  <ChevronLeft className="mr-2" />
                  Volver
                </button>
              </div>
              <div className="level-item">
                <div>
                  <h1 className="title is-4 mb-1">Registrar nuevo perfil</h1>
                  <p className="subtitle is-6 has-text-grey">
                    Captura información clave para sumar a la comunidad lectora.
                  </p>
                  <div className="tags">
                    <span className="tag is-info is-light">
                      <Sparkles size={14} style={{ marginRight: 6 }} />
                      Curaduría humana
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
                  Completa los campos para habilitar el registro
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
              Completa los campos para habilitar el registro
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="columns is-variable is-5">
          <div className="column is-8-desktop is-12-tablet">
            <div className="card mb-5">
              <div className="card-content">
                <div className="is-flex is-align-items-center is-justify-content-space-between mb-3">
                  <h3 className="title is-5 mb-0">
                    <span className="icon-text">
                      <span className="icon">
                        <UserCircle2 size={18} />
                      </span>
                      <span>Identidad y contacto</span>
                    </span>
                  </h3>
                </div>

                <div className="columns is-variable is-4">
                  <div className="column">
                    <div className="field">
                      <label className="label">Nombre completo *</label>
                      <div className="control">
                        <input
                          {...register("name")}
                          className={`input ${errors.name ? "is-danger" : ""}`}
                          type="text"
                          placeholder="Ej. Elena Rodríguez"
                          autoComplete="name"
                        />
                      </div>
                      {errors.name && (
                        <p className="help is-danger">{errors.name.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <label className="label">Correo electrónico *</label>
                      <div className="control">
                        <input
                          {...register("email")}
                          className={`input ${errors.email ? "is-danger" : ""}`}
                          type="email"
                          placeholder="nombre@ejemplo.com"
                          autoComplete="email"
                        />
                      </div>
                      {errors.email && (
                        <p className="help is-danger">{errors.email.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card mb-5">
              <div className="card-content">
                <h3 className="title is-5 mb-2">Biografía y enfoque</h3>
                <p className="is-size-7 has-text-grey">
                  Destaca los intereses literarios para personalizar recomendaciones.
                </p>

                <div className="field mt-4">
                  <label className="label">Temas de interés *</label>
                  <div className="control">
                    <textarea
                      {...register("topics")}
                      className={`textarea ${errors.topics ? "is-danger" : ""}`}
                      placeholder="Ej. Poesía latinoamericana, archivo histórico, feminismos"
                      rows={3}
                    />
                  </div>
                  <p className="help">
                    Escribe los temas separados por coma. Se convertirán en etiquetas.
                  </p>
                  {errors.topics && (
                    <p className="help is-danger">{errors.topics.message}</p>
                  )}
                  {topicsPreview.length > 0 && (
                    <div className="tags mt-2">
                      {topicsPreview.map((topic) => (
                        <span key={topic} className="tag is-info is-light">
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="field">
                  <div className="is-flex is-align-items-center is-justify-content-space-between mb-2">
                    <label className="label mb-0">Biografía breve *</label>
                    <span className="tag is-light is-info">
                      {biographyWordCount}{" "}
                      {biographyWordCount === 1 ? "palabra" : "palabras"}
                    </span>
                  </div>
                  <div className="control">
                    <textarea
                      {...register("biography")}
                      className={`textarea ${
                        errors.biography ? "is-danger" : ""
                      }`}
                      placeholder="Cuéntanos su rol en la comunidad, proyectos recientes o libros favoritos."
                      rows={6}
                    />
                  </div>
                  {errors.biography && (
                    <p className="help is-danger">{errors.biography.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-content">
                <h3 className="title is-5 mb-2">Datos académicos</h3>
                <div className="columns is-variable is-4">
                  <div className="column is-6">
                    <div className="field">
                      <label className="label">Matrícula *</label>
                      <div className="control">
                        <input
                          {...register("tuition")}
                          className={`input ${
                            errors.tuition ? "is-danger" : ""
                          }`}
                          type="text"
                          placeholder="Ej. S19025267"
                        />
                      </div>
                      {errors.tuition && (
                        <p className="help is-danger">
                          {errors.tuition.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="is-flex is-align-items-center is-justify-content-space-between is-flex-wrap-wrap mt-2">
                  <button
                    type="button"
                    className="button is-light"
                    onClick={() => router.push("/users")}
                    disabled={isSaving}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={`button is-primary is-medium has-text-weight-semibold ${
                      isSaving ? "is-loading" : ""
                    }`}
                    disabled={isSaving}
                  >
                    Guardar usuario
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="column is-4-desktop is-12-tablet">
            <div style={{ position: "sticky", top: "2rem" }}>
              <div className="card mb-4">
                <div className="card-content">
                  <h3 className="title is-5 mb-1">Avatar</h3>
                  <p className="is-size-7 has-text-grey">
                    Usa un retrato cuadrado o 3:4 para que encaje con los perfiles destacados.
                  </p>
                  <label
                    className={`is-flex is-flex-direction-column is-align-items-center is-justify-content-center has-text-centered mt-4 p-5 ${
                      isDragActive ? "has-background-primary-light" : "has-background-light"
                    }`}
                    style={{
                      border: `2px dashed ${isDragActive ? "#485fc7" : "#d7d8dd"}`,
                      borderRadius: "18px",
                      cursor: "pointer",
                      transition: "border-color 0.2s ease",
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleAvatarDrop}
                  >
                    <ImagePlus size={36} className="mb-2" />
                    <span className="is-size-6 has-text-weight-semibold">
                      Arrastra una imagen de perfil
                    </span>
                    <span className="is-size-7 has-text-grey">
                      o <span className="has-text-link">haz clic para seleccionarla</span>
                    </span>
                    <span className="is-size-7 has-text-grey mt-2">
                      {selectedAvatar?.name || "Formatos aceptados: JPG · PNG"}
                    </span>
                    <input
                      className="is-hidden"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarSelect}
                    />
                  </label>
                  <p className="is-size-7 has-text-grey mt-2">
                    Recomendado: mínimo 800 × 800 px.
                  </p>
                  {avatarPreview ? (
                    <figure
                      className="image is-square mt-4"
                      style={{
                        maxWidth: "200px",
                        margin: "0 auto",
                        borderRadius: "18px",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <Image
                        src={avatarPreview}
                        alt="Avatar preview"
                        fill
                        sizes="200px"
                        unoptimized
                        style={{ objectFit: "cover" }}
                      />
                    </figure>
                  ) : (
                    <div
                      className="has-text-centered mt-4 has-background-light p-4"
                      style={{ borderRadius: "16px" }}
                    >
                      <p className="is-size-6">Aún no seleccionas imagen</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="card">
                <div className="card-content">
                  <h4 className="title is-6 mb-3">Resumen</h4>
                  <div className="notification is-light">
                    <p className="is-size-7">
                      <strong>Nombre:</strong> {watchedName || "Por definir"}
                    </p>
                    <p className="is-size-7">
                      <strong>Correo:</strong> {watchedEmail || "Sin correo"}
                    </p>
                    <p className="is-size-7">
                      <strong>Temas:</strong>{" "}
                      {topicsPreview.length
                        ? topicsPreview.join(", ")
                        : "Sin temas asignados"}
                    </p>
                    <p className="is-size-7">
                      <strong>Matrícula:</strong> {watchedTuition || "—"}
                    </p>
                    <p className="is-size-7">
                      <strong>Imagen:</strong> {hasAvatar ? "Lista" : "Pendiente"}
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
                    Progreso del registro de usuario.
                  </p>
                  <div className="notification is-info is-light mt-3 is-flex is-align-items-center">
                    <Info size={14} style={{ marginRight: 8 }} />
                    <span className="is-size-7">
                      Verifica la ortografía de nombres y correos antes de guardar.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddUserView;
