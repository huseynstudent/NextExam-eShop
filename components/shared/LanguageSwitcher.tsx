"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const labels: Record<string, string> = {
  en: "EN",
  az: "AZ",
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 text-[0.7rem] tracking-widest2">
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-1">
          <button
            onClick={() => router.replace(pathname, { locale: loc })}
            className={`uppercase transition-colors hover:text-accent ${
              loc === locale ? "text-accent" : "text-ink"
            }`}
            aria-current={loc === locale}
          >
            {labels[loc] ?? loc}
          </button>
          {i < routing.locales.length - 1 && (
            <span className="text-line">/</span>
          )}
        </span>
      ))}
    </div>
  );
}
