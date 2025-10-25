export type CategoryType = "event" | "movie" | "book";

export interface Category {
  id?: string;
  title: string;
  type: CategoryType;
  description: string;
  color?: string;
}
