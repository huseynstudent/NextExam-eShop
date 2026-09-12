import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { toggleWishlist, addToCart } from "@/app/[locale]/actions";

export default function ProductCard({
  product,
  locale,
  isWishlisted,
}: {
  product: { id: string; name: string; price: number; imageUrl: string };
  locale: string;
  isWishlisted: boolean;
}) {
  return (
    <div className="group flex flex-col border border-line transition-colors hover:border-accent">
      <div className="relative aspect-[4/3] w-full bg-[#f7f6f4]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 20vw, 45vw"
          className="object-contain p-6"
        />

        <form
          action={toggleWishlist.bind(null, product.id, locale)}
          className="absolute right-2 top-2"
        >
          <button
            type="submit"
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm hover:text-accent"
          >
            <Heart
              size={15}
              strokeWidth={1.5}
              className={isWishlisted ? "fill-accent text-accent" : ""}
            />
          </button>
        </form>
      </div>

      <div className="p-4">
        <h3 className="text-xs tracking-wide text-ink">{product.name}</h3>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-sm text-accent">
            ${product.price.toLocaleString()}
          </p>
          <form action={addToCart.bind(null, product.id, locale)}>
            <button
              type="submit"
              aria-label="Add to cart"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-ink hover:border-accent hover:text-accent"
            >
              <ShoppingCart size={13} strokeWidth={1.5} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
