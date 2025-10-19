import { NextRequest, NextResponse } from "next/server";
import { getDataById } from "@/src/firebase/actions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await getDataById("users", id);

    if (user) {
      return NextResponse.json(user);
    } else {
      return NextResponse.json(
        { status: 404, message: "User not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.log("Error fetching user:", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
