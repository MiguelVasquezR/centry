import { apiSlice } from "./index";
import { Post } from "../../../types/post";

export const postsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchPosts: build.query<
      {
        posts: Post[];
        status: number;
        currentPage: number;
        totalPages: number;
        totalElements: number;
      },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `post/getAll?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.posts.map(({ id }) => ({ type: "posts" as const, id })),
              "posts",
            ]
          : ["posts"],
    }),
    fetchPostById: build.query<Post, string>({
      query: (id) => ({
        url: `post/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "posts", id }],
    }),
    createPost: build.mutation<{ status: number }, Omit<Post, "id">>({
      query: (post) => ({
        url: "post/create",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["posts"],
    }),
    updatePost: build.mutation<{ status: number }, Post>({
      query: ({ id, ...post }) => ({
        url: `post/update`,
        method: "PUT",
        body: { id, ...post },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "posts", id }],
    }),
    deletePost: build.mutation<{ status: number }, string>({
      query: (id) => ({
        url: `post/delete`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, id) => [{ type: "posts", id }],
    }),
    fetchPostsByBook: build.query<Post[], string>({
      query: (bookId) => ({
        url: `post/book/${bookId}`,
        method: "GET",
      }),
      transformResponse: (response: {
        posts?: Post[];
        status?: number;
        total?: number;
      }) => response?.posts ?? [],
      providesTags: (result, error, bookId) =>
        result && result.length
          ? [
              ...result.map(({ id }) => ({ type: "posts" as const, id })),
              { type: "posts" as const, id: `book-${bookId}` },
            ]
          : [{ type: "posts" as const, id: `book-${bookId}` }],
    }),
  }),
});

export const {
  useFetchPostsQuery,
  useLazyFetchPostsQuery,
  useFetchPostByIdQuery,
  useFetchPostsByBookQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApi;
