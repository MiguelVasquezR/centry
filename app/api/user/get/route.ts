import { NextResponse } from "next/server";
import { getData } from "@/src/firebase/actions";

export async function GET() {
  try {
    const data = await getData("users");

    return NextResponse.json(
      {
        data,
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
