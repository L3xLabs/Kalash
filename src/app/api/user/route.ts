import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    // Parse the incoming JSON data
    const newRole = await request.json();

    // Define the path to the role.json file
    const filePath = path.join(process.cwd(), "db/Role.json");

    // Read the existing data from role.json
    const fileData = await fs.readFile(filePath, "utf-8");
    const roles = JSON.parse(fileData);

    // Append the new role to the existing roles
    roles.push(newRole);

    // Write the updated roles back to role.json
    await fs.writeFile(filePath, JSON.stringify(roles, null, 2));

    // Return a success response with the added role
    return NextResponse.json(
      {
        message: "Role added successfully",
        addedRole: newRole,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error writing to role.json:", error);
    return NextResponse.json({ error: "Failed to add role" }, { status: 500 });
  }
}
