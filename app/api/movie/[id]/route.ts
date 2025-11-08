import { NextRequest, NextResponse } from "next/server";
import { getDataById } from "@/src/firebase/actions";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { status: 400, message: "El identificador de la película es obligatorio" },
        { status: 400 }
      );
    }

    const movie = await getDataById("movies", id);

    if (!movie) {
      return NextResponse.json(
        { status: 404, message: "Película no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 200,
      movie,
    });
  } catch (error) {
    console.error("Error fetching movie:", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
