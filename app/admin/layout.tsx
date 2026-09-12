import type { Metadata } from "next";
import { auth } from "@/auth";
import AuthProvider from "@/components/shared/authprovider";
import "../globals.css";

export const metadata: Metadata = {
  title: "ShopLite Admin",
};

// This is a second, independent root layout — Next.js supports multiple
// root layouts as long as each top-level folder under app/ (this one, and
// app/[locale]/) has its own <html>/<body> and there's no app/layout.tsx
// at the very top competing with them. Kept deliberately separate from the
// storefront: single language, different visual theme, no next-intl.
export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased">
        <AuthProvider session={session}>{children}</AuthProvider>
      </body>
    </html>
  );
}
