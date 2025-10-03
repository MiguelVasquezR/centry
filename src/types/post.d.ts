export interface Post {
  id?: string;
  authorId: string;
  content: string;
  title: string;
  createdAt: Date;
  reactions: string[];
  readings: string[];
  imageUrl: string[];
  preference: {
    visibleBy: "general" | "generation";
    book: string;
  };
}
