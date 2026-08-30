import { Truck, Trophy, BadgePercent, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    desc: "Consectetur adipi elit lorem ipsum dolor sit amet.",
  },
  {
    icon: Trophy,
    title: "Quality Guarantee",
    desc: "Dolor sit amet orem ipsu mcons ectetur adipi elit.",
  },
  {
    icon: BadgePercent,
    title: "Daily Offers",
    desc: "Amet consectetur adipi elit loreme ipsum dolor sit.",
  },
  {
    icon: ShieldCheck,
    title: "100% Secure Payment",
    desc: "Rem Lopsum dolor sit amet, consectetur adipi elit.",
  },
];

export default function FeaturesBar() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex gap-4">
            <Icon
              size={26}
              strokeWidth={1.3}
              className="mt-1 shrink-0 text-accent"
            />
            <div>
              <h3 className="text-sm tracking-wide text-ink">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-subtle">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
