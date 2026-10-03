import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offres & licences",
  description: "Formules Découverte, Étudiant, Enseignant et Établissement de Machine à Langue.",
};

const PLANS = [
  {
    slug: "decouverte",
    name: "Découverte",
    price: "0 MAD",
    period: "pour toujours",
    pitch: "Pour explorer la bibliothèque et tester l'atelier.",
    features: [
      "Accès complet à la typologie textuelle",
      "Toutes les fiches de genres",
      "Banque de ressources linguistiques",
      "3 projets d'écriture",
      "Analyse stylistique en direct",
    ],
    cta: "Commencer gratuitement",
    highlight: false,
  },
  {
    slug: "etudiant",
    name: "Étudiant",
    price: "49 MAD",
    period: "par mois",
    pitch: "Pour préparer dissertations, commentaires et synthèses.",
    features: [
      "Tout le plan Découverte",
      "Projets illimités",
      "Check-lists et grilles d'évaluation",
      "Export Markdown et copie intégrale",
      "Historique des versions de travail",
      "Modèles d'amorces par genre",
    ],
    cta: "Choisir Étudiant",
    highlight: true,
  },
  {
    slug: "enseignant",
    name: "Enseignant",
    price: "129 MAD",
    period: "par mois",
    pitch: "Pour construire des séquences et corriger plus vite.",
    features: [
      "Tout le plan Étudiant",
      "Fiches imprimables par genre",
      "Banque d'exercices par type de texte",
      "Grilles de correction pondérées",
      "Création de consignes guidées",
    ],
    cta: "Choisir Enseignant",
    highlight: false,
  },
  {
    slug: "etablissement",
    name: "Établissement",
    price: "Sur devis",
    period: "licence annuelle",
    pitch: "Pour les départements, lycées et centres de langues.",
    features: [
      "Comptes multiples et groupes",
      "Tableau de bord des productions",
      "Personnalisation des référentiels",
      "Formation à la méthodologie de l'écrit",
      "Accompagnement du Pr. EL KHOUMSSI",
    ],
    cta: "Demander un devis",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="space-y-10">
      <header className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ocre">Offres</p>
        <h1 className="font-display mt-1 text-4xl font-semibold">Une licence pour chaque usage de l&apos;écrit</h1>
        <p className="mx-auto mt-3 max-w-2xl text-ink/70">
          Le contenu académique est identique dans toutes les formules : ce sont les outils de
          travail, d&apos;export et de suivi qui évoluent.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-4">
        {PLANS.map((plan) => (
          <article
            key={plan.slug}
            className={`flex flex-col rounded-3xl p-6 ${
              plan.highlight
                ? "bg-ink text-parchment shadow-lg"
                : "card text-ink"
            }`}
          >
            {plan.highlight && (
              <span className="mb-3 inline-block w-fit rounded-full bg-ocre px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                Le plus choisi
              </span>
            )}
            <h2 className="font-display text-2xl font-semibold">{plan.name}</h2>
            <p className={`mt-1 text-sm ${plan.highlight ? "text-parchment/70" : "text-ink/60"}`}>
              {plan.pitch}
            </p>
            <p className="font-display mt-4 text-3xl font-semibold">{plan.price}</p>
            <p className={`text-xs uppercase tracking-wide ${plan.highlight ? "text-parchment/60" : "text-ink/50"}`}>
              {plan.period}
            </p>
            <ul className={`mt-5 flex-1 space-y-2 text-sm ${plan.highlight ? "text-parchment/85" : "text-ink/75"}`}>
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span className={plan.highlight ? "text-ocre-light" : "text-forest"}>✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href={`/connexion?plan=${plan.slug}&next=/atelier`}
              className={`mt-6 rounded-xl px-4 py-3 text-center text-sm font-semibold transition ${
                plan.highlight
                  ? "bg-ocre text-white hover:bg-ocre-light"
                  : "border border-ink/20 bg-white/70 hover:bg-sand"
              }`}
            >
              {plan.cta}
            </Link>
          </article>
        ))}
      </div>

      <section className="card rounded-3xl p-8">
        <h2 className="font-display text-2xl font-semibold">Questions fréquentes</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {[
            ["Le contenu est-il adapté au programme ?", "Les fiches suivent la typologie textuelle et les genres enseignés dans le secondaire et le supérieur francophones : dissertation, commentaire composé, synthèse de documents, écrits professionnels."],
            ["Mes textes sont-ils conservés ?", "Oui. Chaque projet est enregistré automatiquement dans votre espace et reste accessible tant que votre compte existe."],
            ["Puis-je travailler hors ligne ?", "L'éditeur sauvegarde dès que la connexion est rétablie ; vous pouvez aussi exporter vos textes en Markdown à tout moment."],
            ["Existe-t-il une version établissement ?", "Oui : comptes multiples, référentiels personnalisés et accompagnement méthodologique sont proposés sur devis."],
          ].map(([q, a]) => (
            <div key={q} className="rounded-2xl border border-ink/10 bg-white/70 p-5">
              <p className="font-semibold">{q}</p>
              <p className="mt-1 text-sm text-ink/70">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
