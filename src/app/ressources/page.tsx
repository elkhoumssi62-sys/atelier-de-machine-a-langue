import type { Metadata } from "next";
import ResourceBank from "@/components/ResourceBank";
import { getResources } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Banque de ressources linguistiques",
  description:
    "Connecteurs logiques, figures de style, formules administratives, verbes introducteurs et champs lexicaux pour tous vos écrits.",
};

export default async function ResourcesPage() {
  const resources = await getResources();

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ocre">Ressources</p>
        <h1 className="font-display mt-1 text-4xl font-semibold">La banque linguistique</h1>
        <p className="mt-3 max-w-3xl text-ink/70">
          Tout ce qui fait tenir un texte : les connecteurs qui rendent la logique visible, les
          figures qui donnent du relief, les formules consacrées de la correspondance et les
          lexiques de précision. Cliquez sur une entrée pour la copier.
        </p>
      </header>
      <ResourceBank resources={resources} />
    </div>
  );
}
