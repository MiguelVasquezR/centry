import { NextRequest, NextResponse } from "next/server";
import { getDataById } from "@/src/firebase/actions";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    console.log(id);

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
    console.log("Error fetching post:", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
