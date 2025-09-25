import { apiSlice } from "./index";
import { Book } from "../../../types/book";

export const booksApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchBooks: build.query<
      {
        books: Book[];
        status: number;
        currentPage: number;
        totalPages: number;
        totalElements: number;
      },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/book/getAll?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["books"],
    }),
    getBookById: build.query<Book, string>({
      query: (id) => `/book/${id}`,
      providesTags: (result, error, id) => [{ type: "books", id }],
    }),
    createBook: build.mutation<Book, Omit<Book, "id">>({
      query: (book) => ({
        url: "/book/create",
        method: "POST",
        body: book,
      }),
      invalidatesTags: ["books"],
    }),
    updateBook: build.mutation<Book, Book>({
      query: (book) => ({
        url: "/book/update",
        method: "PUT",
        body: {
          id: book.id,
          data: book,
        },
      }),
      invalidatesTags: (result, error, book) => [
        { type: "books", id: book.id },
        "books",
      ],
    }),
    deleteBook: build.mutation<void, string>({
      query: (id) => ({
        url: "/book/delete",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, id) => [{ type: "books", id }, "books"],
    }),
  }),
});

export const {
  useLazyFetchBooksQuery,
  useGetBookByIdQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = booksApi;
