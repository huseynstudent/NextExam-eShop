import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";

export default async function BlogsPage() {
  const t = await getTranslations("static.blogs");

  const posts = [
    { key: "post1", date: "Aug 12, 2026" },
    { key: "post2", date: "Jul 28, 2026" },
    { key: "post3", date: "Jul 03, 2026" },
  ] as const;

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-10">
        <h1 className="text-3xl tracking-wide text-ink sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-sm text-subtle">{t("subtitle")}</p>

        <div className="mt-10 flex flex-col divide-y divide-line">
          {posts.map((post) => (
            <article key={post.key} className="py-8 first:pt-0">
              <p className="text-xs tracking-widest2 text-subtle">
                {post.date}
              </p>
              <h2 className="mt-2 text-lg text-ink">
                {t(`${post.key}.title`)}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-subtle">
                {t(`${post.key}.excerpt`)}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
