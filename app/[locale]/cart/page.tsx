import { redirect } from "next/navigation";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import {
  incrementCartItem,
  decrementCartItem,
  removeFromCart,
} from "@/app/[locale]/actions";

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session) {
    redirect(`/${locale}/signin`);
  }

  const t = await getTranslations("static.cart");

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
        <h1 className="text-3xl tracking-wide text-ink sm:text-4xl">
          {t("title")}
        </h1>

        {items.length === 0 ? (
          <p className="mt-8 text-sm text-subtle">{t("empty")}</p>
        ) : (
          <>
            <div className="mt-8 flex flex-col divide-y divide-line">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-5">
                  <div className="relative h-16 w-16 shrink-0 bg-[#f7f6f4]">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-ink">{item.product.name}</p>
                    <p className="mt-1 text-sm text-accent">
                      ${item.product.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <form
                      action={decrementCartItem.bind(
                        null,
                        item.productId,
                        locale
                      )}
                    >
                      <button
                        type="submit"
                        aria-label="Decrease quantity"
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-ink hover:border-accent hover:text-accent"
                      >
                        <Minus size={12} strokeWidth={1.5} />
                      </button>
                    </form>
                    <span className="w-6 text-center text-sm text-ink">
                      {item.quantity}
                    </span>
                    <form
                      action={incrementCartItem.bind(
                        null,
                        item.productId,
                        locale
                      )}
                    >
                      <button
                        type="submit"
                        aria-label="Increase quantity"
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-ink hover:border-accent hover:text-accent"
                      >
                        <Plus size={12} strokeWidth={1.5} />
                      </button>
                    </form>
                  </div>

                  <form
                    action={removeFromCart.bind(null, item.productId, locale)}
                  >
                    <button
                      type="submit"
                      aria-label="Remove from cart"
                      className="text-slate-400 hover:text-red-500"
                    >
                      <X size={16} strokeWidth={1.5} />
                    </button>
                  </form>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
              <span className="text-sm tracking-widest2 text-ink">
                {t("totalLabel")}
              </span>
              <span className="text-lg text-accent">
                ${total.toLocaleString()}
              </span>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
