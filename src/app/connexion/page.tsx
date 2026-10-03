import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { signInAction } from "@/app/actions";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Accès à l'espace de travail" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; plan?: string; error?: string }>;
}) {
  const { next, plan, error } = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect(next ?? "/atelier");

  return (
    <div className="mx-auto grid max-w-5xl gap-8 py-6 lg:grid-cols-2">
      <section className="card rounded-3xl p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ocre">Espace de travail</p>
        <h1 className="font-display mt-2 text-3xl font-semibold">Ouvrir mon atelier</h1>
        <p className="mt-2 text-sm text-ink/65">
          Un identifiant suffit : vos projets, brouillons et check-lists sont rattachés à votre
          adresse et conservés d&apos;une session à l&apos;autre.
        </p>

        {error === "email" && (
          <p className="mt-4 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            Merci d&apos;indiquer une adresse électronique valide.
          </p>
        )}

        <form action={signInAction} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next ?? "/atelier"} />
          <input type="hidden" name="plan" value={plan ?? "etudiant"} />
          <div>
            <label htmlFor="email" className="text-sm font-medium">Adresse électronique</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="prenom.nom@universite.ma"
              className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm"
            />
          </div>
          <div>
            <label htmlFor="name" className="text-sm font-medium">Nom affiché</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Amina Berrada"
              className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm"
            />
          </div>
          <div>
            <label htmlFor="institution" className="text-sm font-medium">Établissement (facultatif)</label>
            <input
              id="institution"
              name="institution"
              type="text"
              placeholder="Faculté des Lettres — Rabat"
              className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-parchment transition hover:bg-ink/85"
          >
            Entrer dans l&apos;atelier
          </button>
        </form>

        <form action={signInAction} className="mt-3">
          <input type="hidden" name="next" value={next ?? "/atelier"} />
          <input type="hidden" name="email" value="invite@machine-a-langue.ma" />
          <input type="hidden" name="name" value="Invité de démonstration" />
          <input type="hidden" name="plan" value="decouverte" />
          <button
            type="submit"
            className="w-full rounded-xl border border-ink/20 bg-white/70 px-5 py-3 text-sm font-semibold transition hover:bg-sand"
          >
            Essayer en mode démonstration
          </button>
        </form>
      </section>

      <section className="rounded-3xl bg-ink p-8 text-parchment">
        <h2 className="font-display text-2xl font-semibold">Ce que vous obtenez</h2>
        <ul className="mt-5 space-y-4 text-sm text-parchment/80">
          {[
            ["Projets illimités", "Un projet par texte, avec son genre, son plan et son objectif de mots."],
            ["Éditeur sectionné", "Rédigez section par section en suivant la pondération du plan type."],
            ["Analyse en direct", "Lisibilité, longueur des phrases, connecteurs, répétitions, profil typologique."],
            ["Check-list du genre", "La grille du correcteur, cochée au fur et à mesure."],
            ["Export", "Copie intégrale ou téléchargement Markdown de votre texte final."],
          ].map(([title, text]) => (
            <li key={title} className="rounded-xl border border-parchment/15 bg-parchment/5 p-4">
              <p className="font-semibold text-parchment">{title}</p>
              <p className="mt-1">{text}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
