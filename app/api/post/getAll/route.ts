import { NextRequest, NextResponse } from "next/server";
import { getDataPagination } from "@/src/firebase/actions";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = parseInt(searchParams.get("page") ?? "1", 10);
    const limitParam = parseInt(searchParams.get("limit") ?? "12", 10);

    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const limit =
      Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 12;

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
