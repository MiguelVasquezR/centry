import { NextResponse } from "next/server";
import { getData } from "@/src/firebase/actions";

export async function GET() {
  try {
    const result = await getData("categories");

    return NextResponse.json({
      category: result,
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
