import { NextRequest, NextResponse } from "next/server";
import { updateData } from "@/src/firebase/actions";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, content } = body ?? {};

    if (!id || !content || typeof content !== "string") {
      return NextResponse.json(
        { status: 400, message: "Datos incompletos para actualizar" },
        { status: 400 }
      );
    }

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return NextResponse.json(
        { status: 400, message: "El comentario no puede estar vacío" },
        { status: 400 }
      );
    }

    const updatePayload = {
      content: trimmedContent,
      updatedAt: new Date(),
    };

    const response = await updateData("comments", id, updatePayload);

    if (response === 200) {
      return NextResponse.json({
        status: 200,
        message: "Comentario actualizado",
      });
    }

    return NextResponse.json(
      { status: 400, message: "No fue posible actualizar el comentario" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error actualizando comentario:", error);
    return NextResponse.json(
      { status: 500, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
