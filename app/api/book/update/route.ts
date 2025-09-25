import { updateData } from "../../../../src/firebase/actions";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    console.log("Update request body:", body);
    const { id, data } = body;

    if (!id || !data) {
      return NextResponse.json({
        message: "ID y datos son requeridos",
        status: 400,
      });
    }

    const code = await updateData("libros", id, data);

    if (code === 400) {
      return NextResponse.json({
        message: "Libro no fue actualizado, vuelve a intentarlo",
        status: 400,
      });
    }

    return NextResponse.json({
      message: "Libro actualizado correctamente",
      status: 200,
      data: { id, ...data },
    });
  } catch (err) {
    console.error("Error updating book:", err);
    return NextResponse.json({ message: String(err), status: 500 });
  }
}
