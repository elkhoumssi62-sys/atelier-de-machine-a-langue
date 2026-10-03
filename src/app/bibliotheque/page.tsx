import type { Metadata } from "next";
import CatalogExplorer from "@/components/CatalogExplorer";
import { getCategories, getGenres, getTextTypes } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bibliothèque — types et genres",
  description:
    "Toute la typologie textuelle et l'ensemble des genres de rédaction : fiches, plans types, méthodes et grilles d'évaluation.",
};

export default async function LibraryPage() {
  const [types, categories, genres] = await Promise.all([
    getTextTypes(),
    getCategories(),
    getGenres(),
  ]);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ocre">Bibliothèque</p>
        <h1 className="font-display mt-1 text-4xl font-semibold">Types & genres de rédaction</h1>
        <p className="mt-3 max-w-3xl text-ink/70">
          Le <strong>type</strong> correspond à l&apos;intention de l&apos;auteur et à la structuration
          de l&apos;information ; le <strong>genre</strong> est la catégorie formelle et
          institutionnelle de l&apos;écrit. Un genre combine toujours plusieurs types.
        </p>
      </header>
      <CatalogExplorer types={types} categories={categories} genres={genres} />
    </div>
  );
}
