import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const products = [
  { name: "iPad (9th Gen)", price: "$870", image: "/assets/tablet.png" },
  { name: "Drone With Camera", price: "$600", image: "/assets/drone.png" },
  { name: "Apple Watch (2nd Gen)", price: "$400", image: "/assets/watch2.png" },
  { name: "Ultra HD TV", price: "$2000", image: "/assets/monitor.png" },
  { name: "Bluetooth Speaker", price: "$75", image: "/assets/speaker.png" },
];

export default function BestSelling() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <div className="mb-8 flex items-center gap-4">
        <h2 className="text-sm tracking-widest2 text-ink">
          BEST SELLING ITEMS
        </h2>
        <div className="h-px flex-1 bg-[repeating-linear-gradient(90deg,#cfccc6_0,#cfccc6_4px,transparent_4px,transparent_8px)]" />
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {products.map((p) => (
          <div
            key={p.name}
            className="group flex flex-col border border-line transition-colors hover:border-accent"
          >
            <div className="relative aspect-[4/3] w-full bg-[#f7f6f4]">
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(min-width: 1024px) 20vw, 45vw"
                className="object-contain p-6"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xs tracking-wide text-ink">{p.name}</h3>
              <p className="mt-1 text-sm text-accent">{p.price}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        aria-label="Previous products"
        className="absolute left-0 top-1/2 hidden -translate-y-1/2 -translate-x-1/2 rounded-full border border-line bg-white p-2 text-ink hover:border-accent hover:text-accent lg:flex"
      >
        <ChevronLeft size={18} strokeWidth={1.5} />
      </button>
      <button
        aria-label="Next products"
        className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 rounded-full border border-line bg-white p-2 text-ink hover:border-accent hover:text-accent lg:flex"
      >
        <ChevronRight size={18} strokeWidth={1.5} />
      </button>
    </section>
  );
}
