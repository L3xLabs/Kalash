// app/api/courses/route.ts
import { NextResponse } from "next/server";
import coursesData from "../../../../db/Modules.json";

export async function GET() {
  try {
    return NextResponse.json(coursesData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
