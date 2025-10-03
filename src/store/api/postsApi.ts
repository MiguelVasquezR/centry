import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { Post } from "../../types/post";
import {
  getData,
  getDataById,
  writeData,
  updateData,
  deleteData,
} from "../../firebase/actions";

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      queryFn: async () => {
        try {
          const posts = await getData("posts");
          return { data: posts as Post[] };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: String(error) } };
        }
      },
      providesTags: ["Post"],
    }),
    getPostById: builder.query<Post, string>({
      queryFn: async (id) => {
        try {
          const post = await getDataById("posts", id);
          if (!post) {
            return { error: { status: "NOT_FOUND", error: "Post not found" } };
          }
          return { data: post as Post };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: String(error) } };
        }
      },
      providesTags: (result, error, id) => [{ type: "Post", id }],
    }),
    addPost: builder.mutation<{ status: number }, Omit<Post, "id">>({
      queryFn: async (post) => {
        try {
          const status = await writeData("posts", post);
          return { data: { status } };
        } catch (error) {
          return { error: { status: "CUSTOM_ERROR", error: String(error) } };
        }
      },
      invalidatesTags: ["Post"],
    }),
    updatePost: builder.mutation<{ status: number }, Post>({
      queryFn: async ({ id, ...post }) => {
        try {
          const status = await updateData("posts", id!, post);
          return { data: { status } };
        } catch (error) {
          return { error: { status: "CUSTOM_ERROR", error: String(error) } };
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Post", id }],
    }),
    deletePost: builder.mutation<{ status: number }, string>({
      queryFn: async (id) => {
        try {
          const status = await deleteData("posts", id);
          return { data: { status } };
        } catch (error) {
          return { error: { status: "CUSTOM_ERROR", error: String(error) } };
        }
      },
      invalidatesTags: (result, error, id) => [{ type: "Post", id }],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApi;
