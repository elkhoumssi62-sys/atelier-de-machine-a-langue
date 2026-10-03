import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getGenre, getGenres, getTextTypes } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const genre = await getGenre(slug);
  if (!genre) return { title: "Genre introuvable" };
  return { title: genre.name, description: genre.summary };
}

const DIFFICULTY = ["", "Initiation", "Accessible", "Intermédiaire", "Avancé", "Expert"];

export default async function GenrePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [genre, types, allGenres] = await Promise.all([getGenre(slug), getTextTypes(), getGenres()]);
  if (!genre) notFound();

  const siblings = allGenres
    .filter((g) => g.categorySlug === genre.categorySlug && g.slug !== genre.slug)
    .slice(0, 5);

  return (
    <article className="space-y-8">
      <header className="card rounded-3xl p-8">
        <Link href="/bibliotheque" className="text-xs font-semibold uppercase tracking-[0.16em] text-ocre hover:underline">
          ← Bibliothèque
        </Link>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl font-semibold">{genre.name}</h1>
            <p className="mt-2 text-lg text-ink/70">{genre.summary}</p>
          </div>
          <Link
            href={`/atelier?genre=${genre.slug}`}
            className="rounded-xl bg-ocre px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-ocre-light"
          >
            Rédiger ce texte →
          </Link>
        </div>

        <p className="prose-mal mt-6 max-w-4xl text-ink/80">{genre.definition}</p>

        <dl className="mt-6 grid gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-ink/10 bg-white/70 p-3">
            <dt className="text-[11px] uppercase tracking-wide text-ink/50">Types dominants</dt>
            <dd className="mt-1 flex flex-wrap gap-1">
              {genre.dominantTypes.map((t) => {
                const type = types.find((item) => item.slug === t);
                return (
                  <Link
                    key={t}
                    href={`/types/${t}`}
                    className="rounded-md bg-ocre/10 px-2 py-0.5 text-xs font-medium text-ocre hover:bg-ocre/20"
                  >
                    {type?.name ?? t}
                  </Link>
                );
              })}
            </dd>
          </div>
          <div className="rounded-xl border border-ink/10 bg-white/70 p-3">
            <dt className="text-[11px] uppercase tracking-wide text-ink/50">Longueur attendue</dt>
            <dd className="mt-1 text-sm font-medium">{genre.length}</dd>
          </div>
          <div className="rounded-xl border border-ink/10 bg-white/70 p-3">
            <dt className="text-[11px] uppercase tracking-wide text-ink/50">Registre</dt>
            <dd className="mt-1 text-sm font-medium capitalize">{genre.register}</dd>
          </div>
          <div className="rounded-xl border border-ink/10 bg-white/70 p-3">
            <dt className="text-[11px] uppercase tracking-wide text-ink/50">Niveau</dt>
            <dd className="mt-1 text-sm font-medium">{DIFFICULTY[genre.difficulty]}</dd>
          </div>
        </dl>
      </header>

      <section className="card rounded-2xl p-6">
        <h2 className="font-display text-xl font-semibold">Plan type</h2>
        <p className="mt-1 text-sm text-ink/55">
          Pondération indicative de chaque section et questions de relance pour rédiger.
        </p>
        <ol className="mt-5 space-y-4">
          {genre.plan.map((step, index) => (
            <li key={step.title} className="rounded-xl border border-ink/10 bg-white/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display text-lg font-semibold">
                  <span className="mr-2 text-ocre">{String(index + 1).padStart(2, "0")}</span>
                  {step.title}
                </p>
                <span className="rounded-full bg-sand px-2.5 py-1 text-xs font-semibold text-ink/65">
                  {step.share} % du texte
                </span>
              </div>
              <p className="mt-1 text-sm text-ink/70">{step.goal}</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-sand">
                <div className="h-full rounded-full bg-ocre/70" style={{ width: `${step.share}%` }} />
              </div>
              <ul className="mt-3 space-y-1 text-sm text-ink/60">
                {step.prompts.map((prompt) => (
                  <li key={prompt} className="flex gap-2">
                    <span className="text-forest">?</span>
                    <span>{prompt}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card rounded-2xl p-6">
          <h2 className="font-display text-xl font-semibold">Méthode pas à pas</h2>
          <ol className="mt-4 space-y-3">
            {genre.method.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm text-ink/75">
                <span className="font-display flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest/10 text-xs font-semibold text-forest">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="card rounded-2xl p-6">
          <h2 className="font-display text-xl font-semibold">Grille d&apos;évaluation</h2>
          <ul className="mt-4 space-y-3">
            {genre.criteria.map((criterion) => (
              <li key={criterion.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-ink/80">{criterion.label}</span>
                  <span className="text-ink/55">{criterion.weight} %</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-sand">
                  <div className="h-full rounded-full bg-forest/70" style={{ width: `${criterion.weight}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card rounded-2xl p-6">
          <h2 className="font-display text-xl font-semibold">Connecteurs recommandés</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {genre.connectors.map((connector) => (
              <span key={connector} className="rounded-lg bg-ocre/10 px-3 py-1.5 text-sm font-medium text-ocre">
                {connector}
              </span>
            ))}
          </div>
          <h3 className="font-display mt-6 text-lg font-semibold">Amorces et formules</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink/75">
            {genre.phrases.map((phrase) => (
              <li key={phrase} className="rounded-lg border border-ink/10 bg-white/70 px-3 py-2 italic">
                « {phrase} »
              </li>
            ))}
          </ul>
        </section>

        <section className="card rounded-2xl p-6">
          <h2 className="font-display text-xl font-semibold">Check-list avant de rendre</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink/75">
            {genre.checklist.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-forest">☐</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <h3 className="font-display mt-6 text-lg font-semibold">Erreurs fréquentes</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {genre.pitfalls.map((pitfall) => (
              <li key={pitfall} className="flex gap-2 rounded-lg border border-rose-200 bg-rose-50/60 px-3 py-2 text-ink/75">
                <span className="text-rose-500">✕</span>
                <span>{pitfall}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="card rounded-2xl p-6">
        <h2 className="font-display text-xl font-semibold">Extrait modèle</h2>
        <blockquote className="mt-4 whitespace-pre-line rounded-xl border-l-4 border-forest bg-white/70 p-5 text-[15px] leading-relaxed text-ink/85">
          {genre.sample}
        </blockquote>
      </section>

      {siblings.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-semibold">Dans la même famille</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {siblings.map((sibling) => (
              <Link
                key={sibling.slug}
                href={`/genres/${sibling.slug}`}
                className="rounded-lg border border-ink/12 bg-white/70 px-3 py-2 text-sm font-medium transition hover:border-ocre/40 hover:text-ocre"
              >
                {sibling.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
