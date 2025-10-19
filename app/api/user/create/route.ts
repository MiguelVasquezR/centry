import { NextResponse } from "next/server";
import { writeData } from "@/src/firebase/actions";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/src/firebase/app";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();

   /*  await createUserWithEmailAndPassword(
      auth,
      body.email,
      randomUUID.toString()
    ); */

    const code = await writeData("users", body);

    if (code === 400) {
      return NextResponse.json(
        {
          message: "Usuario no guardado, vuelve a intentarlo",
          status: 400,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Usuario guardado correctamente",
        status: 200,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: `We had an error: ${err}`, status: 500 },
      { status: 500 }
    );
  }
}
