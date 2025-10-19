import { getDataPagination } from "../../../../src/firebase/actions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = parseInt(searchParams.get("page") ?? "1", 10);
    const limitParam = parseInt(searchParams.get("limit") ?? "12", 10);

    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const limit =
      Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 12;

    const data = await getDataPagination("libros", page, limit);

    return NextResponse.json({
      books: data.data,
      status: 200,
      currentPage: data.currentPage,
      totalPages: data.totalPages,
      totalElements: data.totalCount,
    });
  } catch (err) {
    return NextResponse.json({ message: err, status: 500 });
  }
}
