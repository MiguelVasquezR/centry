import { NextRequest, NextResponse } from "next/server";
import { writeData } from "@/src/firebase/actions";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Add server timestamp
    const postWithTimestamp = {
      ...data,
    };

    const result = await writeData("categories", postWithTimestamp);

    if (result === 200) {
      return NextResponse.json({
        status: 200,
        message: "Category created successfully",
      });
    } else {
      return NextResponse.json(
        { status: 400, message: "Failed to create category" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
