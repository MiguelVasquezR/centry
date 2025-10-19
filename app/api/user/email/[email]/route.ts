import { NextRequest, NextResponse } from "next/server";
import { getDataByEmail } from "@/src/firebase/actions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const { email } = await params;

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
    console.log("Error fetching user by email:", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
