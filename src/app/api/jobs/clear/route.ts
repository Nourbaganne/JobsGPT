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
    const userId = parseInt(session.user.id);

    await db.job.deleteMany({
      where: {
        userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CLEAR_JOBS_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
