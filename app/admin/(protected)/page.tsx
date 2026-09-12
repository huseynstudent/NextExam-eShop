import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [categoryCount, productCount] = await Promise.all([
    prisma.category.count(),
    prisma.product.count({ where: { section: "best-selling" } }),
  ]);

  return (
    <div>
      <h1 className="text-xl font-semibold text-white">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-400">
        Overview of the storefront catalog — changes here show up on the
        site immediately, no rebuild needed.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Categories
          </p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {categoryCount}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Best-selling products
          </p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {productCount}
          </p>
        </div>
      </div>
    </div>
  );
}
