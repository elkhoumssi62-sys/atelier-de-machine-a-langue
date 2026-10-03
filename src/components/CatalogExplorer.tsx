"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { GenreCategoryRow, GenreRow, TextTypeRow } from "@/db/schema";

type Props = {
  types: TextTypeRow[];
  categories: GenreCategoryRow[];
  genres: GenreRow[];
};

const DIFFICULTY = ["", "Initiation", "Accessible", "Intermédiaire", "Avancé", "Expert"];

export default function CatalogExplorer({ types, categories, genres }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("tous");
  const [typeFilter, setTypeFilter] = useState<string>("tous");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return genres.filter((genre) => {
      if (category !== "tous" && genre.categorySlug !== category) return false;
      if (typeFilter !== "tous" && !genre.dominantTypes.includes(typeFilter)) return false;
      if (!q) return true;
      const haystack = [
        genre.name,
        genre.summary,
        genre.definition,
        genre.register,
        ...genre.dominantTypes,
        ...genre.plan.map((p) => p.title),
        ...genre.method,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [genres, query, category, typeFilter]);

  return (
    <div className="space-y-10">
      {/* TYPES */}
      <section>
        <h2 className="font-display text-2xl font-semibold">Les 6 types de rédaction</h2>
        <p className="mt-1 text-sm text-ink/60">
          Cliquez sur un type pour ouvrir sa fiche : caractéristiques, grammaire, structure,
          erreurs fréquentes, exemple commenté et exercices.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {types.map((type) => (
            <Link
              key={type.slug}
              href={`/types/${type.slug}`}
              className="card group rounded-2xl p-5 transition hover:-translate-y-0.5 hover:border-ocre/40 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{type.icon}</span>
                <span className="rounded-full bg-sand px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink/60">
                  type
                </span>
              </div>
              <h3 className="font-display mt-3 text-lg font-semibold group-hover:text-ocre">{type.name}</h3>
              <p className="mt-1 text-sm text-ink/65">{type.tagline}</p>
              <p className="mt-3 text-xs text-ink/50">{type.uses.slice(0, 3).join(" · ")}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FILTRES */}
      <section>
        <div className="card sticky top-[72px] z-20 rounded-2xl p-4">
          <div className="grid gap-3 md:grid-cols-[1.6fr_1fr_1fr]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher un genre, une méthode, un mot-clé…"
              className="rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm"
            />
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-sm"
            >
              <option value="tous">Toutes les familles</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-sm"
            >
              <option value="tous">Tous les types dominants</option>
              {types.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-2 text-xs text-ink/50">
            {filtered.length} genre{filtered.length > 1 ? "s" : ""} affiché
            {filtered.length > 1 ? "s" : ""} sur {genres.length}.
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((genre) => (
            <article key={genre.slug} className="card flex flex-col rounded-2xl p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-lg font-semibold">{genre.name}</h3>
                <span className="whitespace-nowrap rounded-full bg-forest/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-forest">
                  {DIFFICULTY[genre.difficulty] ?? "—"}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-ink/70">{genre.summary}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {genre.dominantTypes.map((t) => (
                  <span key={t} className="rounded-md bg-ocre/10 px-2 py-0.5 text-[11px] font-medium capitalize text-ocre">
                    {t}
                  </span>
                ))}
              </div>
              <dl className="mt-3 space-y-1 text-xs text-ink/55">
                <div className="flex justify-between gap-3">
                  <dt>Longueur</dt>
                  <dd className="text-right">{genre.length}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Registre</dt>
                  <dd className="text-right capitalize">{genre.register}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Plan</dt>
                  <dd className="text-right">{genre.plan.length} sections</dd>
                </div>
              </dl>
              <div className="mt-4 flex gap-2 pt-1">
                <Link
                  href={`/genres/${genre.slug}`}
                  className="flex-1 rounded-lg bg-ink px-3 py-2 text-center text-xs font-semibold text-parchment hover:bg-ink/85"
                >
                  Fiche méthode
                </Link>
                <Link
                  href={`/atelier?genre=${genre.slug}`}
                  className="flex-1 rounded-lg border border-ink/15 px-3 py-2 text-center text-xs font-semibold hover:bg-sand"
                >
                  Rédiger
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="card mt-5 rounded-2xl p-8 text-center text-sm text-ink/60">
            Aucun genre ne correspond à cette recherche. Essayez « lettre », « synthèse », « récit »…
          </p>
        )}
      </section>
    </div>
  );
}
