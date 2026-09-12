import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth, signIn } from "@/auth";
import { Link } from "@/i18n/navigation";
import { credentialsSignInAction } from "@/app/[locale]/actions";

export default async function SignInPage({
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
    error === "CredentialsSignin" ? t("errorCredentialsSignin") : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-8">
        <div className="text-center">
          <p className="text-lg tracking-widest2">
            <span className="font-semibold">SHOP</span>
            <span className="font-light">LITE</span>
          </p>
          <h1 className="mt-6 text-xl text-ink">{t("pageTitle")}</h1>
          <p className="mt-2 text-sm text-subtle">{t("pageSubtitle")}</p>
        </div>

        {errorMessage && (
          <p className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-center text-xs text-red-600">
            {errorMessage}
          </p>
        )}

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: `/${locale}` });
          }}
          className="mt-6"
        >
          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            {t("continueWithGoogle")}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-line" />
          <span className="text-[0.65rem] tracking-widest2 text-subtle">
            {t("orDivider")}
          </span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <form action={credentialsSignInAction} className="flex flex-col gap-3">
          <input type="hidden" name="locale" value={locale} />
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
              placeholder={t("passwordPlaceholder")}
              className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="mt-2 h-11 w-full rounded-full border border-ink text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
          >
            {t("signInCta")}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-subtle">
          {t("noAccountYet")}{" "}
          <Link
            href="/signup"
            className="text-accent underline underline-offset-2"
          >
            {t("goToSignUp")}
          </Link>
        </p>
      </div>
    </div>
  );
}
