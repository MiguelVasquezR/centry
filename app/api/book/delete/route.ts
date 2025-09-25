import { deleteData } from "../../../../src/firebase/actions";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || "0";

    const code = await deleteData("libros", id);

    if (code === 400) {
      return NextResponse.json({
        message: "Libro no fue eliminado, vuelve a intentarlo",
        status: 400,
      });
    }

    return NextResponse.json({
      message: "Libro eliminados correctamente",
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: String(err), status: 500 });
  }
}
