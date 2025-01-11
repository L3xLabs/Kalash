import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const modulesPath = path.join(process.cwd(), "db/Modules.json");
    const modulesData = await fs.readFile(modulesPath, "utf-8");
    const modules = JSON.parse(modulesData);
    return NextResponse.json(modules);
  } catch (error) {
    console.error("Error fetching modules:", error);
    return NextResponse.json(
      { error: "Failed to fetch modules" },
      { status: 500 }
    );
  }
}
