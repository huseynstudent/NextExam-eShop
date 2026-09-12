import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";
import { ChevronLeft, ChevronRight } from "lucide-react";
const GoproScene = dynamic(() => import("@/components/GoproScene"), {
  ssr: false,
});

export default async function Hero() {
  const t = await getTranslations("hero");
  return (
    <section className="relative w-full bg-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:px-10 lg:py-24">
        {/* Copy */}
        <div className="order-2 lg:order-1">
          <h1 className="text-4xl tracking-wide text-ink sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-sm text-subtle">{t("subtitle")}</p>
          <button className="mt-8 rounded-full bg-accent px-8 py-3 text-[0.7rem] tracking-widest2 text-white transition-colors hover:bg-accent-dark">
            {t("cta")}
          </button>
        </div>

        <div className="order-1 flex items-center justify-center lg:order-2">
          <div className="relative flex aspect-square w-full max-w-md items-center justify-center rounded-full bg-[#e9e7e3] sm:max-w-lg">
            <div className="h-full w-full">
              <GoproScene />
            </div>
          </div>
        </div>
      </div>

      {/* Carousel arrows */}
      <button
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-line bg-white p-2 text-ink hover:border-accent hover:text-accent sm:flex lg:left-8"
      >
        <ChevronLeft size={18} strokeWidth={1.5} />
      </button>
      <button
        aria-label="Next slide"
        className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-line bg-white p-2 text-ink hover:border-accent hover:text-accent sm:flex lg:right-8"
      >
        <ChevronRight size={18} strokeWidth={1.5} />
      </button>
    </section>
  );
}