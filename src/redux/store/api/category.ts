import { apiSlice } from "./index";

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getCategoryById: build.query<Category, string>({
      query: (id) => `/book/${id}`,
      transformResponse: (response: Category) => response,
      providesTags: (result, error, id) => [{ type: "books", id }],
    }),
    createCategory: build.mutation<Category, Omit<Category, "id">>({
      query: (book) => ({
        url: "/category/create",
        method: "POST",
        body: book,
      }),
      invalidatesTags: ["books"],
    }),
    updateCategory: build.mutation<Category, Category>({
      query: (book) => ({
        url: "/category/update",
        method: "PUT",
        body: {
          id: book.id,
          data: book,
        },
      }),
      invalidatesTags: (result, error, book) => [
        { type: "category", id: book.id },
        "category",
      ],
    }),
    deleteCategory: build.mutation<void, string>({
      query: (id) => ({
        url: "/category/delete",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, id) => [
        { type: "category", id },
        "category",
      ],
    }),
    getCategories: build.query({
      query: () => ({
        url: "/category/getAll",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useLazyGetCategoryByIdQuery,
  useGetCategoriesQuery,
} = categoryApi;
