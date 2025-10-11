import type { Post } from "./post";

export type FirestoreTimestamp = { seconds: number; nanoseconds?: number };

export type PostListItem = Post & {
  id: string;
  createdAt?: string | number | Date | FirestoreTimestamp;
};
