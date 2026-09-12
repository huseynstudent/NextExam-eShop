import { getTranslations } from "next-intl/server";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import ProductCard from "@/components/ProductCard";

export default async function BestSelling({ locale }: { locale: string }) {
  const t = await getTranslations("bestSelling");
  const session = await auth();

  const [products, wishlist] = await Promise.all([
    prisma.product.findMany({
      where: { section: "best-selling" },
      orderBy: { sortOrder: "asc" },
    }),
    session
      ? prisma.wishlistItem.findMany({
          where: { userId: session.user.id },
          select: { productId: true },
        })
      : Promise.resolve([]),
  ]);
  const wishlistedIds = new Set(wishlist.map((w) => w.productId));

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <div className="mb-8 flex items-center gap-4">
        <h2 className="text-sm tracking-widest2 text-ink">
          {t("heading")}
        </h2>
        <div className="h-px flex-1 bg-[repeating-linear-gradient(90deg,#cfccc6_0,#cfccc6_4px,transparent_4px,transparent_8px)]" />
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-subtle">{t("empty")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
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

      <button
        aria-label="Previous products"
        className="absolute left-0 top-1/2 hidden -translate-y-1/2 -translate-x-1/2 rounded-full border border-line bg-white p-2 text-ink hover:border-accent hover:text-accent lg:flex"
      >
        <ChevronLeft size={18} strokeWidth={1.5} />
      </button>
      <button
        aria-label="Next products"
        className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 rounded-full border border-line bg-white p-2 text-ink hover:border-accent hover:text-accent lg:flex"
      >
        <ChevronRight size={18} strokeWidth={1.5} />
      </button>
    </section>
  );
}
