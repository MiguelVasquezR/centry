import BookForm from "@/src/views/book/add/BookForm";

interface EditBookPageProps {
  params: {
    id: string;
  };
}

const EditBookPage = ({ params }: EditBookPageProps) => {
  return <BookForm bookId={params.id} mode="edit" />;
};

export default EditBookPage;
