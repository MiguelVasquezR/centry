import { NextRequest, NextResponse } from "next/server";
import { writeData } from "@/src/firebase/actions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      postId,
      authorId,
      authorName,
      authorImage = "",
      content,
    } = body ?? {};

    if (!postId || !authorId || !content || typeof content !== "string") {
      return NextResponse.json(
        { status: 400, message: "Datos incompletos para crear el comentario" },
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

    const now = new Date();
    const commentPayload = {
      postId,
      authorId,
      authorName: authorName ?? "",
      authorImage,
      content: trimmedContent,
      createdAt: now,
      updatedAt: now,
    };

    const result = await writeData("comments", commentPayload);

    if (result === 200) {
      return NextResponse.json({
        status: 200,
        message: "Comentario creado correctamente",
      });
    }

    return NextResponse.json(
      { status: 400, message: "No fue posible crear el comentario" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error creando comentario:", error);
    return NextResponse.json(
      { status: 500, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
