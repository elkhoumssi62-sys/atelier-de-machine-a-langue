"use client";

import { useMemo, useState } from "react";
import type { ResourceRow } from "@/db/schema";

const KINDS = [
  { slug: "tous", label: "Tout" },
  { slug: "connecteur", label: "Connecteurs logiques" },
  { slug: "figure", label: "Figures de style" },
  { slug: "formule", label: "Formules officielles" },
  { slug: "verbe", label: "Verbes introducteurs" },
  { slug: "lexique", label: "Champs lexicaux" },
];

export default function ResourceBank({ resources }: { resources: ResourceRow[] }) {
  const [kind, setKind] = useState("tous");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resources.filter((resource) => {
      if (kind !== "tous" && resource.kind !== kind) return false;
      if (!q) return true;
      return [resource.term, resource.category, resource.definition, ...resource.items]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [resources, kind, query]);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      window.setTimeout(() => setCopied(null), 1200);
    } catch {
      setCopied(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="card rounded-2xl p-4">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher « concession », « politesse », « métaphore »…"
          className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {KINDS.map((item) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => setKind(item.slug)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                kind === item.slug
                  ? "bg-ink text-parchment"
                  : "border border-ink/15 bg-white/70 text-ink/70 hover:bg-sand"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {filtered.map((resource) => (
          <article key={resource.slug} className="card rounded-2xl p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ocre">
              {resource.category}
            </p>
            <h2 className="font-display mt-1 text-lg font-semibold">{resource.term}</h2>
            <p className="mt-1.5 text-sm text-ink/65">{resource.definition}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {resource.items.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => copy(item)}
                    title="Copier"
                    className={`rounded-lg border px-2.5 py-1 text-left text-xs transition ${
                      copied === item
                        ? "border-forest bg-forest/10 text-forest"
                        : "border-ink/12 bg-white/70 text-ink/75 hover:border-ocre/40 hover:text-ocre"
                    }`}
                  >
                    {copied === item ? "copié ✓" : item}
                  </button>
                </li>
              ))}
            </ul>
            {resource.example && (
              <p className="mt-3 rounded-lg border-l-2 border-ocre/50 bg-white/60 px-3 py-2 text-sm italic text-ink/75">
                {resource.example}
              </p>
            )}
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="card rounded-2xl p-8 text-center text-sm text-ink/60">
          Aucune ressource ne correspond à cette recherche.
        </p>
      )}
    </div>
  );
}
