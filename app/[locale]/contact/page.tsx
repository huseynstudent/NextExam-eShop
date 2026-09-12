import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import ContactForm from "@/components/ContactForm";

export default async function ContactPage() {
  const t = await getTranslations("static.contact");

  return (
    <main>
      <Header />
      <section className="mx-auto grid max-w-4xl grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-2 lg:px-10">
        <div>
          <h1 className="text-3xl tracking-wide text-ink sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-sm text-subtle">{t("subtitle")}</p>

          <dl className="mt-8 flex flex-col gap-4 text-sm">
            <div>
              <dt className="text-xs tracking-widest2 text-subtle">
                {t("emailLabel")}
              </dt>
              <dd className="mt-1 text-ink">hello@shoplite.example</dd>
            </div>
            <div>
              <dt className="text-xs tracking-widest2 text-subtle">
                {t("hoursLabel")}
              </dt>
              <dd className="mt-1 text-ink">{t("hoursValue")}</dd>
            </div>
          </dl>
        </div>

        <ContactForm
          labels={{
            name: t("nameLabel"),
            email: t("emailFieldLabel"),
            message: t("messageLabel"),
            send: t("sendCta"),
            sentConfirmation: t("sentConfirmation"),
            error: t("errorMessage"),
          }}
        />
      </section>
    </main>
  );
}
