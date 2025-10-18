import { NextRequest, NextResponse } from "next/server";
import { getDataByEmail, getDataById } from "@/src/firebase/actions";

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    const { email } = params;

    const user = await getDataByEmail("users", email);

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
