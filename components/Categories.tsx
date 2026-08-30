import Image from "next/image";

const categories = [
  { name: "Phones", image: "/assets/phone.png" },
  { name: "PlayStations", image: "/assets/playstation.png" },
  { name: "Digital Watches", image: "/assets/watch.png" },
  { name: "Joysticks", image: "/assets/joystick.png" },
  { name: "EarPods", image: "/assets/airpod.png" },
  { name: "Laptops", image: "/assets/laptop.png" },
];

export default function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <div className="mb-8 flex items-center gap-4">
        <h2 className="text-sm tracking-widest2 text-ink">CATEGORIES</h2>
        <div className="h-px flex-1 bg-[repeating-linear-gradient(90deg,#cfccc6_0,#cfccc6_4px,transparent_4px,transparent_8px)]" />
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((img) => (
          <div
            key={img.name}
            className="group flex flex-col items-center gap-2 border border-line px-4 py-8 transition-colors hover:border-accent"
          >
            <div className="relative h-40 w-20">
              <Image
                src={img.image}
                alt={img.name}
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xs tracking-wide text-ink">{img.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}