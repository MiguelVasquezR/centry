"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTime } from "luxon";
import { z } from "zod";
import toast from "react-hot-toast";
import Loader from "@/src/component/Loader";
import { useGetBooksQuery } from "@/src/redux/store/api/booksApi";
import { useGetUserFilerQuery } from "@/src/redux/store/api/usersApi";
import { useCreateLoanMutation } from "@/src/redux/store/api/loanApi";
import type { Loan } from "@/src/types/loan";
import type { Book } from "@/src/types/book";
import type { User } from "@/src/types/user";
import Link from "next/link";
import PageHeader from "@/src/component/PageHeader";
import Select from "react-select";

const loanSchema = z.object({
  bookId: z.string().min(1, "Selecciona un libro"),
  userId: z.string().min(1, "Selecciona un usuario"),
  startDate: z.string().min(1, "La fecha de inicio es requerida"),
  dueDate: z.string().min(1, "La fecha de entrega es requerida"),
  notes: z.string().optional(),
});

type LoanFormValues = z.infer<typeof loanSchema>;

const LoanForm = () => {
  const router = useRouter();

  const { data: booksResponse, isLoading: isLoadingBooks } =
    useGetBooksQuery(undefined);
  const { data: groupedUsers = {}, isLoading: isLoadingUsers } =
    useGetUserFilerQuery(undefined);

  const [createLoan, { isLoading: isCreatingLoan }] = useCreateLoanMutation();

  const books: Book[] = useMemo(
    () => (booksResponse?.data as Book[] | undefined) ?? [],
    [booksResponse]
  );

  const users: User[] = useMemo(() => {
    const entries = Object.values(
      groupedUsers as Record<string, User[] | undefined>
    );
    return entries.flatMap((list) => list ?? []);
  }, [groupedUsers]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoanFormValues>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      startDate: DateTime.now().toISODate(),
      dueDate: DateTime.now().plus({ days: 15 }).toISODate(),
    },
  });

  const startDateValue = watch("startDate");

  useEffect(() => {
    if (!startDateValue) {
      return;
    }

    const parsedStart = DateTime.fromISO(startDateValue);
    if (parsedStart.isValid) {
      const dueDate = parsedStart.plus({ days: 15 }).toISODate();
      if (dueDate) {
        setValue("dueDate", dueDate, { shouldDirty: true });
      }
    }
  }, [startDateValue, setValue]);

  const bookOptions = useMemo(
    () =>
      books.map((book) => ({
        value: book.id,
        label: `${book.titulo}${book.autor ? ` — ${book.autor}` : ""}`,
      })),
    [books]
  );

  const userOptions = useMemo(
    () =>
      users.map((user) => ({
        value: user.id,
        label: `${user.name} — ${user.tuition}`,
      })),
    [users]
  );

  const isLoading = isLoadingBooks || isLoadingUsers;

  const onSubmit = handleSubmit(async (values) => {
    try {
      const payload: Omit<Loan, "id"> = {
        bookId: values.bookId,
        userId: values.userId,
        startDate: values.startDate,
        dueDate: values.dueDate,
        status: "active",
        notes: values.notes,
      };

      const response = await createLoan(payload).unwrap();

      if (response.status === 200) {
        toast.success("Préstamo registrado correctamente");
        router.push("/admin");
      } else {
        toast.error("No se pudo registrar el préstamo");
      }
    } catch (error) {
      console.error("Error creating loan", error);
      toast.error("Ocurrió un error al registrar el préstamo");
    }
  });

  const isSubmitDisabled =
    isSubmitting || isCreatingLoan || !books.length || !users.length;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container" style={{ paddingTop: "2rem" }}>
      <br />
      <PageHeader
        title="Registrar préstamo"
        description="Selecciona el libro y la persona responsable del préstamo."
        actions={
          <Link href="/admin" className="button is-text is-small">
            Panel de administración
          </Link>
        }
      />

      <div className="card">
        <div className="card-content">
          <form onSubmit={onSubmit} className="mt-4">
            <div className="field">
              <label className="label">Libro *</label>
              <Controller
                control={control}
                name="bookId"
                render={({ field }) => (
                  <Select
                    instanceId="loan-book-select"
                    inputId="loan-book-select"
                    classNamePrefix="react-select"
                    placeholder="Selecciona un libro"
                    options={bookOptions}
                    value={
                      bookOptions.find(
                        (option) => option.value === field.value
                      ) ?? null
                    }
                    onChange={(option) => field.onChange(option?.value ?? "")}
                    onBlur={field.onBlur}
                    isClearable
                  />
                )}
              />
              {errors.bookId && (
                <p className="help is-danger">{errors.bookId.message}</p>
              )}
            </div>

            <div className="field">
              <label className="label">Usuario *</label>
              <Controller
                control={control}
                name="userId"
                render={({ field }) => (
                  <Select
                    instanceId="loan-user-select"
                    inputId="loan-user-select"
                    classNamePrefix="react-select"
                    placeholder="Selecciona un usuario"
                    options={userOptions}
                    value={
                      userOptions.find(
                        (option) => option.value === field.value
                      ) ?? null
                    }
                    onChange={(option) => field.onChange(option?.value ?? "")}
                    onBlur={field.onBlur}
                    isClearable
                  />
                )}
              />
              {errors.userId && (
                <p className="help is-danger">{errors.userId.message}</p>
              )}
            </div>

            <div className="columns">
              <div className="column">
                <div className="field">
                  <label className="label">Fecha de inicio *</label>
                  <div className="control">
                    <input
                      type="date"
                      className={`input ${errors.startDate ? "is-danger" : ""}`}
                      {...register("startDate")}
                    />
                  </div>
                  {errors.startDate && (
                    <p className="help is-danger">{errors.startDate.message}</p>
                  )}
                </div>
              </div>
              <div className="column">
                <div className="field">
                  <label className="label">Fecha de entrega *</label>
                  <div className="control">
                    <input
                      type="date"
                      className={`input ${errors.dueDate ? "is-danger" : ""}`}
                      readOnly
                      {...register("dueDate")}
                    />
                  </div>
                  {errors.dueDate && (
                    <p className="help is-danger">{errors.dueDate.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label">Notas</label>
              <div className="control">
                <textarea
                  className="textarea"
                  placeholder="Comentarios adicionales, condiciones del préstamo, etc."
                  rows={3}
                  {...register("notes")}
                />
              </div>
            </div>

            <div className="is-flex is-justify-content-flex-end">
              <button
                type="submit"
                className={`button is-primary has-text-white ${
                  isSubmitDisabled ? "is-loading" : ""
                }`}
                disabled={isSubmitDisabled}
              >
                Registrar préstamo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoanForm;
