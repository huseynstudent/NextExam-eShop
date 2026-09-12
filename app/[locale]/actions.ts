"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/passwords";
import { signIn, isBootstrapAdminEmail, auth } from "@/auth";

export async function signUpAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "en");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password || password.length < 8) {
    redirect(`/${locale}/signup?error=InvalidInput`);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirect(`/${locale}/signup?error=EmailInUse`);
  }

  const passwordHash = await hashPassword(password);

  // ADMIN_EMAILS is checked here, once, at creation — same bootstrap rule
  // as the Google flow in auth.ts. After this, role changes only happen
  // via an existing admin at /admin/users.
  await prisma.user.create({
    data: {
      name: name || null,
      email,
      password: passwordHash,
      role: isBootstrapAdminEmail(email) ? "ADMIN" : "USER",
    },
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: `/${locale}`,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(`/${locale}/signin?error=CredentialsSignin`);
    }
    throw error;
  }
}

export async function credentialsSignInAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "en");
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: `/${locale}`,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(`/${locale}/signin?error=CredentialsSignin`);
    }
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Contact form — actually persists to the DB now, readable at /admin/messages.
// ---------------------------------------------------------------------------

export async function submitContactMessage(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    throw new Error("Name, email, and message are all required");
  }

  await prisma.contactMessage.create({ data: { name, email, message } });
}

// ---------------------------------------------------------------------------
// Wishlist + cart. Both require a signed-in user — if there's no session,
// they redirect to sign-in rather than silently failing, so the flow feels
// intentional (click heart while logged out → land on the sign-in page,
// not a dead click or a thrown error).
// ---------------------------------------------------------------------------

export async function toggleWishlist(productId: string, locale: string) {
  const session = await auth();
  if (!session) {
    redirect(`/${locale}/signin`);
  }

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
  } else {
    await prisma.wishlistItem.create({
      data: { userId: session.user.id, productId },
    });
  }

  revalidatePath("/", "layout");
}

export async function addToCart(productId: string, locale: string) {
  const session = await auth();
  if (!session) {
    redirect(`/${locale}/signin`);
  }

  await prisma.cartItem.upsert({
    where: { userId_productId: { userId: session.user.id, productId } },
    update: { quantity: { increment: 1 } },
    create: { userId: session.user.id, productId, quantity: 1 },
  });

  revalidatePath("/", "layout");
}

export async function incrementCartItem(productId: string, locale: string) {
  await addToCart(productId, locale);
}

export async function decrementCartItem(productId: string, locale: string) {
  const session = await auth();
  if (!session) {
    redirect(`/${locale}/signin`);
  }

  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });
  if (!existing) return;

  if (existing.quantity <= 1) {
    await prisma.cartItem.delete({ where: { id: existing.id } });
  } else {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: { decrement: 1 } },
    });
  }

  revalidatePath("/", "layout");
}

export async function removeFromCart(productId: string, locale: string) {
  const session = await auth();
  if (!session) {
    redirect(`/${locale}/signin`);
  }

  await prisma.cartItem.deleteMany({
    where: { userId: session.user.id, productId },
  });

  revalidatePath("/", "layout");
}
