type CategoryType = "event" | "movie" | "book";

interface Category {
  id?: string;
  title: string;
  type: CategoryType;
  description: string;
}
