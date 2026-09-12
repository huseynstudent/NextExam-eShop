import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// Always hit the DB — this is small, admin-managed data, so freshness
// matters more than caching it.
export const dynamic = "force-dynamic";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, imageUrl, sortOrder } = body;

  if (!name || !imageUrl) {
    return NextResponse.json(
      { error: "name and imageUrl are required" },
      { status: 400 }
    );
  }

  const category = await prisma.category.create({
    data: {
      name,
      imageUrl,
      sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
    },
  });

  return NextResponse.json(category, { status: 201 });
}
