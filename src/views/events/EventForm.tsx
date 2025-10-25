"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTime } from "luxon";
import { eventSchema } from "@/src/schemas/event";
import { useGetCategoriesQuery } from "@/src/redux/store/api/category";
import { useCreateEventMutation } from "@/src/redux/store/api/eventApi";
import { EventFormValues } from "@/src/types/event";
import toast from "react-hot-toast";
import type { Category } from "@/src/types/category";

const fallbackCategories: Category[] = [
  {
    id: "1",
    title: "Tecnología",
    type: "event",
    description: "Artículos y novedades sobre software, hardware y desarrollo.",
    color: "#0ea5e9",
  },
  {
    id: "2",
    title: "Educación",
    type: "event",
    description: "Recursos, técnicas y tendencias educativas.",
    color: "#f59e0b",
  },
  {
    id: "3",
    title: "Salud",
    type: "event",
    description: "Consejos sobre bienestar físico y mental.",
    color: "#10b981",
  },
];

const EventForm = () => {
  const router = useRouter();

  const {
    data: categoriesData = [],
    isLoading: isLoadingCategory,
  } = useGetCategoriesQuery(undefined);

  const eventCategories = (categoriesData ?? []).filter(
    (category: Category) => category.type === "event"
  );

  const categoryOptions = eventCategories.length
    ? eventCategories
    : fallbackCategories;

  const [createEvent] = useCreateEventMutation();

  const defaultCategoryValue =
    categoryOptions.length > 0
      ? categoryOptions[0].id ?? categoryOptions[0].title
      : "";

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      type: defaultCategoryValue,
      date: DateTime.now().toISODate(),
      time: DateTime.now().toFormat("HH:mm"),
      duration: "60",
      location: "",
      responsible: "",
      notes: "",
      link: "",
      ability: 20,
    },
  });

  useEffect(() => {
    if (defaultCategoryValue) {
      setValue("type", defaultCategoryValue);
    }
  }, [defaultCategoryValue, setValue]);

  const onSubmit = (data: EventFormValues) => {
    createEvent(data);

    toast.success("Evento guardado correctamente");
    router.replace("/events");
  };

  if (isLoadingCategory) {
    return <div>Cargando</div>;
  }

  return (
    <section className="section" style={{ paddingTop: "2rem" }}>
      <div className="container">
        <form className="box shadowed-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="columns is-variable is-6">
            <div className="column is-8">
              <div className="field">
                <label htmlFor="title" className="label">
                  Título del evento *
                </label>
                <div className="control">
                  <input
                    id="title"
                    className={`input ${errors.title ? "is-danger" : ""}`}
                    placeholder="Ej. Proyección: Fragmentos de la memoria"
                    {...register("title")}
                  />
                </div>
                {errors.title && (
                  <p className="help is-danger">{errors.title.message}</p>
                )}
              </div>

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
                    placeholder="Cuenta de qué se trata el evento, qué público está invitado y qué deberán traer los participantes."
                    rows={4}
                    {...register("description")}
                  />
                </div>
                {errors.description && (
                  <p className="help is-danger">{errors.description.message}</p>
                )}
              </div>

              <div className="columns">
                <div className="column is-6">
              <div className="field">
                <label htmlFor="type" className="label">
                  Tipo de evento *
                </label>
                <div
                  className={`control ${errors.type ? "is-danger" : ""}`}
                >
                  <div className="select is-fullwidth">
                    <select
                      id="type"
                      defaultValue={defaultCategoryValue}
                      {...register("type")}
                    >
                          {categoryOptions.map((option: Category) => (
                            <option
                              key={option.id ?? option.title}
                              value={option.id ?? option.title}
                            >
                              {option.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {errors.type && (
                      <p className="help is-danger">{errors.type.message}</p>
                    )}
                  </div>
                </div>

                <div className="column is-6">
                  <div className="field">
                    <label htmlFor="responsible" className="label">
                      Responsable/Anfitrión *
                    </label>
                    <div className="control">
                      <input
                        id="responsible"
                        className={`input ${
                          errors.responsible ? "is-danger" : ""
                        }`}
                        placeholder="Nombre del responsable"
                        {...register("responsible")}
                      />
                    </div>
                    {errors.responsible && (
                      <p className="help is-danger">
                        {errors.responsible.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="columns">
                <div className="column is-6">
                  <div className="field">
                    <label htmlFor="date" className="label">
                      Fecha *
                    </label>
                    <div className="control">
                      <Controller
                        control={control}
                        name="date"
                        render={({ field }) => (
                          <input
                            id="date"
                            type="date"
                            className={`input ${
                              errors.date ? "is-danger" : ""
                            }`}
                            value={field.value ?? ""}
                            onChange={(event) => {
                              field.onChange(event.target.value || undefined);
                            }}
                            onBlur={field.onBlur}
                            ref={field.ref}
                          />
                        )}
                      />
                    </div>
                    {errors.date && (
                      <p className="help is-danger">{errors.date.message}</p>
                    )}
                  </div>
                </div>

                <div className="column is-6">
                  <div className="field">
                    <label htmlFor="time" className="label">
                      Hora *
                    </label>
                    <div className="control">
                      <Controller
                        control={control}
                        name="time"
                        render={({ field }) => (
                          <input
                            id="time"
                            type="time"
                            className={`input ${
                              errors.time ? "is-danger" : ""
                            }`}
                            value={field.value ?? ""}
                            onChange={(event) => {
                              field.onChange(event.target.value || undefined);
                            }}
                            onBlur={field.onBlur}
                            ref={field.ref}
                          />
                        )}
                      />
                    </div>
                    {errors.time && (
                      <p className="help is-danger">{errors.time.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="columns">
                <div className="column is-6">
                  <div className="field">
                    <label htmlFor="location" className="label">
                      Lugar *
                    </label>
                    <div className="control">
                      <input
                        id="location"
                        className={`input ${
                          errors.location ? "is-danger" : ""
                        }`}
                        placeholder="Ej. Sala principal, Biblioteca..."
                        {...register("location")}
                      />
                    </div>
                    {errors.location && (
                      <p className="help is-danger">
                        {errors.location.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="column is-6">
                  <div className="field">
                    <label htmlFor="duration" className="label">
                      Duración (min) *
                    </label>
                    <div className="control">
                      <input
                        id="duration"
                        type="number"
                        min={0}
                        className={`input ${
                          errors.duration ? "is-danger" : ""
                        }`}
                        {...register("duration")}
                      />
                    </div>
                    {errors.duration && (
                      <p className="help is-danger">
                        {errors.duration.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="column is-4">
              <div className="field">
                <label htmlFor="ability" className="label">
                  Capacidad
                </label>
                <div className="control">
                  <input
                    id="ability"
                    type="number"
                    min={0}
                    className={`input ${errors.ability ? "is-danger" : ""}`}
                    {...register("ability", { valueAsNumber: true })}
                  />
                </div>
                {errors.ability && (
                  <p className="help is-danger">{errors.ability.message}</p>
                )}
              </div>

              <div className="field">
                <label htmlFor="link" className="label">
                  Enlace de registro
                </label>
                <div className="control has-icons-left">
                  <input
                    id="link"
                    type="url"
                    className={`input ${errors.link ? "is-danger" : ""}`}
                    placeholder="https://"
                    {...register("link")}
                  />
                  <span className="icon is-left">
                    <i className="fas fa-link" />
                  </span>
                </div>
                {errors.link && (
                  <p className="help is-danger">{errors.link.message}</p>
                )}
              </div>

              <div className="field">
                <label htmlFor="notes" className="label">
                  Notas internas
                </label>
                <div className="control">
                  <textarea
                    id="notes"
                    className={`textarea ${errors.notes ? "is-danger" : ""}`}
                    placeholder="Indicaciones para el equipo: materiales, montaje, accesibilidad..."
                    rows={4}
                    {...register("notes")}
                  />
                </div>
                <p className="help is-grey mt-1">
                  Sólo visible para el equipo organizador.
                </p>
                {errors.notes && (
                  <p className="help is-danger">{errors.notes.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="is-flex is-justify-content-space-between is-align-items-center is-flex-wrap-wrap mt-5">
            <button
              type="button"
              className="button is-light is-rounded"
              onClick={() => router.push("/events")}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <div className="buttons">
              <button
                type="submit"
                className={`button is-primary is-rounded has-text-white ${
                  isSubmitting ? "is-loading" : ""
                }`}
                disabled={isSubmitting}
              >
                Guardar evento
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .shadowed-form {
          border-radius: 18px;
          border: none;
          box-shadow: 0 24px 65px -32px rgba(15, 23, 42, 0.35);
        }

        .help.is-grey {
          color: #64748b;
        }

        @media screen and (max-width: 1023px) {
          .shadowed-form {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default EventForm;
