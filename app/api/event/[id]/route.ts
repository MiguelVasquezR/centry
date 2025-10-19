import { getDataById } from "../../../../src/firebase/actions";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const data = await getDataById("events", id);

    if (!data) {
      return NextResponse.json(
        { message: "Eventos no encontrado", status: 404 },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Eventos obtenido correctamente",
      status: 200,
      book: data,
    });
  } catch (err) {
    return NextResponse.json({ message: String(err), status: 500 });
  }
}
