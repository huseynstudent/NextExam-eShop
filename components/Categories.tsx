import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";

export default async function Categories() {
  const t = await getTranslations("categories");
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <div className="mb-8 flex items-center gap-4">
        <h2 className="text-sm tracking-widest2 text-ink">{t("heading")}</h2>
        <div className="h-px flex-1 bg-[repeating-linear-gradient(90deg,#cfccc6_0,#cfccc6_4px,transparent_4px,transparent_8px)]" />
      </div>

      {categories.length === 0 ? (
        <p className="text-sm text-subtle">{t("empty")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group flex flex-col items-center gap-2 border border-line px-4 py-8 transition-colors hover:border-accent"
            >
              <div className="relative h-40 w-20">
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
      )}
    </section>
  );
}
