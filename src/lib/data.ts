import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { ensureSeeded } from "@/db/seed";
import {
  genreCategories,
  genres,
  projects,
  resources,
  textTypes,
  type GenreRow,
  type ProjectRow,
} from "@/db/schema";

export async function getTextTypes() {
  await ensureSeeded();
  return db.select().from(textTypes).orderBy(asc(textTypes.orderIndex));
}

export async function getTextType(slug: string) {
  await ensureSeeded();
  const rows = await db.select().from(textTypes).where(eq(textTypes.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getCategories() {
  await ensureSeeded();
  return db.select().from(genreCategories).orderBy(asc(genreCategories.orderIndex));
}

export async function getGenres() {
  await ensureSeeded();
  return db.select().from(genres).orderBy(asc(genres.orderIndex));
}

export async function getGenre(slug: string) {
  await ensureSeeded();
  const rows = await db.select().from(genres).where(eq(genres.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getResources() {
  await ensureSeeded();
  return db.select().from(resources).orderBy(asc(resources.orderIndex));
}

export async function getProjects(userId: number): Promise<ProjectRow[]> {
  return db
    .select()
    .from(projects)
    .where(eq(projects.userId, userId))
    .orderBy(desc(projects.pinned), desc(projects.updatedAt));
}

export async function getProject(id: number, userId: number): Promise<ProjectRow | null> {
  const rows = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  const project = rows[0];
  if (!project || project.userId !== userId) return null;
  return project;
}

export function groupGenresByCategory(list: GenreRow[]) {
  const map = new Map<string, GenreRow[]>();
  for (const genre of list) {
    const bucket = map.get(genre.categorySlug) ?? [];
    bucket.push(genre);
    map.set(genre.categorySlug, bucket);
  }
  return map;
}
