import { NextRequest, NextResponse } from "next/server";
import { writeData } from "@/src/firebase/actions";

export async function POST(request: NextRequest) {
  try {
    const movieData = await request.json();

    if (!movieData?.titulo) {
      return NextResponse.json(
        { status: 400, message: "El título de la película es obligatorio" },
        { status: 400 }
      );
    }

    const payload = {
      ...movieData,
      createdAt: new Date().toISOString(),
    };

    const result = await writeData("movies", payload);

    if (result === 200) {
      return NextResponse.json({
        status: 200,
        message: "Película creada correctamente",
      });
    }

    return NextResponse.json(
      { status: 400, message: "No fue posible crear la película" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error creating movie:", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
