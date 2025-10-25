"use client";

import { useEffect, useMemo } from "react";
import { ChevronLeft, Info, Layers, ListChecks, Sparkles } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  useCreateCategoryMutation,
  useLazyGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "@/src/redux/store/api/category";
import { categorySchema } from "@/src/schemas/category";
import Loader from "@/src/component/Loader";

type CategoryFormValues = z.infer<typeof categorySchema>;

const MIN_DESCRIPTION_LENGTH = 10;

const CATEGORY_TYPE_OPTIONS: Array<{
  value: CategoryFormValues["type"];
  label: string;
}> = [
  { value: "event", label: "Evento" },
  { value: "movie", label: "Película" },
  { value: "book", label: "Libro" },
];

const DEFAULT_EVENT_COLOR = "#9f1239";

const DEFAULT_FORM_VALUES: CategoryFormValues = {
  title: "",
  type: "event",
  description: "",
  color: DEFAULT_EVENT_COLOR,
};

const AddCategoryView = () => {
  const router = useRouter();
  const params = useParams();
  const rawId = params?.id;
  const categoryId = Array.isArray(rawId) ? rawId[0] : rawId?.toString() ?? "";
  const isEditing = Boolean(categoryId);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
    setValue,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const [
    fetchCategoryById,
    { data: categoryData, isLoading: isLoadingCategory },
  ] = useLazyGetCategoryByIdQuery();

  useEffect(() => {
    if (!isEditing) {
      return;
    }
    fetchCategoryById(categoryId);
  }, [categoryId, fetchCategoryById, isEditing]);

  useEffect(() => {
    if (!categoryData) {
      return;
    }
    reset({
      description: categoryData.description,
      title: categoryData.title,
      type: categoryData.type,
      color:
        categoryData.type === "event"
          ? categoryData.color ?? DEFAULT_EVENT_COLOR
          : "",
    });
  }, [categoryData, reset]);

  const watchedTitle = watch("title");
  const watchedType = watch("type");
  const watchedDescription = watch("description");
  const watchedColor = watch("color");

  useEffect(() => {
    if (watchedType === "event") {
      if (!watchedColor) {
        setValue("color", DEFAULT_EVENT_COLOR);
      }
      return;
    }

    if (watchedColor) {
      setValue("color", "");
    }
  }, [watchedType, watchedColor, setValue]);

  const descriptionStats = useMemo(() => {
    const trimmed = watchedDescription?.trim() ?? "";
    if (!trimmed) {
      return { characters: 0, words: 0 };
    }

    const words = trimmed.split(/\s+/).filter(Boolean).length;
    return { characters: trimmed.length, words };
  }, [watchedDescription]);

  const completion = useMemo(() => {
    const checks = [
      Boolean(watchedTitle?.trim().length),
      Boolean(watchedType),
      Boolean(
        (watchedDescription?.trim().length ?? 0) >= MIN_DESCRIPTION_LENGTH
      ),
    ];

    if (watchedType === "event") {
      checks.push(Boolean(watchedColor));
    }

    const completed = checks.filter(Boolean).length;
    return Math.round((completed / checks.length) * 100);
  }, [watchedDescription, watchedTitle, watchedType, watchedColor]);

  const handleFormSubmit = handleSubmit(async (values) => {
    try {
      const payload =
        values.type === "event"
          ? values
          : { ...values, color: undefined };

      if (isEditing) {
        const event = {
          ...payload,
          id: categoryId,
        };
        await updateCategory(event);
        toast.success("Categoría editada correctamente");
      } else {
        await createCategory(payload).unwrap();
        toast.success("Categoría creada correctamente");
      }
      reset();
      router.replace("/admin");
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ??
        "No se pudo crear la categoría. Intenta nuevamente.";
      toast.error(message);
    }
  });

  const isSaving = isSubmitting || isLoadingCategory;
  const isAwaitingExistingCategory = isEditing && isLoadingCategory;

  if (isAwaitingExistingCategory) {
    return <Loader />;
  }

  return (
    <section className="section" style={{ paddingTop: "2rem" }}>
      <div className="container">
        <button
          type="button"
          className="button is-text is-size-6 has-text-weight-semibold mb-4"
          onClick={() => router.back()}
        >
          <span className="icon">
            <ChevronLeft size={18} />
          </span>
          <span>Volver</span>
        </button>

        <div className="columns is-variable is-5">
          <div className="column is-8">
            <form className="box shadowed-form" onSubmit={handleFormSubmit}>
              <div className="mb-5">
                <h1 className="title is-4 mb-2">Nueva categoría</h1>
                <p className="subtitle is-6 has-text-grey-dark">
                  Clasifica libros, películas y eventos con una etiqueta clara y
                  descriptiva.
                </p>
              </div>

              <div className="field">
                <label htmlFor="title" className="label">
                  Nombre de la categoría *
                </label>
                <div className="control">
                  <input
                    id="title"
                    className={`input ${errors.title ? "is-danger" : ""}`}
                    placeholder="Ej. Literatura latinoamericana"
                    {...register("title")}
                  />
                </div>
                {errors.title && (
                  <p className="help is-danger">{errors.title.message}</p>
                )}
              </div>

              <div className="field">
                <label htmlFor="type" className="label">
                  Tipo de referencia *
                </label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      id="type"
                      className={errors.type ? "is-danger" : ""}
                      {...register("type")}
                    >
                      {CATEGORY_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {errors.type && (
                  <p className="help is-danger">{errors.type.message}</p>
                )}
              </div>

            {watchedType === "event" && (
              <div className="field">
                <label htmlFor="color" className="label">
                  Color distintivo *
                </label>
                <div className="control is-flex is-align-items-center is-gap-3">
                  <input
                    id="color"
                    type="color"
                    className={errors.color ? "is-danger" : ""}
                    {...register("color")}
                    style={{ width: "3rem", height: "3rem", padding: 0 }}
                  />
                  <span className="is-size-6 has-text-grey">
                    {watchedColor?.toUpperCase()}
                  </span>
                </div>
                <p className="help has-text-grey">
                  Este color se usará para identificar los eventos asociados en
                  el calendario.
                </p>
                {errors.color && (
                  <p className="help is-danger">{errors.color.message}</p>
                )}
              </div>
            )}

            <div className="field">
              <label htmlFor="description" className="label">
                Descripción *
              </label>
                <div className="control">
                  <textarea
                    id="description"
                    className={`textarea ${
                      errors.description ? "is-danger" : ""
                    }`}
                    placeholder="Describe el tipo de contenidos o actividades que agrupa esta categoría."
                    rows={5}
                    {...register("description")}
                  />
                </div>
                <p className="help has-text-grey">
                  {descriptionStats.characters} caracteres ·{" "}
                  {descriptionStats.words} palabras
                </p>
                {errors.description && (
                  <p className="help is-danger">{errors.description.message}</p>
                )}
              </div>

              <div className="is-flex is-justify-content-flex-end is-gap-2 mt-5">
                <button
                  type="button"
                  className="button is-light"
                  onClick={() => reset()}
                  disabled={isSaving}
                >
                  Limpiar
                </button>
                <button
                  type="submit"
                  className={`button is-primary ${
                    isSaving ? "is-loading" : ""
                  }`}
                  disabled={isSaving}
                >
                  {isEditing ? "Editar categoría" : "Guardar categoría"}
                </button>
              </div>
            </form>
          </div>

          <div className="column is-4">
            <aside className="box shadowed-form is-flex is-flex-direction-column is-gap-4">
              <div className="is-flex is-align-items-center is-gap-3">
                <span className="icon is-medium has-background-primary-light">
                  <Layers size={24} />
                </span>
                <div>
                  <p className="title is-6 mb-1">Estado del formulario</p>
                  <p className="subtitle is-7 has-text-grey">
                    Completa los campos requeridos para activar la categoría.
                  </p>
                </div>
              </div>

              <progress
                className="progress is-small is-primary"
                value={completion}
                max="100"
              >
                {completion}%
              </progress>
              <p className="has-text-weight-semibold is-size-6">
                {completion}% completo
              </p>

              <div>
                <p className="is-size-6 has-text-weight-semibold mb-2">
                  Lista de verificación
                </p>
                <ul className="is-size-7">
                  <li className="is-flex is-align-items-center is-gap-2 mb-1">
                    <ListChecks
                      size={16}
                      className={
                        watchedTitle?.trim().length ? "has-text-success" : ""
                      }
                    />
                    <span>Nombre definido</span>
                  </li>
                  <li className="is-flex is-align-items-center is-gap-2 mb-1">
                    <ListChecks
                      size={16}
                      className={watchedType ? "has-text-success" : ""}
                    />
                    <span>Tipo seleccionado</span>
                  </li>
                  {watchedType === "event" && (
                    <li className="is-flex is-align-items-center is-gap-2 mb-1">
                      <ListChecks
                        size={16}
                        className={watchedColor ? "has-text-success" : ""}
                      />
                      <span>Color seleccionado</span>
                    </li>
                  )}
                  <li className="is-flex is-align-items-center is-gap-2">
                    <ListChecks
                      size={16}
                      className={
                        (watchedDescription?.trim().length ?? 0) >=
                        MIN_DESCRIPTION_LENGTH
                          ? "has-text-success"
                          : ""
                      }
                    />
                    <span>Descripción con al menos 10 caracteres</span>
                  </li>
                </ul>
              </div>

              <div className="notification is-light is-info is-flex is-align-items-start is-gap-3">
                <Info size={18} className="mt-1" />
                <div>
                  <p className="has-text-weight-semibold is-size-6">
                    Consejos para agrupar mejor
                  </p>
                  <p className="is-size-7">
                    Usa títulos concretos y descripciones que indiquen qué tipo
                    de materiales o eventos pertenecen aquí.
                  </p>
                </div>
              </div>

              <div className="has-background-primary-light p-3 is-flex is-align-items-start is-gap-3">
                <Sparkles size={18} className="mt-1" />
                <p className="is-size-7">
                  Las categorías ayudan a las personas a explorar el acervo sin
                  perderse. Piensa en cómo se conectan con las actividades de la
                  comunidad.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddCategoryView;
