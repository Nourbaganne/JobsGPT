import { triggerN8nSearch } from "@/lib/n8nClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = parseInt(session.user.id);
  await triggerN8nSearch(userId);

  return NextResponse.json({ success: true });
}
