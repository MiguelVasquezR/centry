import { NextRequest, NextResponse } from "next/server";
import { getCommentsByPostId } from "@/src/firebase/actions";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await context.params;

    if (!postId) {
      return NextResponse.json(
        { status: 400, message: "El id del post es obligatorio" },
        { status: 400 }
      );
    }

    const comments = await getCommentsByPostId(postId);

    return NextResponse.json({
      status: 200,
      total: comments.length,
      comments,
    });
  } catch (error) {
    console.error("Error obteniendo comentarios:", error);
    return NextResponse.json(
      { status: 500, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
