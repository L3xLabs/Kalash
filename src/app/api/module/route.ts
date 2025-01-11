import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const moduleName = formData.get("moduleName") as string;
    const contentName = formData.get("contentName") as string;
    const videos = formData.get("videos") as string;
    const tags = formData.get("tags") as string;
    const access = formData.get("access") as string;
    const accessor = formData.get("accessor") ? JSON.parse(formData.get("accessor") as string) : null;
    const summaryPdf = formData.get("summaryPdf") as File | null;

    const moduleData = {
      moduleName,
      content: [
        {
          name: contentName,
          videos: videos.split("\n").map((v) => v.trim()),
          tags: tags.split(",").map((t) => t.trim()),
          access,
          ...(access === "PUBLIC" && { accessor }),
          ...(summaryPdf && { summaryPdf: `/uploads/${summaryPdf.name}` }),
        },
      ],
    };

    // Save module data
    const filePath = path.join(process.cwd(), "db/Modules.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    const modules = JSON.parse(fileData);
    modules.push(moduleData);

    await fs.writeFile(filePath, JSON.stringify(modules, null, 2));

    // Save uploaded file
    if (summaryPdf) {
      const uploadsDir = path.join(process.cwd(), "public/uploads");
      await fs.mkdir(uploadsDir, { recursive: true });
      const pdfPath = path.join(uploadsDir, summaryPdf.name);
      await fs.writeFile(pdfPath, Buffer.from(await summaryPdf.arrayBuffer()));
    }

    return NextResponse.json({ message: "Module added successfully", addedModule: moduleData }, { status: 201 });
  } catch (error) {
    console.error("Error saving module:", error);
    return NextResponse.json({ error: "Failed to save module" }, { status: 500 });
  }
}
