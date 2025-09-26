import BookDetails from "@/src/views/book/bookDetails/index";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";

const Index = () => {
  return (
    <ProtectedRoute>
      <BookDetails />
    </ProtectedRoute>
  );
};

export default Index;
