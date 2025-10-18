import { NextRequest, NextResponse } from "next/server";
import { deleteData } from "@/src/firebase/actions";

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { status: 400, message: "Category ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteData("category", id);

    if (result === 200) {
      return NextResponse.json({
        status: 200,
        message: "Category deleted successfully",
      });
    } else {
      return NextResponse.json(
        { status: 400, message: "Failed to delete category" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
