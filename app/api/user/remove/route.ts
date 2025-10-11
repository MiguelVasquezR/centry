import { NextRequest, NextResponse } from "next/server";
import { deleteData } from "@/src/firebase/actions";

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { status: 400, message: "User ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteData("users", id);

    if (result === 200) {
      return NextResponse.json({
        status: 200,
        message: "User deleted successfully",
      });
    } else {
      return NextResponse.json(
        { status: 400, message: "Failed to delete User" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error deleting User:", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
