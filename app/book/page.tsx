import BookLibraryView from "@/src/views/book";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";

const Index = () => {
  return (
    <ProtectedRoute>
      <BookLibraryView />
    </ProtectedRoute>
  );
};

export default Index;
