import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");
import { triggerN8nSearch } from "@/lib/n8nClient";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File;

    if (!file) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const data = await pdf(buffer);
    const resumeText = data.text;

    const userId = parseInt(session.user.id);

    await db.user.update({
      where: { id: userId },
      data: {
        resumeText,
      },
    });

    // Trigger search after uploading resume
    await triggerN8nSearch(userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[UPLOAD_RESUME_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
