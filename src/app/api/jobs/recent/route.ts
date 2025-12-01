import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const userId = parseInt(session.user.id);

    const jobs = await db.job.findMany({
      where: { userId },
      orderBy: { score: "desc" },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("[GET_JOBS_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
