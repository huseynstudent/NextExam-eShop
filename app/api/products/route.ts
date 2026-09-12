import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section") ?? "best-selling";

  const products = await prisma.product.findMany({
    where: { section },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, price, imageUrl, section, sortOrder } = body;

  if (!name || price === undefined || !imageUrl) {
    return NextResponse.json(
      { error: "name, price, and imageUrl are required" },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: {
      name,
      price: Number(price),
      imageUrl,
      section: section || "best-selling",
      sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
