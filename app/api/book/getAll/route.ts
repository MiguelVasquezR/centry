import { getDataPagination } from "../../../../src/firebase/actions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "0");
    const limit = parseInt(searchParams.get("limit") || "0");

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
