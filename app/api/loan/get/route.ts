import { NextResponse } from "next/server";
import { getData } from "@/src/firebase/actions";

export async function GET() {
  try {
    const loans = await getData("prestamos");

    return NextResponse.json({
      status: 200,
      data: loans,
    });
  } catch (error) {
    console.error("Error fetching loans:", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
