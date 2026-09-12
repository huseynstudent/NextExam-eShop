import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/passwords";

// Comma-separated allowlist, e.g. ADMIN_EMAILS="you@gmail.com,partner@gmail.com"
// This ONLY fires the moment an account is first created (see the jwt
// callback's `trigger === "signUp"` check, and app/[locale]/actions.ts for
// the credentials signup path) — it's purely a bootstrap mechanism to get
// your very first admin without touching the database by hand. After an
// account exists, role changes only happen through an existing admin using
// the Users page at /admin/users. This means an admin's demotion actually
// sticks — it won't get silently re-applied next time that person logs in.
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isBootstrapAdminEmail(email: string) {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = (credentials?.email as string | undefined)
          ?.trim()
          .toLowerCase();
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        // No user, or an account that only ever signed in with Google
        // (password is null) — reject either way without leaking which.
        if (!user || !user.password) return null;

        const valid = await verifyPassword(password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  // JWT sessions (not database sessions) — required for the Credentials
  // provider, and also what lets the admin guard run cheaply in a server
  // layout without an extra DB round trip on every request.
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user?.email) {
        if (trigger === "signUp") {
          // Brand-new account, just created by the adapter (Google's
          // first-ever sign-in for this email). This is the one moment
          // ADMIN_EMAILS is allowed to set the role.
          const dbUser = await prisma.user.update({
            where: { email: user.email },
            data: isBootstrapAdminEmail(user.email) ? { role: "ADMIN" } : {},
          });
          token.role = dbUser.role;
        } else {
          // Returning user, any provider — just read whatever role an
          // admin has since assigned them. Deliberately does NOT
          // re-check ADMIN_EMAILS here.
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
          });
          token.role = dbUser?.role ?? "USER";
        }
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as string) ?? "USER";
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
