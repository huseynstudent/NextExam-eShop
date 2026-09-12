import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";

export default async function WishlistPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session) {
    redirect(`/${locale}/signin`);
  }

  const t = await getTranslations("static.wishlist");

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <h1 className="text-3xl tracking-wide text-ink sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-sm text-subtle">{t("subtitle")}</p>

        {items.length === 0 ? (
          <p className="mt-8 text-sm text-subtle">{t("empty")}</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {items.map(({ product }) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                isWishlisted
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
