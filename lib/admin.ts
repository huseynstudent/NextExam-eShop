import { auth } from "@/auth";

/**
 * Returns the current session if it belongs to an admin, otherwise null.
 * Use this in route handlers and server actions to gate mutations —
 * checking it here (server-side, on every call) matters because the
 * layout-level redirect in app/admin/layout.tsx only protects page loads,
 * not direct calls to a Server Action or API route.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}
