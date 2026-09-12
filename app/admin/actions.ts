"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { hashPassword } from "@/lib/passwords";

async function assertAdmin() {
  const session = await requireAdmin();
  if (!session) {
    // Defense in depth — the (protected) layout already blocks page loads,
    // but a Server Action can in principle be invoked directly, so it
    // re-checks the session itself rather than trusting the caller.
    throw new Error("Unauthorized");
  }
  return session;
}

export async function createCategory(formData: FormData) {
  await assertAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0);

  if (!name || !imageUrl) {
    throw new Error("Name and image URL are required");
  }

  await prisma.category.create({
    data: { name, imageUrl, sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
  await assertAdmin();
  await prisma.category.delete({ where: { id } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  await assertAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0);

  if (!name || !imageUrl) {
    throw new Error("Name and image URL are required");
  }

  await prisma.category.update({
    where: { id },
    data: { name, imageUrl, sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/categories");
}

export async function createProduct(formData: FormData) {
  await assertAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const price = Number(formData.get("price") ?? NaN);
  const sortOrder = Number(formData.get("sortOrder") ?? 0);

  if (!name || !imageUrl || Number.isNaN(price)) {
    throw new Error("Name, image URL, and a valid price are required");
  }

  await prisma.product.create({
    data: {
      name,
      imageUrl,
      price,
      sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
      section: "best-selling",
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/products");
}

export async function deleteProduct(id: string) {
  await assertAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  await assertAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const price = Number(formData.get("price") ?? NaN);
  const sortOrder = Number(formData.get("sortOrder") ?? 0);

  if (!name || !imageUrl || Number.isNaN(price)) {
    throw new Error("Name, image URL, and a valid price are required");
  }

  await prisma.product.update({
    where: { id },
    data: {
      name,
      imageUrl,
      price,
      sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/products");
}

export async function setUserRole(userId: string, role: "ADMIN" | "USER") {
  const session = await assertAdmin();

  if (session.user.id === userId) {
    // Prevents an admin from locking themselves out by accident. If you
    // genuinely need to demote yourself, have a different admin do it.
    throw new Error("You can't change your own role.");
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
}

export async function createUser(formData: FormData) {
  await assertAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = formData.get("role") === "ADMIN" ? "ADMIN" : "USER";

  if (!email || !password || password.length < 8) {
    throw new Error("Email and a password of at least 8 characters are required");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("That email is already registered");
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.create({
    data: { name: name || null, email, password: passwordHash, role },
  });

  revalidatePath("/admin/users");
}

export async function deleteUser(userId: string) {
  const session = await assertAdmin();

  if (session.user.id === userId) {
    throw new Error("You can't delete your own account.");
  }

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
}

export async function toggleMessageRead(id: string, read: boolean) {
  await assertAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { read } });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await assertAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/messages");
}
