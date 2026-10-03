import { config } from "dotenv";
config({ path: ".env.local" });

import { sql } from "drizzle-orm";
import { db } from "@/db";
import { genreCategories, genres, resources, textTypes } from "@/db/schema";
import { categorySeeds, genreSeeds } from "@/content";
import { textTypeSeeds } from "@/content/text-types";
import { resourceSeeds } from "@/content/resources";

const globalForSeed = globalThis as typeof globalThis & {
  __malSeedPromise?: Promise<void>;
};

export async function runSeed(): Promise<void> {
  console.log("🌱 Démarrage du seeding de la base de données...");

  if (textTypeSeeds?.length) {
    await db
      .insert(textTypes)
      .values(textTypeSeeds.map((seed, index) => ({ ...seed, orderIndex: index })))
      .onConflictDoUpdate({
        target: textTypes.slug,
        set: {
          name: sql`excluded.name`,
          tagline: sql`excluded.tagline`,
          intention: sql`excluded.intention`,
          definition: sql`excluded.definition`,
          accent: sql`excluded.accent`,
          icon: sql`excluded.icon`,
          features: sql`excluded.features`,
          grammar: sql`excluded.grammar`,
          lexicon: sql`excluded.lexicon`,
          uses: sql`excluded.uses`,
          structure: sql`excluded.structure`,
          pitfalls: sql`excluded.pitfalls`,
          sample: sql`excluded.sample`,
          sampleNote: sql`excluded.sample_note`,
          exercises: sql`excluded.exercises`,
          orderIndex: sql`excluded.order_index`,
        },
      });
    console.log("✓ textTypes insérés/mis à jour");
  }

  if (categorySeeds?.length) {
    await db
      .insert(genreCategories)
      .values(categorySeeds.map((seed, index) => ({ ...seed, orderIndex: index })))
      .onConflictDoUpdate({
        target: genreCategories.slug,
        set: {
          name: sql`excluded.name`,
          description: sql`excluded.description`,
          icon: sql`excluded.icon`,
          orderIndex: sql`excluded.order_index`,
        },
      });
    console.log("✓ genreCategories insérés/mis à jour");
  }

  if (genreSeeds?.length) {
    await db
      .insert(genres)
      .values(genreSeeds.map((seed, index) => ({ ...seed, orderIndex: index })))
      .onConflictDoUpdate({
        target: genres.slug,
        set: {
          name: sql`excluded.name`,
          categorySlug: sql`excluded.category_slug`,
          summary: sql`excluded.summary`,
          definition: sql`excluded.definition`,
          dominantTypes: sql`excluded.dominant_types`,
          register: sql`excluded.register`,
          length: sql`excluded.length`,
          difficulty: sql`excluded.difficulty`,
          plan: sql`excluded.plan`,
          method: sql`excluded.method`,
          connectors: sql`excluded.connectors`,
          phrases: sql`excluded.phrases`,
          checklist: sql`excluded.checklist`,
          pitfalls: sql`excluded.pitfalls`,
          criteria: sql`excluded.criteria`,
          sample: sql`excluded.sample`,
          orderIndex: sql`excluded.order_index`,
        },
      });
    console.log("✓ genres insérés/mis à jour");
  }

  if (resourceSeeds?.length) {
    await db
      .insert(resources)
      .values(resourceSeeds.map((seed, index) => ({ ...seed, orderIndex: index })))
      .onConflictDoUpdate({
        target: resources.slug,
        set: {
          kind: sql`excluded.kind`,
          category: sql`excluded.category`,
          term: sql`excluded.term`,
          definition: sql`excluded.definition`,
          items: sql`excluded.items`,
          example: sql`excluded.example`,
          orderIndex: sql`excluded.order_index`,
        },
      });
    console.log("✓ resources insérés/mis à jour");
  }

  console.log("✅ Seeding terminé avec succès !");
}

export function ensureSeeded(): Promise<void> {
  if (!globalForSeed.__malSeedPromise) {
    globalForSeed.__malSeedPromise = runSeed().catch((error) => {
      globalForSeed.__malSeedPromise = undefined;
      throw error;
    });
  }
  return globalForSeed.__malSeedPromise;
}

// Détection de l'exécution en CLI directe (ex: npm run seed)
const isDirectExecution = process.argv[1]?.replace(/\\/g, "/").endsWith("src/db/seed.ts");

if (isDirectExecution) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Erreur pendant le seeding :", err);
      process.exit(1);
    });
}