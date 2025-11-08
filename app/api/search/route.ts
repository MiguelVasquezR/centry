import { NextRequest, NextResponse } from "next/server";
import { getData } from "@/src/firebase/actions";
import type { Book } from "@/src/types/book";
import type { User } from "@/src/types/user";
import type { Movie } from "@/src/types/movie";

const MAX_RESULTS_PER_GROUP = 5;

const includesTerm = (value: unknown, term: string) => {
  if (!value || typeof value !== "string") {
    return false;
  }
  return value.toLowerCase().includes(term);
};

const filterByTerm = <T,>(
  items: T[],
  term: string,
  fields: (keyof T | ((item: T) => unknown))[]
) => {
  return items
    .filter((item) =>
      fields.some((field) => {
        if (typeof field === "function") {
          const candidate = field(item);
          const value =
            typeof candidate === "string"
              ? candidate
              : String(candidate ?? "");
          return includesTerm(value, term);
        }
        const value = item[field];
        return includesTerm(
          typeof value === "string" ? value : String(value ?? ""),
          term
        );
      })
    )
    .slice(0, MAX_RESULTS_PER_GROUP);
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawTerm = searchParams.get("q") ?? "";
    const normalizedTerm = rawTerm.trim().toLowerCase();

    if (!normalizedTerm) {
      return NextResponse.json(
        { status: 400, message: "El término de búsqueda es requerido" },
        { status: 400 }
      );
    }

    const [booksData, usersData, moviesData] = await Promise.allSettled([
      getData("libros"),
      getData("users"),
      getData("movies"),
    ]);

    const unwrap = (result: PromiseSettledResult<unknown>) =>
      result.status === "fulfilled" ? result.value : [];

    const books = filterByTerm<Book>(
      (unwrap(booksData) ?? []) as Book[],
      normalizedTerm,
      ["titulo", "author", "autor", "descripcion"]
    );

    const users = filterByTerm<User>(
      (unwrap(usersData) ?? []) as User[],
      normalizedTerm,
      ["name", "email", "biography", "tuition"]
    );

    const movies = filterByTerm<Movie>(
      (unwrap(moviesData) ?? []) as Movie[],
      normalizedTerm,
      ["titulo", "director", "genero", "sinopsis"]
    );

    return NextResponse.json({
      status: 200,
      results: {
        books,
        users,
        movies,
      },
    });
  } catch (error) {
    console.error("Error en la búsqueda global:", error);
    return NextResponse.json(
      { status: 500, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
