import { NextRequest, NextResponse } from "next/server";
import { updateData } from "@/src/firebase/actions";

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json();

    if (!id) {
      return NextResponse.json(
        { status: 400, message: "El identificador del préstamo es obligatorio" },
        { status: 400 }
      );
    }

    const payload = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const result = await updateData("prestamos", id, payload);

    if (result === 200) {
      return NextResponse.json({
        status: 200,
        message: "Préstamo actualizado correctamente",
      });
    }

    return NextResponse.json(
      { status: 400, message: "No pudimos actualizar el préstamo" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error actualizando préstamo:", error);
    return NextResponse.json(
      { status: 500, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
