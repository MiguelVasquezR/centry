import { getData } from "../../../../src/firebase/actions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      data: await getData("events"),
      status: 200,
    });
  } catch (err) {
    return NextResponse.json({ message: err, status: 500 });
  }
}
