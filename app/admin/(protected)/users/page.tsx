import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { setUserRole, createUser, deleteUser } from "@/app/admin/actions";

export default async function AdminUsersPage() {
  const session = await auth();
  const users = await prisma.user.findMany({
    orderBy: { email: "asc" },
  });

  return (
    <div>
      <h1 className="text-xl font-semibold text-white">Users</h1>
      <p className="mt-1 text-sm text-slate-400">
        Everyone who has signed in (Google or email/password), plus anyone
        you add here directly. Roles only ever change through this page.
      </p>

      <form
        action={createUser}
        className="mt-8 grid grid-cols-1 gap-3 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:grid-cols-5"
      >
        <input
          name="name"
          placeholder="Name (optional)"
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-[#64FFDA] focus:outline-none"
        />
        <input
          name="email"
          type="email"
          placeholder="email@example.com"
          required
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-[#64FFDA] focus:outline-none"
        />
        <input
          name="password"
          type="password"
          placeholder="Temp password (8+ chars)"
          required
          minLength={8}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-[#64FFDA] focus:outline-none"
        />
        <select
          name="role"
          defaultValue="USER"
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-[#64FFDA] focus:outline-none"
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button
          type="submit"
          className="rounded-lg bg-[#64FFDA] px-4 py-2 text-sm font-semibold text-[#1A1A1A] hover:opacity-90"
        >
          Add user
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.map((u) => {
              const isSelf = u.id === session?.user.id;
              const nextRole = u.role === "ADMIN" ? "USER" : "ADMIN";

              return (
                <tr key={u.id} className="text-slate-200">
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {u.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        u.role === "ADMIN"
                          ? "bg-[#64FFDA]/10 text-[#64FFDA]"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isSelf ? (
                      <span className="text-xs text-slate-600">(you)</span>
                    ) : (
                      <div className="flex items-center justify-end gap-3">
                        <form action={setUserRole.bind(null, u.id, nextRole)}>
                          <button
                            type="submit"
                            className="text-xs text-slate-400 underline underline-offset-4 hover:text-white"
                          >
                            {u.role === "ADMIN" ? "Revoke admin" : "Make admin"}
                          </button>
                        </form>
                        <form action={deleteUser.bind(null, u.id)}>
                          <button
                            type="submit"
                            className="text-xs text-red-500 underline underline-offset-4 hover:text-red-400"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                  No users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
