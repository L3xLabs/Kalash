import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rolesPath = path.join(process.cwd(), "db/Role.json");
    const rolesData = await fs.readFile(rolesPath, "utf-8");
    const roles = JSON.parse(rolesData);
    return NextResponse.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "Failed to fetch roles" },
      { status: 500 }
    );
  }
}
