import { apiSlice } from "./index";
import { Book } from "../../../types/book";

interface BookApiResponse {
  book: Book;
}

export const booksApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchBooks: build.query({
      query: ({ page, limit }) => ({
        url: `/book/getAll?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["books"],
    }),
    getBookById: build.query<Book, string>({
      query: (id) => `/book/${id}`,
      transformResponse: (response: BookApiResponse) => response.book,
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
    getBooks: build.query({
      query: () => ({
        url: "/book/get",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLazyFetchBooksQuery,
  useLazyGetBookByIdQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useGetBooksQuery,
} = booksApi;
