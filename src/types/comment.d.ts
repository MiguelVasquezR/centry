import type { FirestoreTimestamp } from "./postList";

export interface PostComment {
  id?: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  content: string;
  createdAt: string | Date | FirestoreTimestamp;
  updatedAt?: string | Date | FirestoreTimestamp;
}

export type PostCommentPayload = Omit<PostComment, "id" | "createdAt" | "updatedAt">;
