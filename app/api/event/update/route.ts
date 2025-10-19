import { updateData } from "../../../../src/firebase/actions";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const { id, data } = body;

    if (!id || !data) {
      return NextResponse.json({
        message: "ID y datos son requeridos",
        status: 400,
      });
    }

    const code = await updateData("events", id, data);

    if (code === 400) {
      return NextResponse.json({
        message: "Evento no fue actualizado, vuelve a intentarlo",
        status: 400,
      });
    }

    return NextResponse.json({
      message: "Evento actualizado correctamente",
      status: 200,
      data: { id, ...data },
    });
  } catch (err) {
    console.error("Error updating event:", err);
    return NextResponse.json({ message: String(err), status: 500 });
  }
}
