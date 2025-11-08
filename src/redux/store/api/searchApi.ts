import { apiSlice } from "./index";
import type { Book } from "@/src/types/book";
import type { User } from "@/src/types/user";
import type { Movie } from "@/src/types/movie";

export type SearchResults = {
  books: Book[];
  users: User[];
  movies: Movie[];
};

export const searchApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    searchEntities: build.query<SearchResults, string>({
      query: (term) => ({
        url: `/search?q=${encodeURIComponent(term)}`,
        method: "GET",
      }),
      transformResponse: (response: { results?: SearchResults }) =>
        response?.results ?? { books: [], users: [], movies: [] },
    }),
  }),
});

export const { useLazySearchEntitiesQuery } = searchApi;
