import MovieForm from "@/src/views/movies/add/MovieForm";

const EditMoviePage = ({ params }: { params: { id: string } }) => {
  return <MovieForm mode="edit" movieId={params.id} />;
};

export default EditMoviePage;
