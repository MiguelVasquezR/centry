import BookForm from "@/src/views/book/add/BookForm";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";

const AddBookPage = () => {
  return (
    <ProtectedRoute>
      <BookForm mode="add" />
    </ProtectedRoute>
  );
};

export default AddBookPage;
