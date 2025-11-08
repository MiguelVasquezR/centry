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
      invalidatesTags: (result, error, loan) => {
        const tags: { type: "loan"; id?: string }[] = [
          { type: "loan", id: "LIST" },
        ];

        if (loan.bookId) {
          tags.push({ type: "loan", id: `book-${loan.bookId}` });
        }

        return tags;
      },
    }),
    getLoans: build.query<Loan[], void>({
      query: () => ({
        url: "/loan/get",
        method: "GET",
      }),
      transformResponse: (response: { data?: Loan[] }) => response?.data ?? [],
      providesTags: [{ type: "loan", id: "LIST" }],
    }),
    getLoansByBook: build.query<Loan[], string>({
      query: (bookId) => ({
        url: `/loan/book/${bookId}`,
        method: "GET",
      }),
      transformResponse: (response: { data?: Loan[] }) => response?.data ?? [],
      providesTags: (result, error, bookId) => [
        { type: "loan", id: `book-${bookId}` },
        { type: "loan", id: "LIST" },
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
      invalidatesTags: (result, error, { bookId, id }) => {
        const tags: { type: "loan"; id?: string }[] = [
          { type: "loan", id: "LIST" },
        ];

        if (bookId) {
          tags.push({ type: "loan", id: `book-${bookId}` });
        }

        if (id) {
          tags.push({ type: "loan", id });
        }

        return tags;
      },
    }),
  }),
});

export const {
  useCreateLoanMutation,
  useGetLoansQuery,
  useGetLoansByBookQuery,
  useUpdateLoanMutation,
} = loanApi;
