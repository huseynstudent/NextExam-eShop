import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Tags, Package, Users, Mail, LogOut } from "lucide-react";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // No session at all, or a session that isn't an admin — either way, back
  // to the login page. (The login page itself already explains why, if
  // someone's signed in with a non-admin account — see app/admin/login.)
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const unreadCount = await prisma.contactMessage.count({
    where: { read: false },
  });

  return (
    <div className="flex min-h-screen">
      <aside className="flex h-screen w-56 shrink-0 flex-col justify-between border-r border-slate-800 p-6">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-white">
            SHOPLITE
          </p>
          <p className="text-xs tracking-[0.18em] text-slate-500">ADMIN</p>

          <nav className="mt-8 flex flex-col gap-1 text-sm">
            <Link
              href="/admin"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              <LayoutDashboard size={16} strokeWidth={1.5} />
              Dashboard
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              <Tags size={16} strokeWidth={1.5} />
              Categories
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              <Package size={16} strokeWidth={1.5} />
              Products
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              <Users size={16} strokeWidth={1.5} />
              Users
            </Link>
            <Link
              href="/admin/messages"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              <Mail size={16} strokeWidth={1.5} />
              Messages
              {unreadCount > 0 && (
                <span className="ml-auto rounded-full bg-[#64FFDA]/10 px-2 py-0.5 text-xs text-[#64FFDA]">
                  {unreadCount}
                </span>
              )}
            </Link>
          </nav>
        </div>

        <div>
          <p className="truncate text-xs text-slate-500">
            {session.user.email}
          </p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
            className="mt-2"
          >
            <button
              type="submit"
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-white"
            >
              <LogOut size={14} strokeWidth={1.5} />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
