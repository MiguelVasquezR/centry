export type LoanStatus = "requested" | "active" | "returned" | "rejected";

export interface Loan {
  id?: string;
  bookId: string;
  userId: string;
  startDate: string;
  dueDate: string;
  status: LoanStatus;
  notes?: string;
  bookTitle?: string;
  userName?: string;
  userEmail?: string;
  createdAt?: string;
}
