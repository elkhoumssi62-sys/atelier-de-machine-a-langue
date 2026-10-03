import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/* Catalogue académique                                                */
/* ------------------------------------------------------------------ */

export const textTypes = pgTable(
  "text_types",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    tagline: text("tagline").notNull(),
    intention: text("intention").notNull(),
    definition: text("definition").notNull(),
    accent: text("accent").notNull().default("indigo"),
    icon: text("icon").notNull().default("✍️"),
    features: jsonb("features").$type<string[]>().notNull().default([]),
    grammar: jsonb("grammar").$type<string[]>().notNull().default([]),
    lexicon: jsonb("lexicon").$type<string[]>().notNull().default([]),
    uses: jsonb("uses").$type<string[]>().notNull().default([]),
    structure: jsonb("structure")
      .$type<{ title: string; detail: string }[]>()
      .notNull()
      .default([]),
    pitfalls: jsonb("pitfalls").$type<string[]>().notNull().default([]),
    sample: text("sample").notNull().default(""),
    sampleNote: text("sample_note").notNull().default(""),
    exercises: jsonb("exercises").$type<string[]>().notNull().default([]),
    orderIndex: integer("order_index").notNull().default(0),
  },
  (table) => [uniqueIndex("text_types_slug_idx").on(table.slug)],
);

export const genreCategories = pgTable(
  "genre_categories",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    icon: text("icon").notNull().default("📚"),
    orderIndex: integer("order_index").notNull().default(0),
  },
  (table) => [uniqueIndex("genre_categories_slug_idx").on(table.slug)],
);

export const genres = pgTable(
  "genres",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    categorySlug: text("category_slug").notNull(),
    summary: text("summary").notNull(),
    definition: text("definition").notNull(),
    dominantTypes: jsonb("dominant_types").$type<string[]>().notNull().default([]),
    register: text("register").notNull().default("courant"),
    length: text("length").notNull().default(""),
    difficulty: integer("difficulty").notNull().default(2),
    plan: jsonb("plan")
      .$type<{ title: string; goal: string; share: number; prompts: string[] }[]>()
      .notNull()
      .default([]),
    method: jsonb("method").$type<string[]>().notNull().default([]),
    connectors: jsonb("connectors").$type<string[]>().notNull().default([]),
    phrases: jsonb("phrases").$type<string[]>().notNull().default([]),
    checklist: jsonb("checklist").$type<string[]>().notNull().default([]),
    pitfalls: jsonb("pitfalls").$type<string[]>().notNull().default([]),
    criteria: jsonb("criteria")
      .$type<{ label: string; weight: number }[]>()
      .notNull()
      .default([]),
    sample: text("sample").notNull().default(""),
    orderIndex: integer("order_index").notNull().default(0),
  },
  (table) => [uniqueIndex("genres_slug_idx").on(table.slug)],
);

export const resources = pgTable(
  "resources",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    kind: text("kind").notNull(), // connecteur | figure | formule | verbe | lexique
    category: text("category").notNull(),
    term: text("term").notNull(),
    definition: text("definition").notNull(),
    items: jsonb("items").$type<string[]>().notNull().default([]),
    example: text("example").notNull().default(""),
    orderIndex: integer("order_index").notNull().default(0),
  },
  (table) => [uniqueIndex("resources_slug_idx").on(table.slug)],
);

/* ------------------------------------------------------------------ */
/* SaaS : comptes & projets d'écriture                                 */
/* ------------------------------------------------------------------ */

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    institution: text("institution").notNull().default(""),
    plan: text("plan").notNull().default("etudiant"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email)],
);

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  subject: text("subject").notNull().default(""),
  genreSlug: text("genre_slug").notNull(),
  typeSlug: text("type_slug").notNull().default(""),
  status: text("status").notNull().default("brouillon"),
  targetWords: integer("target_words").notNull().default(600),
  sections: jsonb("sections")
    .$type<{ title: string; goal: string; content: string }[]>()
    .notNull()
    .default([]),
  checklistState: jsonb("checklist_state").$type<Record<string, boolean>>().notNull().default({}),
  notes: text("notes").notNull().default(""),
  wordCount: integer("word_count").notNull().default(0),
  pinned: boolean("pinned").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type TextTypeRow = typeof textTypes.$inferSelect;
export type GenreRow = typeof genres.$inferSelect;
export type GenreCategoryRow = typeof genreCategories.$inferSelect;
export type ResourceRow = typeof resources.$inferSelect;
export type ProjectRow = typeof projects.$inferSelect;
export type UserRow = typeof users.$inferSelect;
