import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { Book } from "../../types/book";
import {
  getData,
  getDataById,
  writeData,
  updateData,
  deleteData,
} from "../../firebase/actions";

export const booksApi = createApi({
  reducerPath: "booksApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Book"],
  endpoints: (builder) => ({
    getBooks: builder.query<Book[], void>({
      queryFn: async () => {
        try {
          const books = await getData("books");
          return { data: books as Book[] };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: String(error) } };
        }
      },
      providesTags: ["Book"],
    }),
    getBookById: builder.query<Book, string>({
      queryFn: async (id) => {
        try {
          const book = await getDataById("books", id);
          if (!book) {
            return { error: { status: "NOT_FOUND", error: "Book not found" } };
          }
          return { data: book as Book };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: String(error) } };
        }
      },
      providesTags: (result, error, id) => [{ type: "Book", id }],
    }),
    addBook: builder.mutation<{ status: number }, Omit<Book, "id">>({
      queryFn: async (book) => {
        try {
          const status = await writeData("books", book);
          return { data: { status } };
        } catch (error) {
          return { error: { status: "CUSTOM_ERROR", error: String(error) } };
        }
      },
      invalidatesTags: ["Book"],
    }),
    updateBook: builder.mutation<{ status: number }, Book>({
      queryFn: async ({ id, ...book }) => {
        try {
          const status = await updateData("books", id, book);
          return { data: { status } };
        } catch (error) {
          return { error: { status: "CUSTOM_ERROR", error: String(error) } };
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Book", id }],
    }),
    deleteBook: builder.mutation<{ status: number }, string>({
      queryFn: async (id) => {
        try {
          const status = await deleteData("books", id);
          return { data: { status } };
        } catch (error) {
          return { error: { status: "CUSTOM_ERROR", error: String(error) } };
        }
      },
      invalidatesTags: (result, error, id) => [{ type: "Book", id }],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetBookByIdQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = booksApi;
