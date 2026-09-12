import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";

export default async function AboutPage() {
  const t = await getTranslations("static.about");

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
        <p className="text-xs uppercase tracking-widest2 text-accent">
          {t("kicker")}
        </p>
        <h1 className="mt-3 text-3xl tracking-wide text-ink sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-subtle">
          {t("p1")}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-subtle">
          {t("p2")}
        </p>
      </section>
    </main>
  );
}
