import { deleteData } from "../../../../src/firebase/actions";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({
        message: "ID es requerido",
        status: 400,
      });
    }

    const code = await deleteData("libros", id);

    if (code === 400) {
      return NextResponse.json({
        message: "Libro no fue eliminado, vuelve a intentarlo",
        status: 400,
      });
    }

    return NextResponse.json({
      message: "Libro eliminado correctamente",
      status: 200,
    });
  } catch (err) {
    console.error("Error deleting book:", err);
    return NextResponse.json({ message: String(err), status: 500 });
  }
}
