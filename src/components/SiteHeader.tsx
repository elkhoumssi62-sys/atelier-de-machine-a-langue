import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { signOutAction } from "@/app/actions";

const NAV = [
  { href: "/bibliotheque", label: "Bibliothèque" },
  { href: "/ressources", label: "Ressources" },
  { href: "/atelier", label: "Atelier" },
  { href: "/tarifs", label: "Offres" },
];

export default async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-parchment/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-lg text-parchment shadow-sm">
            ✒︎
          </span>
          <span className="leading-tight">
            <span className="font-display block text-[15px] font-semibold text-ink">
              Machine à Langue
            </span>
            <span className="block text-[11px] uppercase tracking-[0.18em] text-ink/50">
              Atelier de rédaction
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink/70 transition hover:bg-sand hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden text-right text-xs leading-tight text-ink/60 sm:block">
                <span className="block font-semibold text-ink">{user.name}</span>
                <span className="capitalize">Offre {user.plan}</span>
              </span>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-lg border border-ink/15 px-3 py-2 text-xs font-semibold text-ink/70 transition hover:bg-sand"
                >
                  Quitter
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/connexion"
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink/70 transition hover:bg-sand"
              >
                Se connecter
              </Link>
              <Link
                href="/connexion?next=/atelier"
                className="rounded-lg bg-ocre px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-ocre-light"
              >
                Ouvrir l&apos;atelier
              </Link>
            </>
          )}
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto border-t border-ink/10 px-5 py-2 md:hidden">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm text-ink/70"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
