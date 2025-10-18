"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTime } from "luxon";
import { eventSchema } from "@/src/schemas/event";
import { useGetCategoriesQuery } from "@/src/redux/store/api/category";

type EventFormValues = z.infer<typeof eventSchema>;

const EventForm = () => {
  const router = useRouter();

  const { data: categories, isLoading: isLoadingCategory } =
    useGetCategoriesQuery(undefined);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      date: DateTime.now().toISO(),
      time: DateTime.now().toISO(),
      duration: "60",
      location: "",
      responsible: "",
      notes: "",
      link: "",
      ability: 20,
    },
  });

  const onSubmit = (data: EventFormValues) => {
    console.log(data);
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
                        <select id="type" {...register("type")}>
                          {/* {typeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))} */}
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
                      Fecha y hora *
                    </label>
                    <div className="control">
                      <Controller
                        control={control}
                        name="date"
                        render={({ field }) => (
                          <input
                            id="date"
                            type="datetime-local"
                            className={`input ${
                              errors.date ? "is-danger" : ""
                            }`}
                            value={watch("date")}
                            onChange={(event) => {
                              const isoValue = event.target.value;
                              const parsed = isoValue
                                ? DateTime.fromISO(isoValue).toJSDate()
                                : undefined;
                              field.onChange(parsed);
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

              <div className="field">
                <label htmlFor="location" className="label">
                  Lugar *
                </label>
                <div className="control">
                  <input
                    id="location"
                    className={`input ${errors.location ? "is-danger" : ""}`}
                    placeholder="Ej. Sala principal, Biblioteca..."
                    {...register("location")}
                  />
                </div>
                {errors.location && (
                  <p className="help is-danger">{errors.location.message}</p>
                )}
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
