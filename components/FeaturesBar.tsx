import { getTranslations } from "next-intl/server";
import { Truck, Trophy, BadgePercent, ShieldCheck } from "lucide-react";

const featureKeys = [
  { key: "freeDelivery", icon: Truck },
  { key: "quality", icon: Trophy },
  { key: "dailyOffers", icon: BadgePercent },
  { key: "securePayment", icon: ShieldCheck },
] as const;

export default async function FeaturesBar() {
  const t = await getTranslations("features");

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {featureKeys.map(({ key, icon: Icon }) => (
          <div key={key} className="flex gap-4">
            <Icon
              size={26}
              strokeWidth={1.3}
              className="mt-1 shrink-0 text-accent"
            />
            <div>
              <h3 className="text-sm tracking-wide text-ink">
                {t(`${key}.title`)}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-subtle">
                {t(`${key}.desc`)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
