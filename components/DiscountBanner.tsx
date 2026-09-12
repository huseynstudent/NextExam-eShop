import Image from "next/image";
import { getTranslations } from "next-intl/server";
import CountdownTimer from "@/components/CountdownTimer";

export default async function DiscountBanner() {
  const t = await getTranslations("discount");

  return (
    <section className="w-full bg-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:px-10 lg:py-20">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src="/assets/trio.png"
            alt="Apple collection — laptop, phone and watch"
            fill
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-contain"
          />
        </div>

        <div>
          <h2 className="text-3xl leading-snug tracking-wide text-ink sm:text-4xl">
            {t("titleLine1")}
            <br />
            {t("titleLine2")}
          </h2>

          <div className="mt-8">
            <CountdownTimer />
          </div>

          <button className="mt-8 rounded-full bg-accent px-8 py-3 text-[0.7rem] tracking-widest2 text-white transition-colors hover:bg-accent-dark">
            {t("cta")}
          </button>
        </div>
      </div>
    </section>
  );
}
