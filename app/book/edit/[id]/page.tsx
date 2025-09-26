import BookForm from "@/src/views/book/add/BookForm";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";

interface EditBookPageProps {
  params: {
    id: string;
  };
}

const EditBookPage = ({ params }: EditBookPageProps) => {
  return (
    <ProtectedRoute>
      <BookForm bookId={params.id} mode="edit" />
    </ProtectedRoute>
  );
};

export default EditBookPage;
