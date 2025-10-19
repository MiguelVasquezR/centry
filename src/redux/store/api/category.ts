import { Category } from "@/src/types/category";
import { apiSlice } from "./index";

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getCategoryById: build.query<Category, string>({
      query: (id) => `/category/${id}`,
      transformResponse: (response: Category) => response,
      providesTags: (result, error, id) => [{ type: "category", id }],
    }),
    createCategory: build.mutation<Category, Omit<Category, "id">>({
      query: (book) => ({
        url: "/category/create",
        method: "POST",
        body: book,
      }),
      invalidatesTags: ["category"],
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
    getCategories: build.query<Category[], void>({
      query: () => ({
        url: "/category/getAll",
        method: "GET",
      }),
      providesTags: ["category"],
      transformResponse: (response: {
        category: Category[];
        status: number;
      }) => {
        return response?.category || [];
      },
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useLazyGetCategoryByIdQuery,
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} = categoryApi;
