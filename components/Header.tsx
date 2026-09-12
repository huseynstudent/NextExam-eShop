import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Search, User, Heart, ShoppingCart, LogOut } from "lucide-react";
import { auth, signOut } from "@/auth";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[0.6rem] text-white">
      {count}
    </span>
  );
}

export default async function Header() {
  const t = await getTranslations("nav");
  const tAuth = await getTranslations("auth");
  const session = await auth();

  const [wishlistCount, cartAgg] = session
    ? await Promise.all([
        prisma.wishlistItem.count({ where: { userId: session.user.id } }),
        prisma.cartItem.aggregate({
          where: { userId: session.user.id },
          _sum: { quantity: true },
        }),
      ])
    : [0, { _sum: { quantity: 0 } }];
  const cartCount = cartAgg._sum.quantity ?? 0;

  const navItems = [
    { key: "home", label: t("home"), href: "/" },
    { key: "about", label: t("about"), href: "/about" },
    { key: "shop", label: t("shop"), href: "/shop" },
    { key: "blogs", label: t("blogs"), href: "/blogs" },
    { key: "contact", label: t("contact"), href: "/contact" },
  ];

  return (
    <header className="w-full border-b border-line">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link href="/" className="text-lg tracking-widest2">
          <span className="font-semibold">SHOP</span>
          <span className="font-light">LITE</span>
        </Link>

        <nav className="hidden items-center gap-9 text-[0.7rem] tracking-widest2 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="flex items-center gap-1 uppercase text-ink transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5 text-ink">
          <LanguageSwitcher />
          <span className="h-4 w-px bg-line" />
          <Link href="/search" aria-label="Search" className="hover:text-accent">
            <Search size={18} strokeWidth={1.5} />
          </Link>

          {session ? (
            <div className="flex items-center gap-3">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? "Account"}
                  width={22}
                  height={22}
                  className="rounded-full"
                />
              ) : (
                <User size={18} strokeWidth={1.5} />
              )}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  aria-label={tAuth("signOut")}
                  className="hover:text-accent"
                >
                  <LogOut size={16} strokeWidth={1.5} />
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/signin"
              aria-label={tAuth("signIn")}
              className="hover:text-accent"
            >
              <User size={18} strokeWidth={1.5} />
            </Link>
          )}

          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative hover:text-accent"
          >
            <Heart size={18} strokeWidth={1.5} />
            <CountBadge count={wishlistCount} />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative hover:text-accent"
          >
            <ShoppingCart size={18} strokeWidth={1.5} />
            <CountBadge count={cartCount} />
          </Link>
        </div>
      </div>
    </header>
  );
}
