import Image from "next/image";
import { Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { createCategory, deleteCategory } from "@/app/admin/actions";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <h1 className="text-xl font-semibold text-white">Categories</h1>
      <p className="mt-1 text-sm text-slate-400">
        Shown on the storefront&apos;s Categories section, in sort order.
        Image can be a path under /public (e.g. /assets/phone.png) or any
        external image URL.
      </p>

      <form
        action={createCategory}
        className="mt-8 grid grid-cols-1 gap-3 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:grid-cols-4"
      >
        <input
          name="name"
          placeholder="Name (e.g. Phones)"
          required
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-[#64FFDA] focus:outline-none"
        />
        <input
          name="imageUrl"
          placeholder="/assets/phone.png"
          required
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-[#64FFDA] focus:outline-none sm:col-span-2"
        />
        <input
          name="sortOrder"
          type="number"
          placeholder="Sort order"
          defaultValue={categories.length}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-[#64FFDA] focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-[#64FFDA] px-4 py-2 text-sm font-semibold text-[#1A1A1A] hover:opacity-90 sm:col-span-4"
        >
          Add category
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">Image</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Sort</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {categories.map((cat) => (
              <tr key={cat.id} className="text-slate-200">
                <td className="px-4 py-3">
                  <div className="relative h-10 w-10">
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </td>
                <td className="px-4 py-3">{cat.name}</td>
                <td className="px-4 py-3 text-slate-400">{cat.sortOrder}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <a
                      href={`/admin/categories/${cat.id}/edit`}
                      className="text-xs text-slate-400 underline underline-offset-4 hover:text-white"
                    >
                      Edit
                    </a>
                    <form action={deleteCategory.bind(null, cat.id)}>
                      <button
                        type="submit"
                        aria-label={`Delete ${cat.name}`}
                        className="text-slate-500 hover:text-red-400"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
