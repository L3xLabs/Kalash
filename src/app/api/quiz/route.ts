import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

interface QuizEntry {
  username: string;
  answers: (string | number)[];
}

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming JSON data
    const { username, answers }: QuizEntry = await request.json();

    // Validate the received data
    if (!username || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    // Define the path to the Quiz.json file
    const filePath = path.join(process.cwd(), "db", "Quiz.json");

    // Read the existing data from the file
    let fileData: QuizEntry[] = [];
    try {
      const data = await fs.readFile(filePath, "utf-8");
      fileData = JSON.parse(data);
    } catch (error) {
      // If the file doesn't exist, we'll create it later
      if (error.code !== "ENOENT") {
        throw error;
      }
    }

    // Append the new quiz entry
    fileData.push({ username, answers });

    // Write the updated data back to the file
    await fs.writeFile(filePath, JSON.stringify(fileData, null, 2));

    // Return a success response
    return NextResponse.json(
      { message: "Quiz results saved successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving quiz results:", error);
    return NextResponse.json(
      { error: "Failed to save quiz results" },
      { status: 500 }
    );
  }
}
