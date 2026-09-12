import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q } = await searchParams;
  const t = await getTranslations("static.search");
  const session = await auth();
  const query = (q ?? "").trim();

  const [products, wishlist] = await Promise.all([
    query
      ? prisma.product.findMany({
          where: { name: { contains: query } },
          orderBy: { sortOrder: "asc" },
        })
      : Promise.resolve([]),
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

        {/* Plain GET form — no client JS or server action needed, the
            browser just appends ?q=... and reloads this page. */}
        <form action={`/${locale}/search`} method="GET" className="mt-6 max-w-md">
          <input
            name="q"
            defaultValue={query}
            placeholder={t("placeholder")}
            className="w-full rounded-full border border-line px-4 py-2 text-sm text-ink focus:border-accent focus:outline-none"
          />
        </form>

        {query && (
          <p className="mt-6 text-sm text-subtle">
            {products.length > 0
              ? t("resultsCount", { count: products.length })
              : t("noResults")}
          </p>
        )}

        {products.length > 0 && (
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
