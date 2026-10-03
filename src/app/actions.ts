"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { getCurrentUser, signInUser, signOutUser } from "@/lib/session";
import { getGenre } from "@/lib/data";

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const institution = String(formData.get("institution") ?? "").trim();
  const plan = String(formData.get("plan") ?? "etudiant");
  const next = String(formData.get("next") ?? "/atelier");

  if (!email || !email.includes("@")) {
    redirect("/connexion?error=email");
  }

  await signInUser({ email, name, institution, plan });
  redirect(next || "/atelier");
}

export async function signOutAction() {
  await signOutUser();
  redirect("/");
}

export async function createProjectAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/atelier");

  const genreSlug = String(formData.get("genreSlug") ?? "");
  const title = String(formData.get("title") ?? "").trim() || "Nouveau texte";
  const subject = String(formData.get("subject") ?? "").trim();
  const targetWords = Number(formData.get("targetWords") ?? 600) || 600;

  const genre = await getGenre(genreSlug);
  if (!genre) redirect("/atelier?error=genre");

  const sections = genre.plan.map((step) => ({
    title: step.title,
    goal: step.goal,
    content: "",
  }));

  const inserted = await db
    .insert(projects)
    .values({
      userId: user.id,
      title,
      subject,
      genreSlug: genre.slug,
      typeSlug: genre.dominantTypes[0] ?? "",
      targetWords,
      sections,
      checklistState: {},
    })
    .returning();

  revalidatePath("/atelier");
  redirect(`/atelier/${inserted[0].id}`);
}

export async function deleteProjectAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/atelier");
  const id = Number(formData.get("id"));
  if (Number.isFinite(id)) {
    await db.delete(projects).where(and(eq(projects.id, id), eq(projects.userId, user.id)));
  }
  revalidatePath("/atelier");
  redirect("/atelier");
}

export async function togglePinAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/atelier");
  const id = Number(formData.get("id"));
  const pinned = String(formData.get("pinned")) === "true";
  if (Number.isFinite(id)) {
    await db
      .update(projects)
      .set({ pinned: !pinned })
      .where(and(eq(projects.id, id), eq(projects.userId, user.id)));
  }
  revalidatePath("/atelier");
}
