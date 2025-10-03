import { NextRequest, NextResponse } from "next/server";
import { getDataPagination } from "@/src/firebase/actions";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const result = await getDataPagination("posts", page, limit);

    if (result.status === 200) {
      return NextResponse.json({
        posts: result.data,
        status: 200,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalElements: result.totalCount,
      });
    } else {
      return NextResponse.json(
        { status: 500, message: "Failed to fetch posts" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
