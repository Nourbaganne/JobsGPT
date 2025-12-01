import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Missing job ID", { status: 400 });
    }

    const userId = parseInt(session.user.id);

    // Ensure the job belongs to the user
    const job = await db.job.findFirst({
      where: {
        id: parseInt(id),
        userId,
      },
    });

    if (!job) {
      return new NextResponse("Job not found or unauthorized", { status: 404 });
    }

    await db.job.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE_JOB_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
