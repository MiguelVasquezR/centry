import { NextRequest, NextResponse } from "next/server";
import { writeData } from "@/src/firebase/actions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const loanPayload = {
      ...body,
      status: body?.status ?? "active",
      createdAt: new Date().toISOString(),
    };

    const result = await writeData("prestamos", loanPayload);

    if (result === 200) {
      return NextResponse.json({ status: 200, message: "Loan created" });
    }

    return NextResponse.json(
      { status: 400, message: "Failed to create loan" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error creating loan:", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
