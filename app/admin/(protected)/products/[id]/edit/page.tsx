import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProduct } from "@/app/admin/actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    notFound();
  }

  const updateWithId = updateProduct.bind(null, product.id);

  return (
    <div>
      <h1 className="text-xl font-semibold text-white">Edit product</h1>
      <p className="mt-1 text-sm text-slate-400">{product.name}</p>

      <form
        action={updateWithId}
        className="mt-8 grid max-w-lg grid-cols-1 gap-3 rounded-xl border border-slate-800 bg-slate-900 p-6"
      >
        <div>
          <label className="text-xs text-slate-400">Name</label>
          <input
            name="name"
            defaultValue={product.name}
            required
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-[#64FFDA] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400">Image URL</label>
          <input
            name="imageUrl"
            defaultValue={product.imageUrl}
            required
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-[#64FFDA] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400">Price</label>
          <input
            name="price"
            type="number"
            step="0.01"
            defaultValue={product.price}
            required
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-[#64FFDA] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400">Sort order</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={product.sortOrder}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-[#64FFDA] focus:outline-none"
          />
        </div>
        <div className="mt-2 flex gap-3">
          <button
            type="submit"
            className="rounded-lg bg-[#64FFDA] px-4 py-2 text-sm font-semibold text-[#1A1A1A] hover:opacity-90"
          >
            Save changes
          </button>
          <a
            href="/admin/products"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
