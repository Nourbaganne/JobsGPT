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

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        resumeText: true,
        keywords: true,
        refreshHours: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[GET_PREFERENCES_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
