import { updateData } from "../../../../src/firebase/actions";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    console.log(request);
    const body = await request.json();
    console.log(body);
    const { id, data } = body;

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
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: String(err), status: 500 });
  }
}
