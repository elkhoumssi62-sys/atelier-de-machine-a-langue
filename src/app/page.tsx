import Link from "next/link";
import { getCategories, getGenres, getResources, getTextTypes, groupGenresByCategory } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [types, categories, genres, resources] = await Promise.all([
    getTextTypes(),
    getCategories(),
    getGenres(),
    getResources(),
  ]);
  const grouped = groupGenresByCategory(genres);
  const resourceItems = resources.reduce((sum, r) => sum + r.items.length, 0);

  return (
    <div className="space-y-20">
      {/* HERO */}
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-ocre/30 bg-ocre/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-ocre">
            Plateforme académique · SaaS
          </span>
          <h1 className="font-display mt-5 text-4xl leading-[1.08] font-semibold text-ink sm:text-5xl lg:text-6xl">
            La source et la banque pour rédiger <em className="text-ocre not-italic">n&apos;importe quel</em> type de texte.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/70">
            L&apos;Atelier de rédaction de <strong>Machine à Langue</strong> réunit la typologie
            textuelle complète, {genres.length} fiches de genres détaillées, les méthodes, les plans types,
            les connecteurs, les modèles et un atelier d&apos;écriture guidé qui analyse votre texte
            en direct.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/atelier"
              className="rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-parchment shadow-sm transition hover:bg-ink/85"
            >
              Commencer à rédiger
            </Link>
            <Link
              href="/bibliotheque"
              className="rounded-xl border border-ink/20 bg-white/70 px-6 py-3 text-sm font-semibold text-ink transition hover:bg-sand"
            >
              Explorer la bibliothèque
            </Link>
          </div>
          <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { k: types.length, l: "types de texte" },
              { k: genres.length, l: "genres détaillés" },
              { k: resourceItems, l: "entrées de ressources" },
              { k: genres.reduce((s, g) => s + g.plan.length, 0), l: "étapes de plans types" },
            ].map((stat) => (
              <div key={stat.l} className="card rounded-xl px-4 py-3">
                <dt className="font-display text-2xl font-semibold text-ocre">{stat.k}</dt>
                <dd className="text-xs uppercase tracking-wide text-ink/55">{stat.l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="card relative overflow-hidden rounded-3xl p-6 shadow-sm">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-ocre/10 blur-2xl" />
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
            Direction scientifique
          </p>
          <p className="font-display mt-1 text-xl font-semibold">Pr. Mohamed EL KHOUMSSI</p>
          <div className="mt-5 space-y-3 text-sm">
            {[
              { t: "Diagnostic typologique", d: "L'atelier identifie le type dominant de votre brouillon et le compare au genre visé." },
              { t: "Plans types opérationnels", d: "Chaque genre fournit un plan sectionné, avec objectifs et questions de relance." },
              { t: "Grilles d'évaluation", d: "Les critères de notation des correcteurs, pondérés, pour s'auto-évaluer." },
              { t: "Banque linguistique", d: "Connecteurs, figures, formules administratives, verbes introducteurs, lexiques." },
            ].map((item) => (
              <div key={item.t} className="rounded-xl border border-ink/10 bg-white/70 p-3">
                <p className="font-semibold text-ink">{item.t}</p>
                <p className="mt-0.5 text-ink/65">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TYPOLOGIE */}
      <section>
        <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ocre">Partie 1</p>
            <h2 className="font-display text-3xl font-semibold">Les types de rédaction — typologie textuelle</h2>
            <p className="mt-2 max-w-3xl text-ink/65">
              Le type de texte correspond à l&apos;intention de l&apos;auteur et à la manière dont
              l&apos;information est structurée. Un même genre peut combiner plusieurs types.
            </p>
          </div>
          <Link href="/bibliotheque" className="text-sm font-semibold text-ocre hover:underline">
            Voir les fiches complètes →
          </Link>
        </header>

        <div className="card overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-ink text-parchment">
                <tr>
                  <th className="px-4 py-3 font-semibold">Type de texte</th>
                  <th className="px-4 py-3 font-semibold">Intention principale</th>
                  <th className="px-4 py-3 font-semibold">Caractéristiques clés</th>
                  <th className="px-4 py-3 font-semibold">Exemples d&apos;utilisation</th>
                </tr>
              </thead>
              <tbody>
                {types.map((type, i) => (
                  <tr key={type.slug} className={i % 2 ? "bg-white/50" : "bg-white/80"}>
                    <td className="px-4 py-4 align-top">
                      <Link href={`/types/${type.slug}`} className="font-display text-base font-semibold hover:text-ocre">
                        {type.icon} {type.name}
                      </Link>
                    </td>
                    <td className="px-4 py-4 align-top text-ink/75">{type.intention}</td>
                    <td className="px-4 py-4 align-top text-ink/70">
                      <ul className="list-disc space-y-1 pl-4">
                        {type.features.slice(0, 3).map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-4 align-top text-ink/70">{type.uses.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* GENRES */}
      <section>
        <header className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ocre">Partie 2</p>
          <h2 className="font-display text-3xl font-semibold">Les grands genres de rédaction</h2>
          <p className="mt-2 max-w-3xl text-ink/65">
            Le genre désigne la catégorie formelle et institutionnelle dans laquelle s&apos;inscrit
            l&apos;écrit. Chaque fiche contient définition, plan type, méthode, connecteurs,
            formules, erreurs fréquentes et grille d&apos;évaluation.
          </p>
        </header>
        <div className="grid gap-5 md:grid-cols-2">
          {categories.map((category) => (
            <article key={category.slug} className="card rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{category.icon}</span>
                <div>
                  <h3 className="font-display text-xl font-semibold">{category.name}</h3>
                  <p className="mt-1 text-sm text-ink/65">{category.description}</p>
                </div>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {(grouped.get(category.slug) ?? []).map((genre) => (
                  <li key={genre.slug}>
                    <Link
                      href={`/genres/${genre.slug}`}
                      className="inline-block rounded-lg border border-ink/12 bg-white/70 px-3 py-1.5 text-xs font-medium text-ink/80 transition hover:border-ocre/40 hover:bg-ocre/10 hover:text-ocre"
                    >
                      {genre.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* GENRE VS TYPE */}
      <section className="card rounded-3xl bg-ink p-8 text-parchment sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ocre-light">Synthèse</p>
        <h2 className="font-display mt-2 text-3xl font-semibold">Genre vs Type</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-parchment/15 bg-parchment/5 p-6">
            <p className="font-display text-xl">Le Genre est la « boîte »</p>
            <p className="mt-2 text-parchment/75">
              La catégorie formelle, reconnue par une institution et par des lecteurs :
              une lettre de motivation, un éditorial, une dissertation.
            </p>
          </div>
          <div className="rounded-2xl border border-parchment/15 bg-parchment/5 p-6">
            <p className="font-display text-xl">Le Type est le « mode de rédaction »</p>
            <p className="mt-2 text-parchment/75">
              La manière d&apos;écrire à l&apos;intérieur de la boîte : la lettre de motivation est
              principalement <strong>argumentative</strong> et <strong>explicative</strong>.
            </p>
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-parchment/70">
          Toute la plateforme repose sur cette articulation : vous choisissez un genre, l&apos;atelier
          vous donne son plan, ses contraintes et ses formules, puis vérifie que le type dominant de
          votre écriture correspond bien à l&apos;intention visée.
        </p>
      </section>

      {/* WORKFLOW */}
      <section>
        <h2 className="font-display text-3xl font-semibold">Comment fonctionne l&apos;atelier</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-4">
          {[
            { n: "01", t: "Choisir le genre", d: "Parmi les quatre familles : littéraire, journalistique, professionnelle, académique." },
            { n: "02", t: "Recevoir le plan", d: "Sections pondérées, objectifs, questions de relance et nombre de mots cible." },
            { n: "03", t: "Rédiger section par section", d: "Connecteurs, amorces et formules sont accessibles à côté de l'éditeur." },
            { n: "04", t: "Analyser et s'auto-évaluer", d: "Lisibilité, densité de connecteurs, répétitions, profil typologique, checklist." },
          ].map((step) => (
            <article key={step.n} className="card rounded-2xl p-5">
              <p className="font-display text-3xl text-ocre/40">{step.n}</p>
              <p className="mt-2 font-semibold">{step.t}</p>
              <p className="mt-1 text-sm text-ink/65">{step.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-ocre/25 bg-ocre/10 p-8 text-center sm:p-12">
        <h2 className="font-display text-3xl font-semibold">Ouvrez votre espace de rédaction</h2>
        <p className="mx-auto mt-3 max-w-2xl text-ink/70">
          Créez un projet, choisissez un genre, suivez le plan et laissez l&apos;analyseur vous dire
          ce qui manque. Vos textes sont enregistrés automatiquement.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/connexion?next=/atelier" className="rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-parchment hover:bg-ink/85">
            Créer mon espace
          </Link>
          <Link href="/tarifs" className="rounded-xl border border-ink/20 bg-white/70 px-6 py-3 text-sm font-semibold hover:bg-white">
            Voir les offres
          </Link>
        </div>
      </section>
    </div>
  );
}
