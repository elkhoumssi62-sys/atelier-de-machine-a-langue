import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Machine à Langue — L'Atelier de rédaction",
    template: "%s · Machine à Langue",
  },
  description:
    "La banque de référence pour rédiger n'importe quel type ou genre de texte : typologie textuelle, fiches de genres, méthodes, modèles, ressources linguistiques et atelier d'écriture guidé. Par le Pr. Mohamed EL KHOUMSSI.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen text-ink antialiased">
        <SiteHeader />
        <main className="mx-auto w-full max-w-7xl px-5 pb-20 pt-8">{children}</main>
        <footer className="border-t border-ink/10 bg-sand/50">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 text-sm md:grid-cols-4">
            <div>
              <p className="font-display text-base font-semibold">Machine à Langue</p>
              <p className="mt-2 text-ink/60">
                L&apos;Atelier de rédaction — plateforme de référence pour la typologie textuelle,
                les genres et la méthodologie de l&apos;écrit.
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-ink/45">
                Direction scientifique : Pr. Mohamed EL KHOUMSSI
              </p>
            </div>
            <div>
              <p className="font-semibold">Explorer</p>
              <ul className="mt-2 space-y-1 text-ink/65">
                <li><Link href="/bibliotheque" className="hover:text-ocre">Typologie & genres</Link></li>
                <li><Link href="/ressources" className="hover:text-ocre">Banque de ressources</Link></li>
                <li><Link href="/atelier" className="hover:text-ocre">Atelier guidé</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">Comprendre</p>
              <ul className="mt-2 space-y-1 text-ink/65">
                <li><Link href="/types/argumentatif" className="hover:text-ocre">Type argumentatif</Link></li>
                <li><Link href="/genres/dissertation" className="hover:text-ocre">La dissertation</Link></li>
                <li><Link href="/genres/note-de-synthese" className="hover:text-ocre">La note de synthèse</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">Plateforme</p>
              <ul className="mt-2 space-y-1 text-ink/65">
                <li><Link href="/tarifs" className="hover:text-ocre">Offres & licences</Link></li>
                <li><Link href="/connexion" className="hover:text-ocre">Accès espace de travail</Link></li>
                <li><a href="/api/health" className="hover:text-ocre">État du service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-ink/10 px-5 py-4 text-center text-xs text-ink/45">
            © {new Date().getFullYear()} Machine à Langue — Tous droits réservés.
          </div>
        </footer>
      </body>
    </html>
  );
}
