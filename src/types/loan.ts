export interface Loan {
  id?: string;
  bookId: string;
  userId: string;
  startDate: string;
  dueDate: string;
  status: "active" | "returned";
  notes?: string;
  bookTitle?: string;
  userName?: string;
  userEmail?: string;
}
