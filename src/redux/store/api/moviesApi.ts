import { apiSlice } from "./index";
import { Movie } from "../../../types/movie";

interface MovieApiResponse {
  movie: Movie;
}

export const moviesApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchMovies: build.query<
      {
        movies: Movie[];
        status: number;
        currentPage: number;
        totalPages: number;
        totalElements: number;
      },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/movie/getAll?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["movies"],
    }),
    getMovieById: build.query<Movie, string>({
      query: (id) => `/movie/${id}`,
      transformResponse: (response: MovieApiResponse) => response.movie,
      providesTags: (result, error, id) => [{ type: "movies", id }],
    }),
    createMovie: build.mutation<Movie, Omit<Movie, "id">>({
      query: (movie) => ({
        url: "/movie/create",
        method: "POST",
        body: movie,
      }),
      invalidatesTags: ["movies"],
    }),
    updateMovie: build.mutation<Movie, Movie>({
      query: (movie) => ({
        url: "/movie/update",
        method: "PUT",
        body: {
          id: movie.id,
          data: movie,
        },
      }),
      invalidatesTags: (result, error, movie) => [
        { type: "movies", id: movie.id },
        "movies",
      ],
    }),
    deleteMovie: build.mutation<void, string>({
      query: (id) => ({
        url: "/movie/delete",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, id) => [{ type: "movies", id }, "movies"],
    }),
  }),
});

export const {
  useLazyFetchMoviesQuery,
  useLazyGetMovieByIdQuery,
  useCreateMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
} = moviesApi;
