import { apiSlice } from "./index";
import { Loan } from "@/src/types/loan";

export const loanApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    createLoan: build.mutation<
      { status: number; message: string },
      Omit<Loan, "id">
    >({
      query: (loan) => ({
        url: "/loan/create",
        method: "POST",
        body: loan,
      }),
      invalidatesTags: (result, error, loan) => [
        "loan",
        { type: "loan", id: `book-${loan.bookId}` },
      ],
    }),
    getLoans: build.query<Loan[], void>({
      query: () => ({
        url: "/loan/get",
        method: "GET",
      }),
      transformResponse: (response: { data?: Loan[] }) => response?.data ?? [],
      providesTags: ["loan"],
    }),
    getLoansByBook: build.query<Loan[], string>({
      query: (bookId) => ({
        url: `/loan/book/${bookId}`,
        method: "GET",
      }),
      transformResponse: (response: { data?: Loan[] }) => response?.data ?? [],
      providesTags: (result, error, bookId) => [
        { type: "loan", id: `book-${bookId}` },
        "loan",
      ],
    }),
    updateLoan: build.mutation<
      { status: number; message: string },
      { id: string } & Partial<Loan>
    >({
      query: ({ id, ...data }) => ({
        url: "/loan/update",
        method: "PUT",
        body: { id, ...data },
      }),
      invalidatesTags: (result, error, { bookId, id }) => [
        "loan",
        { type: "loan", id: `book-${bookId ?? "unknown"}` },
        id ? { type: "loan", id } : undefined,
      ].filter(Boolean) as { type: string; id?: string }[],
    }),
  }),
});

export const {
  useCreateLoanMutation,
  useGetLoansQuery,
  useGetLoansByBookQuery,
  useUpdateLoanMutation,
} = loanApi;
