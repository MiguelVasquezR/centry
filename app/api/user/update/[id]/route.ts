import { NextRequest, NextResponse } from "next/server";
import { updateData } from "@/src/firebase/actions";

export async function PUT(request: NextRequest) {
  try {
    const { id, ...userData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { status: 400, message: "User ID is required" },
        { status: 400 }
      );
    }

    const result = await updateData("users", id, userData);

    if (result === 200) {
      return NextResponse.json({
        status: 200,
        message: "User updated successfully",
      });
    } else {
      return NextResponse.json(
        { status: 400, message: "Failed to update User" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error updating User:", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
