import { NextRequest, NextResponse } from "next/server";
import { updateData } from "@/src/firebase/actions";

export async function PUT(request: NextRequest) {
  try {
    const { id, ...postData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { status: 400, message: "Post ID is required" },
        { status: 400 }
      );
    }

    const result = await updateData("posts", id, postData);

    if (result === 200) {
      return NextResponse.json({
        status: 200,
        message: "Post updated successfully",
      });
    } else {
      return NextResponse.json(
        { status: 400, message: "Failed to update post" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
