import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { triggerN8nSearch } from "@/lib/n8nClient";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { keywords, refreshHours } = body;

    const userId = parseInt(session.user.id);

    await db.user.update({
      where: { id: userId },
      data: {
        keywords,
        refreshHours: parseInt(refreshHours),
      },
    });

    // Trigger search after updating preferences
    await triggerN8nSearch(userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[UPDATE_KEYWORDS_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
