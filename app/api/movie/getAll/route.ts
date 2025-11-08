import { NextResponse } from "next/server";
import { getDataPagination } from "@/src/firebase/actions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = parseInt(searchParams.get("page") ?? "1", 10);
    const limitParam = parseInt(searchParams.get("limit") ?? "12", 10);

    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const limit =
      Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 12;

    const result = await getDataPagination("movies", page, limit);

    return NextResponse.json({
      movies: result.data,
      status: 200,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      totalElements: result.totalCount,
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
