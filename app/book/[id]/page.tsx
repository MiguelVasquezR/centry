import BookDetails from "@/src/views/book/bookDetails/index";

interface BookPageProps {
  params: {
    id: string;
  };
}

const Index = ({ params }: BookPageProps) => {
  return <BookDetails bookId={params.id} />;
};

export default Index;
