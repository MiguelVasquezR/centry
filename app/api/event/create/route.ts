import { writeData } from "../../../../src/firebase/actions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const code = await writeData("events", body);

    if (code === 400) {
      return NextResponse.json({
        message: "Evento no guardado, vuelve a intentarlo",
        status: 400,
      });
    }

    return NextResponse.json({
      message: "Evento guardado correctamente",
      status: 200,
    });
  } catch (err) {
    return NextResponse.json({ message: String(err), status: 500 });
  }
}
