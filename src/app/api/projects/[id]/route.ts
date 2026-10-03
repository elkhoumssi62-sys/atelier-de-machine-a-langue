import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { countWords } from "@/lib/analyse";

type Section = { title: string; goal: string; content: string };

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id } = await context.params;
  const projectId = Number(id);
  if (!Number.isFinite(projectId)) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
  }

  const body = (await request.json()) as {
    title?: string;
    subject?: string;
    status?: string;
    targetWords?: number;
    notes?: string;
    sections?: Section[];
    checklistState?: Record<string, boolean>;
  };

  const update: Partial<typeof projects.$inferInsert> = { updatedAt: new Date() };
  if (typeof body.title === "string") update.title = body.title.slice(0, 200) || "Sans titre";
  if (typeof body.subject === "string") update.subject = body.subject.slice(0, 1000);
  if (typeof body.status === "string") update.status = body.status;
  if (typeof body.notes === "string") update.notes = body.notes;
  if (typeof body.targetWords === "number" && Number.isFinite(body.targetWords)) {
    update.targetWords = Math.max(50, Math.round(body.targetWords));
  }
  if (Array.isArray(body.sections)) {
    const sections = body.sections.map((section) => ({
      title: String(section.title ?? ""),
      goal: String(section.goal ?? ""),
      content: String(section.content ?? ""),
    }));
    update.sections = sections;
    update.wordCount = countWords(sections.map((section) => section.content).join("\n\n"));
  }
  if (body.checklistState && typeof body.checklistState === "object") {
    update.checklistState = body.checklistState;
  }

  const updated = await db
    .update(projects)
    .set(update)
    .where(and(eq(projects.id, projectId), eq(projects.userId, user.id)))
    .returning();

  if (updated.length === 0) {
    return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    wordCount: updated[0].wordCount,
    updatedAt: updated[0].updatedAt,
  });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const { id } = await context.params;
  const projectId = Number(id);
  if (!Number.isFinite(projectId)) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
  }
  await db.delete(projects).where(and(eq(projects.id, projectId), eq(projects.userId, user.id)));
  return NextResponse.json({ ok: true });
}
