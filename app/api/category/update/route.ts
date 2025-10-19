import { NextRequest, NextResponse } from "next/server";
import { updateData } from "@/src/firebase/actions";

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json();

    if (!id) {
      return NextResponse.json(
        { status: 400, message: "Category ID is required" },
        { status: 400 }
      );
    }

    const result = await updateData("categories", id, data.data);

    if (result === 200) {
      return NextResponse.json({
        status: 200,
        message: "Category updated successfully",
      });
    } else {
      return NextResponse.json(
        { status: 400, message: "Failed to update category" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
