import { apiSlice } from "./index";
import { Loan } from "@/src/types/loan";

export const loanApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    createLoan: build.mutation<{ status: number; message: string }, Omit<Loan, "id">>({
      query: (loan) => ({
        url: "/loan/create",
        method: "POST",
        body: loan,
      }),
      invalidatesTags: ["loan"],
    }),
    getLoans: build.query<Loan[], void>({
      query: () => ({
        url: "/loan/get",
        method: "GET",
      }),
      transformResponse: (response: { data?: Loan[] }) =>
        response?.data ?? [],
      providesTags: ["loan"],
    }),
  }),
});

export const { useCreateLoanMutation, useGetLoansQuery } = loanApi;
