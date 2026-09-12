import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "@/auth";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user.role === "ADMIN") {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] px-6">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.2em] text-[#64FFDA]">
          ShopLite
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-white">
          Admin sign in
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Sign in with a Google account that has admin access to manage
          categories and products.
        </p>

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/admin" });
          }}
          className="mt-8"
        >
          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A7FFEB] to-[#64FFDA] px-4 text-sm font-semibold text-[#1A1A1A] transition-opacity hover:opacity-90"
          >
            Continue with Google
          </button>
        </form>

        {session && session.user.role !== "ADMIN" && (
          <div className="mt-6 rounded-lg bg-amber-400/10 px-3 py-3 text-xs text-amber-300">
            <p>
              Signed in as {session.user.email}, but this account doesn&apos;t
              have admin access. Ask an existing admin to grant it from
              /admin/users, or add it to ADMIN_EMAILS before this account&apos;s
              first-ever sign-in.
            </p>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
              className="mt-2"
            >
              <button type="submit" className="underline underline-offset-4">
                Sign out
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
