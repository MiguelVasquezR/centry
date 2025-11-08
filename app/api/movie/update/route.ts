import { NextRequest, NextResponse } from "next/server";
import { updateData } from "@/src/firebase/actions";

export async function PUT(request: NextRequest) {
  try {
    const { id, data } = await request.json();

    if (!id || !data) {
      return NextResponse.json(
        { status: 400, message: "Los datos para actualizar son inválidos" },
        { status: 400 }
      );
    }

    const payload = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const result = await updateData("movies", id, payload);

    if (result === 200) {
      return NextResponse.json({
        status: 200,
        message: "Película actualizada correctamente",
      });
    }

    return NextResponse.json(
      { status: 400, message: "No se pudo actualizar la película" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error updating movie:", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
