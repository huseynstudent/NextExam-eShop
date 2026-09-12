import Image from "next/image";
import { Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { createProduct, deleteProduct } from "@/app/admin/actions";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    where: { section: "best-selling" },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <h1 className="text-xl font-semibold text-white">Products</h1>
      <p className="mt-1 text-sm text-slate-400">
        Shown on the storefront&apos;s Best Selling Items section, in sort
        order. Image can be a path under /public (e.g. /assets/tablet.png)
        or any external image URL. Price is in whole dollars.
      </p>

      <form
        action={createProduct}
        className="mt-8 grid grid-cols-1 gap-3 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:grid-cols-5"
      >
        <input
          name="name"
          placeholder="Name (e.g. iPad (9th Gen))"
          required
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-[#64FFDA] focus:outline-none sm:col-span-2"
        />
        <input
          name="imageUrl"
          placeholder="/assets/tablet.png"
          required
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-[#64FFDA] focus:outline-none sm:col-span-2"
        />
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          required
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-[#64FFDA] focus:outline-none"
        />
        <input
          name="sortOrder"
          type="number"
          placeholder="Sort order"
          defaultValue={products.length}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-[#64FFDA] focus:outline-none sm:col-span-4"
        />
        <button
          type="submit"
          className="rounded-lg bg-[#64FFDA] px-4 py-2 text-sm font-semibold text-[#1A1A1A] hover:opacity-90"
        >
          Add product
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">Image</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Sort</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {products.map((p) => (
              <tr key={p.id} className="text-slate-200">
                <td className="px-4 py-3">
                  <div className="relative h-10 w-10">
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </td>
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3 text-[#64FFDA]">
                  ${p.price.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-slate-400">{p.sortOrder}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <a
                      href={`/admin/products/${p.id}/edit`}
                      className="text-xs text-slate-400 underline underline-offset-4 hover:text-white"
                    >
                      Edit
                    </a>
                    <form action={deleteProduct.bind(null, p.id)}>
                      <button
                        type="submit"
                        aria-label={`Delete ${p.name}`}
                        className="text-slate-500 hover:text-red-400"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
