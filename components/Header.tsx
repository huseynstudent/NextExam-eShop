import { Search, User, Heart, ShoppingCart, ChevronDown } from "lucide-react";

const navItems = [
  { label: "Home", active: true },
  { label: "About" },
  { label: "Shop" },
  { label: "Blogs" },
  { label: "Pages", hasDropdown: true },
  { label: "Contact" },
];

export default function Header() {
  return (
    <header className="w-full border-b border-line">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <a href="#" className="text-lg tracking-widest2">
          <span className="font-semibold">SHOP</span>
          <span className="font-light">LITE</span>
        </a>

        <nav className="hidden items-center gap-9 text-[0.7rem] tracking-widest2 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`flex items-center gap-1 uppercase transition-colors hover:text-accent ${
                item.active ? "text-accent" : "text-ink"
              }`}
            >
              {item.label}
              {item.hasDropdown && <ChevronDown size={12} strokeWidth={1.5} />}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5 text-ink">
          <button aria-label="Search" className="hover:text-accent">
            <Search size={18} strokeWidth={1.5} />
          </button>
          <button aria-label="Account" className="hover:text-accent">
            <User size={18} strokeWidth={1.5} />
          </button>
          <button aria-label="Wishlist" className="hover:text-accent">
            <Heart size={18} strokeWidth={1.5} />
          </button>
          <button aria-label="Cart" className="hover:text-accent">
            <ShoppingCart size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
}
