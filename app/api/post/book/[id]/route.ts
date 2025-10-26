import { NextRequest, NextResponse } from "next/server";
import { getPostsByBook } from "@/src/firebase/actions";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { status: 400, message: "Book id is required" },
        { status: 400 }
      );
    }

    const posts = await getPostsByBook(id);

    return NextResponse.json({
      status: 200,
      total: posts.length,
      posts,
    });
  } catch (error) {
    console.error("Error fetching posts by book:", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
