import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

interface Stats {
  totalRoles: number;
  totalModules: number;
}

export async function GET() {
  try {
    const rolesPath = path.join(process.cwd(), "db/Role.json");
    const modulesPath = path.join(process.cwd(), "db/Modules.json");

    const [rolesData, modulesData] = await Promise.all([
      fs.readFile(rolesPath, "utf-8"),
      fs.readFile(modulesPath, "utf-8"),
    ]);

    const roles = JSON.parse(rolesData);
    const modules = JSON.parse(modulesData);

    const stats: Stats = {
      totalRoles: roles.length,
      totalModules: modules.length,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
