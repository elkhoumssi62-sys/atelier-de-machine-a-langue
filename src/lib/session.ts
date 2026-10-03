import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, type UserRow } from "@/db/schema";

const COOKIE = "mal_session";

export async function getCurrentUser(): Promise<UserRow | null> {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (!raw) return null;
  const id = Number(raw);
  if (!Number.isFinite(id)) return null;
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function signInUser(input: {
  email: string;
  name: string;
  institution?: string;
  plan?: string;
}): Promise<UserRow> {
  const email = input.email.trim().toLowerCase();
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  let user = existing[0];

  if (!user) {
    const inserted = await db
      .insert(users)
      .values({
        email,
        name: input.name.trim() || email.split("@")[0],
        institution: input.institution?.trim() ?? "",
        plan: input.plan ?? "etudiant",
      })
      .returning();
    user = inserted[0];
  } else if (input.plan && input.plan !== user.plan) {
    const updated = await db
      .update(users)
      .set({ plan: input.plan })
      .where(eq(users.id, user.id))
      .returning();
    user = updated[0];
  }

  const store = await cookies();
  store.set(COOKIE, String(user.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });

  return user;
}

export async function signOutUser() {
  const store = await cookies();
  store.delete(COOKIE);
}
