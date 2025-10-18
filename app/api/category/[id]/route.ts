import { NextRequest, NextResponse } from "next/server";
import { getDataById } from "@/src/firebase/actions";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const post = await getDataById("category", id);

    if (post) {
      return NextResponse.json(post);
    } else {
      return NextResponse.json(
        { status: 404, message: "Category not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
