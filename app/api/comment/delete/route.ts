import { NextRequest, NextResponse } from "next/server";
import { deleteData } from "@/src/firebase/actions";

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body ?? {};

    if (!id) {
      return NextResponse.json(
        { status: 400, message: "El identificador del comentario es obligatorio" },
        { status: 400 }
      );
    }

    const result = await deleteData("comments", id);

    if (result === 200) {
      return NextResponse.json({
        status: 200,
        message: "Comentario eliminado correctamente",
      });
    }

    return NextResponse.json(
      { status: 400, message: "No fue posible eliminar el comentario" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error eliminando comentario:", error);
    return NextResponse.json(
      { status: 500, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
