import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("static.shop");
  const session = await auth();

  const [categories, products, wishlist] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({ orderBy: { sortOrder: "asc" } }),
    session
      ? prisma.wishlistItem.findMany({
          where: { userId: session.user.id },
          select: { productId: true },
        })
      : Promise.resolve([]),
  ]);
  const wishlistedIds = new Set(wishlist.map((w) => w.productId));

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <h1 className="text-3xl tracking-wide text-ink sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-sm text-subtle">{t("subtitle")}</p>

        <h2 className="mt-12 text-sm tracking-widest2 text-ink">
          {t("categoriesHeading")}
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex flex-col items-center gap-2 border border-line px-4 py-8"
            >
              <div className="relative h-24 w-16">
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xs tracking-wide text-ink">
                {cat.name}
              </span>
            </div>
          ))}
        </div>

        <h2 className="mt-12 text-sm tracking-widest2 text-ink">
          {t("allProductsHeading")}
        </h2>
        {products.length === 0 ? (
          <p className="mt-6 text-sm text-subtle">{t("empty")}</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                locale={locale}
                isWishlisted={wishlistedIds.has(p.id)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
