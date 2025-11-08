import { NextRequest, NextResponse } from "next/server";
import { getLoansByBookId } from "@/src/firebase/actions";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await context.params;

    if (!bookId) {
      return NextResponse.json(
        { status: 400, message: "El identificador del libro es obligatorio" },
        { status: 400 }
      );
    }

    const loans = await getLoansByBookId(bookId);

    return NextResponse.json({
      status: 200,
      data: loans,
    });
  } catch (error) {
    console.error("Error al obtener préstamos por libro:", error);
    return NextResponse.json(
      { status: 500, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
