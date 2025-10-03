import { NextRequest, NextResponse } from "next/server";
import { writeData } from "@/src/firebase/actions";

export async function POST(request: NextRequest) {
  try {
    const postData = await request.json();

    // Add server timestamp
    const postWithTimestamp = {
      ...postData,
      createdAt: new Date(),
    };

    const result = await writeData("posts", postWithTimestamp);

    if (result === 200) {
      return NextResponse.json({
        status: 200,
        message: "Post created successfully",
      });
    } else {
      return NextResponse.json(
        { status: 400, message: "Failed to create post" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
