import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";
import { signUpAction } from "@/app/[locale]/actions";

export default async function SignUpPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  const { error } = await searchParams;
  const session = await auth();

  if (session) {
    redirect(`/${locale}`);
  }

  const t = await getTranslations("auth");
  const errorMessage =
    error === "EmailInUse"
      ? t("errorEmailInUse")
      : error === "InvalidInput"
      ? t("errorInvalidInput")
      : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-8">
        <div className="text-center">
          <p className="text-lg tracking-widest2">
            <span className="font-semibold">SHOP</span>
            <span className="font-light">LITE</span>
          </p>
          <h1 className="mt-6 text-xl text-ink">{t("signUpTitle")}</h1>
          <p className="mt-2 text-sm text-subtle">{t("signUpSubtitle")}</p>
        </div>

        {errorMessage && (
          <p className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-center text-xs text-red-600">
            {errorMessage}
          </p>
        )}

        <form action={signUpAction} className="mt-6 flex flex-col gap-3">
          <input type="hidden" name="locale" value={locale} />
          <div>
            <label className="text-xs text-subtle">{t("nameLabel")}</label>
            <input
              type="text"
              name="name"
              placeholder={t("namePlaceholder")}
              className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-subtle">{t("emailLabel")}</label>
            <input
              type="email"
              name="email"
              required
              placeholder={t("emailPlaceholder")}
              className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-subtle">{t("passwordLabel")}</label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              placeholder={t("passwordPlaceholder")}
              className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
            />
            <p className="mt-1 text-[0.65rem] text-subtle">
              {t("passwordHint")}
            </p>
          </div>
          <button
            type="submit"
            className="mt-2 h-11 w-full rounded-full bg-accent text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            {t("signUpCta")}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-subtle">
          {t("alreadyHaveAccount")}{" "}
          <Link
            href="/signin"
            className="text-accent underline underline-offset-2"
          >
            {t("goToSignIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
