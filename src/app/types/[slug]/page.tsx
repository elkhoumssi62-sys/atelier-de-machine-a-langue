import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getGenres, getTextType, getTextTypes } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const type = await getTextType(slug);
  if (!type) return { title: "Type introuvable" };
  return { title: `Type ${type.name}`, description: type.tagline };
}

function Panel({
  title,
  children,
  subtitle,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card rounded-2xl p-6">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-ink/55">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function TextTypePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [type, genres] = await Promise.all([getTextType(slug), getGenres()]);
  if (!type) notFound();

  const relatedGenres = genres.filter((genre) => genre.dominantTypes.includes(type.slug));

  return (
    <article className="space-y-8">
      <header className="card rounded-3xl p-8">
        <Link href="/bibliotheque" className="text-xs font-semibold uppercase tracking-[0.16em] text-ocre hover:underline">
          ← Bibliothèque
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <span className="text-4xl">{type.icon}</span>
          <div>
            <h1 className="font-display text-4xl font-semibold">Type {type.name}</h1>
            <p className="mt-1 text-ink/70">{type.tagline}</p>
          </div>
        </div>
        <p className="prose-mal mt-6 max-w-4xl text-ink/80">{type.definition}</p>
        <div className="mt-6 rounded-xl border border-ocre/25 bg-ocre/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ocre">Intention principale</p>
          <p className="mt-1 font-medium text-ink">{type.intention}</p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Caractéristiques clés">
          <ul className="space-y-2 text-sm text-ink/75">
            {type.features.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="mt-1 text-ocre">◆</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Outils grammaticaux" subtitle="Temps, modes et constructions à maîtriser">
          <ul className="space-y-2 text-sm text-ink/75">
            {type.grammar.map((g) => (
              <li key={g} className="rounded-lg border border-ink/10 bg-white/60 px-3 py-2">
                {g}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Structure type" subtitle="Le déroulé canonique d'un texte de ce type">
          <ol className="space-y-3">
            {type.structure.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className="font-display flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs text-parchment">
                  {index + 1}
                </span>
                <div>
                  <p className="font-semibold text-ink">{step.title}</p>
                  <p className="text-sm text-ink/65">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Lexique mobilisé">
          <ul className="space-y-2 text-sm text-ink/75">
            {type.lexicon.map((l) => (
              <li key={l} className="flex gap-2">
                <span className="mt-1 text-forest">▸</span>
                <span>{l}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            {type.uses.map((u) => (
              <span key={u} className="rounded-lg bg-sand px-3 py-1 text-xs font-medium text-ink/70">
                {u}
              </span>
            ))}
          </div>
        </Panel>
      </div>

      <section className="card rounded-2xl p-6">
        <h2 className="font-display text-xl font-semibold">Exemple commenté</h2>
        <blockquote className="mt-4 rounded-xl border-l-4 border-ocre bg-white/70 p-5 text-[15px] leading-relaxed text-ink/85">
          {type.sample}
        </blockquote>
        <p className="mt-3 text-sm text-ink/65">
          <strong className="text-ink">Analyse : </strong>
          {type.sampleNote}
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Erreurs fréquentes">
          <ul className="space-y-2 text-sm">
            {type.pitfalls.map((p) => (
              <li key={p} className="flex gap-2 rounded-lg border border-rose-200 bg-rose-50/60 px-3 py-2 text-ink/75">
                <span className="text-rose-500">✕</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Exercices d'entraînement">
          <ol className="list-decimal space-y-2 pl-5 text-sm text-ink/75">
            {type.exercises.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ol>
        </Panel>
      </div>

      <section className="card rounded-2xl p-6">
        <h2 className="font-display text-xl font-semibold">Genres qui mobilisent ce type</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {relatedGenres.map((genre) => (
            <Link
              key={genre.slug}
              href={`/genres/${genre.slug}`}
              className="rounded-lg border border-ink/12 bg-white/70 px-3 py-2 text-sm font-medium transition hover:border-ocre/40 hover:text-ocre"
            >
              {genre.name}
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
