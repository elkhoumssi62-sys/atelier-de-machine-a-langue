import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createProjectAction, deleteProjectAction, togglePinAction } from "@/app/actions";
import { getCategories, getGenres, getProjects, groupGenresByCategory } from "@/lib/data";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Atelier de rédaction" };

export default async function AtelierPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string }>;
}) {
  const { genre: preselected } = await searchParams;
  const user = await getCurrentUser();
  if (!user) redirect(`/connexion?next=${encodeURIComponent("/atelier")}`);

  const [genres, categories, projects] = await Promise.all([
    getGenres(),
    getCategories(),
    getProjects(user.id),
  ]);
  const grouped = groupGenresByCategory(genres);
  const totalWords = projects.reduce((sum, project) => sum + project.wordCount, 0);
  const finished = projects.filter((project) => project.status === "finalisé").length;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ocre">Atelier</p>
          <h1 className="font-display mt-1 text-4xl font-semibold">Bonjour, {user.name}</h1>
          <p className="mt-2 text-ink/65">
            Vos projets d&apos;écriture, leurs plans et leur avancement.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { k: projects.length, l: "projets" },
            { k: totalWords, l: "mots écrits" },
            { k: finished, l: "finalisés" },
          ].map((stat) => (
            <div key={stat.l} className="card rounded-xl px-4 py-3 text-center">
              <p className="font-display text-2xl font-semibold text-ocre">{stat.k}</p>
              <p className="text-[11px] uppercase tracking-wide text-ink/55">{stat.l}</p>
            </div>
          ))}
        </div>
      </header>

      <section className="card rounded-3xl p-6">
        <h2 className="font-display text-xl font-semibold">Nouveau projet d&apos;écriture</h2>
        <p className="mt-1 text-sm text-ink/60">
          Choisissez un genre : son plan type sera automatiquement installé dans l&apos;éditeur.
        </p>
        <form action={createProjectAction} className="mt-5 grid gap-4 md:grid-cols-[1.2fr_1.4fr_0.8fr_auto]">
          <div>
            <label htmlFor="title" className="text-xs font-semibold uppercase tracking-wide text-ink/55">
              Titre du texte
            </label>
            <input
              id="title"
              name="title"
              required
              placeholder="Dissertation — le roman et le réel"
              className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label htmlFor="genreSlug" className="text-xs font-semibold uppercase tracking-wide text-ink/55">
              Genre
            </label>
            <select
              id="genreSlug"
              name="genreSlug"
              defaultValue={preselected ?? "dissertation"}
              className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-sm"
            >
              {categories.map((category) => (
                <optgroup key={category.slug} label={category.name}>
                  {(grouped.get(category.slug) ?? []).map((genre) => (
                    <option key={genre.slug} value={genre.slug}>
                      {genre.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="targetWords" className="text-xs font-semibold uppercase tracking-wide text-ink/55">
              Objectif (mots)
            </label>
            <input
              id="targetWords"
              name="targetWords"
              type="number"
              min={100}
              step={50}
              defaultValue={800}
              className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-parchment transition hover:bg-ink/85"
            >
              Créer
            </button>
          </div>
          <div className="md:col-span-4">
            <label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wide text-ink/55">
              Sujet / consigne (facultatif)
            </label>
            <input
              id="subject"
              name="subject"
              placeholder="« Le roman doit-il représenter le réel ? » — 4 heures, sans documents"
              className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-sm"
            />
          </div>
        </form>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">Mes projets</h2>
        {projects.length === 0 ? (
          <p className="card mt-4 rounded-2xl p-10 text-center text-sm text-ink/60">
            Aucun projet pour le moment. Créez votre premier texte ci-dessus, ou partez d&apos;une
            fiche de la <Link href="/bibliotheque" className="font-semibold text-ocre hover:underline">bibliothèque</Link>.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => {
              const genre = genres.find((g) => g.slug === project.genreSlug);
              const progress = Math.min(
                100,
                Math.round((project.wordCount / Math.max(project.targetWords, 1)) * 100),
              );
              return (
                <article key={project.id} className="card flex flex-col rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/atelier/${project.id}`} className="font-display text-lg font-semibold hover:text-ocre">
                      {project.pinned && <span className="mr-1 text-ocre">★</span>}
                      {project.title}
                    </Link>
                    <span className="whitespace-nowrap rounded-full bg-sand px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink/60">
                      {project.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-wide text-ocre">{genre?.name ?? project.genreSlug}</p>
                  {project.subject && <p className="mt-2 text-sm text-ink/65">{project.subject}</p>}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-ink/55">
                      <span>{project.wordCount} mots</span>
                      <span>objectif {project.targetWords}</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-sand">
                      <div className="h-full rounded-full bg-forest/70" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] text-ink/45">
                    Modifié le {new Date(project.updatedAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/atelier/${project.id}`}
                      className="flex-1 rounded-lg bg-ink px-3 py-2 text-center text-xs font-semibold text-parchment hover:bg-ink/85"
                    >
                      Ouvrir
                    </Link>
                    <form action={togglePinAction}>
                      <input type="hidden" name="id" value={project.id} />
                      <input type="hidden" name="pinned" value={String(project.pinned)} />
                      <button
                        type="submit"
                        title="Épingler"
                        className="rounded-lg border border-ink/15 px-3 py-2 text-xs hover:bg-sand"
                      >
                        {project.pinned ? "★" : "☆"}
                      </button>
                    </form>
                    <form action={deleteProjectAction}>
                      <input type="hidden" name="id" value={project.id} />
                      <button
                        type="submit"
                        title="Supprimer"
                        className="rounded-lg border border-ink/15 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50"
                      >
                        ✕
                      </button>
                    </form>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
