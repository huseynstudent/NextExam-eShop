"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

// Adjust this to whenever the real promotion should end.
const TARGET_DATE = new Date();
TARGET_DATE.setDate(TARGET_DATE.getDate() + 21);
TARGET_DATE.setHours(TARGET_DATE.getHours() + 22, 19, 30, 0);

function getTimeLeft() {
  const diff = Math.max(0, TARGET_DATE.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hrs: Math.floor((diff / (1000 * 60 * 60)) % 24),
    min: Math.floor((diff / (1000 * 60)) % 60),
    sec: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer() {
  const t = useTranslations("discount");
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(
    null
  );

  useEffect(() => {
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const units: { label: string; value: number }[] = [
    { label: t("days"), value: time?.days ?? 0 },
    { label: t("hrs"), value: time?.hrs ?? 0 },
    { label: t("min"), value: time?.min ?? 0 },
    { label: t("sec"), value: time?.sec ?? 0 },
  ];

  return (
    <div className="flex items-start gap-4 sm:gap-6" suppressHydrationWarning>
      {units.map((u, i) => (
        <div key={u.label} className="flex items-start gap-4 sm:gap-6">
          <div className="text-center">
            <span className="text-3xl text-ink sm:text-4xl">
              {time ? String(u.value).padStart(2, "0") : "--"}
            </span>
            <p className="mt-1 text-[0.65rem] uppercase tracking-widest2 text-subtle">
              {u.label}
            </p>
          </div>
          {i < units.length - 1 && (
            <span className="pt-1 text-2xl text-subtle sm:text-3xl">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
