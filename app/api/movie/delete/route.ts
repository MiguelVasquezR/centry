import { NextRequest, NextResponse } from "next/server";
import { deleteData } from "@/src/firebase/actions";

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { status: 400, message: "El identificador de la película es obligatorio" },
        { status: 400 }
      );
    }

    const result = await deleteData("movies", id);

    if (result === 200) {
      return NextResponse.json({
        status: 200,
        message: "Película eliminada correctamente",
      });
    }

    return NextResponse.json(
      { status: 400, message: "No fue posible eliminar la película" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error deleting movie:", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
