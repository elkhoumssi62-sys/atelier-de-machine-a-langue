import { literaryGenres, journalisticGenres, type GenreSeed } from "./genres-literary";
import { professionalGenres, academicGenres } from "./genres-pro";

export type { GenreSeed };

export const categorySeeds = [
  {
    slug: "litteraires",
    name: "Genres littéraires",
    description:
      "Prose narrative, poésie, théâtre et écrits d'idées : la création au service d'une vision du monde.",
    icon: "📚",
  },
  {
    slug: "journalistiques",
    name: "Genres journalistiques et médiatiques",
    description:
      "Informer ou commenter l'actualité : de la brève factuelle à l'éditorial engagé.",
    icon: "📰",
  },
  {
    slug: "professionnels",
    name: "Genres professionnels et administratifs",
    description:
      "Correspondance, synthèse et suivi : écrire pour agir, décider et laisser trace.",
    icon: "🗂️",
  },
  {
    slug: "academiques",
    name: "Genres académiques et scolaires",
    description:
      "Dissertation, commentaire, synthèse, recherche : les écrits de la démonstration.",
    icon: "🎓",
  },
];

export const genreSeeds: GenreSeed[] = [
  ...literaryGenres,
  ...journalisticGenres,
  ...professionalGenres,
  ...academicGenres,
];
