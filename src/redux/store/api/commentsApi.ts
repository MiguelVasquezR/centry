import { apiSlice } from "./index";
import type { PostComment, PostCommentPayload } from "@/src/types/comment";

interface CommentResponse {
  status: number;
  message: string;
}

export const commentsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getCommentsByPost: build.query<PostComment[], string>({
      query: (postId) => ({
        url: `/comment/post/${postId}`,
        method: "GET",
      }),
      transformResponse: (response: { comments?: PostComment[] }) =>
        response?.comments ?? [],
      providesTags: (result, error, postId) =>
        result && result.length
          ? [
              ...result.map(({ id }) => ({
                type: "comments" as const,
                id,
              })),
              { type: "comments" as const, id: `post-${postId}` },
            ]
          : [{ type: "comments" as const, id: `post-${postId}` }],
    }),
    createComment: build.mutation<CommentResponse, PostCommentPayload>({
      query: (comment) => ({
        url: "/comment/create",
        method: "POST",
        body: comment,
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "comments", id: `post-${postId}` },
        "comments",
      ],
    }),
    updateComment: build.mutation<
      CommentResponse,
      { id: string; content: string; postId: string }
    >({
      query: ({ id, content }) => ({
        url: "/comment/update",
        method: "PUT",
        body: { id, content },
      }),
      invalidatesTags: (result, error, { postId, id }) => [
        { type: "comments", id },
        { type: "comments", id: `post-${postId}` },
        "comments",
      ],
    }),
    deleteComment: build.mutation<CommentResponse, { id: string; postId: string }>({
      query: ({ id }) => ({
        url: "/comment/delete",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, { postId, id }) => [
        { type: "comments", id },
        { type: "comments", id: `post-${postId}` },
        "comments",
      ],
    }),
  }),
});

export const {
  useGetCommentsByPostQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;
