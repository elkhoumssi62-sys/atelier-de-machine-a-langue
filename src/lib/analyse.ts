export type Analysis = {
  words: number;
  sentences: number;
  paragraphs: number;
  characters: number;
  avgWordsPerSentence: number;
  longSentences: { text: string; words: number }[];
  readability: number;
  readabilityLabel: string;
  lexicalRichness: number;
  connectorsFound: { word: string; count: number }[];
  connectorDensity: number;
  repetitions: { word: string; count: number }[];
  fillers: { word: string; count: number }[];
  typeProfile: { slug: string; label: string; score: number }[];
  readingTime: number;
  advice: string[];
};

const CONNECTORS = [
  "d'abord", "ensuite", "puis", "enfin", "de plus", "en outre", "par ailleurs", "également",
  "car", "parce que", "puisque", "en effet", "étant donné", "grâce à", "à cause de",
  "donc", "ainsi", "par conséquent", "c'est pourquoi", "dès lors", "si bien que", "il en résulte",
  "mais", "cependant", "toutefois", "néanmoins", "en revanche", "alors que", "tandis que",
  "bien que", "certes", "pourtant", "or", "afin de", "afin que", "pour que", "en vue de",
  "si", "à condition que", "au cas où", "à moins que", "par exemple", "notamment",
  "en particulier", "comme le montre", "c'est-à-dire", "autrement dit", "en d'autres termes",
  "en conclusion", "en définitive", "finalement", "en somme", "pour conclure", "au total",
  "de même", "contrairement à", "à l'instar de", "en premier lieu", "en second lieu",
];

const FILLERS = [
  "très", "vraiment", "beaucoup", "chose", "choses", "truc", "un peu", "assez",
  "il y a", "on peut dire", "en fait", "genre", "quelque part", "intéressant", "bien sûr",
];

const STOP_WORDS = new Set([
  "le", "la", "les", "un", "une", "des", "du", "de", "d", "l", "et", "ou", "mais", "donc",
  "or", "ni", "car", "que", "qui", "quoi", "dont", "où", "à", "au", "aux", "en", "dans",
  "par", "pour", "sur", "sous", "avec", "sans", "ce", "cet", "cette", "ces", "se", "sa",
  "son", "ses", "leur", "leurs", "il", "elle", "ils", "elles", "je", "tu", "nous", "vous",
  "on", "y", "ne", "pas", "plus", "est", "sont", "été", "être", "avoir", "a", "ont", "fait",
  "comme", "tout", "tous", "toute", "toutes", "même", "aussi", "bien", "peu", "si", "lui",
  "me", "te", "mon", "ma", "mes", "notre", "nos", "votre", "vos", "s", "c", "n", "j", "qu",
]);

const TYPE_MARKERS: { slug: string; label: string; patterns: RegExp[] }[] = [
  {
    slug: "narratif",
    label: "Narratif",
    patterns: [
      /\b(soudain|aussitôt|alors|ensuite|puis|le lendemain|un jour|la veille|quelques? (heures?|jours?|mois|années?) plus tard)\b/gi,
      /\b\w+(èrent|irent|urent)\b/gi,
      /\b(il|elle|je) (dit|fit|vint|partit|courut|entra|sortit|répondit|comprit|regarda)\b/gi,
    ],
  },
  {
    slug: "descriptif",
    label: "Descriptif",
    patterns: [
      /\b(au premier plan|à droite|à gauche|au loin|au fond|devant|derrière|au-dessus|en contrebas|autour)\b/gi,
      /\b(semblait|paraissait|s'étendait|se dressait|il y avait|on apercevait|ressemblait)\b/gi,
      /\b(comme un|comme une|tel qu|semblable à)\b/gi,
    ],
  },
  {
    slug: "explicatif",
    label: "Explicatif",
    patterns: [
      /\b(c'est-à-dire|autrement dit|en effet|on observe|il s'agit|se définit|résulte de|s'explique par|par exemple|notamment)\b/gi,
      /\b(est|sont|constitue|désigne|correspond|implique|provoque|entraîne)\b/gi,
    ],
  },
  {
    slug: "argumentatif",
    label: "Argumentatif",
    patterns: [
      /\b(certes|cependant|toutefois|néanmoins|en revanche|or|dès lors|par conséquent|il faut|on ne peut|force est de constater)\b/gi,
      /\b(thèse|argument|preuve|démontre|soutient|conteste|réfute|prétend|affirme)\b/gi,
      /\b(doit|devrait|il est (nécessaire|essentiel|inacceptable|urgent))\b/gi,
    ],
  },
  {
    slug: "injonctif",
    label: "Injonctif",
    patterns: [
      /(^|\n)\s*\d+[.)]\s/g,
      /\b(veuillez|il convient de|il est interdit|vous devez|merci de)\b/gi,
      /\b(ajoutez|vérifiez|mélangez|préparez|notez|suivez|cliquez|remplissez|indiquez|respectez)\b/gi,
      /(^|[.!?]\s)(préparer|mélanger|ajouter|verser|couper|installer|brancher)\b/gi,
    ],
  },
  {
    slug: "expressif",
    label: "Expressif",
    patterns: [
      /\bje (sens|ressens|me souviens|crois|voudrais|rêve|pleure|souffre|aime)\b/gi,
      /[!?]{1,}/g,
      /\b(hélas|ô|jamais plus|si seulement|mon dieu|quelle (joie|peine|tristesse))\b/gi,
      /\b(cœur|larmes|joie|tristesse|peur|nostalgie|émotion|douleur|bonheur)\b/gi,
    ],
  },
];

function countSyllables(word: string): number {
  const groups = word.toLowerCase().match(/[aeiouyàâäéèêëîïôöùûü]+/g);
  if (!groups) return 1;
  let count = groups.length;
  if (/[^aeiouyàâäéèêëîïôöùûü]e$/.test(word.toLowerCase()) && count > 1) count -= 1;
  return Math.max(1, count);
}

export function analyse(text: string): Analysis {
  const clean = text.replace(/\r/g, "");
  const trimmed = clean.trim();
  const wordList = trimmed ? trimmed.match(/[\p{L}\p{M}'’-]+/gu) ?? [] : [];
  const words = wordList.length;
  const sentenceList = trimmed
    ? trimmed.split(/[.!?…]+(?:\s|$)/).map((s) => s.trim()).filter((s) => s.length > 1)
    : [];
  const sentences = Math.max(sentenceList.length, trimmed ? 1 : 0);
  const paragraphs = trimmed ? trimmed.split(/\n{1,}/).filter((p) => p.trim().length > 0).length : 0;
  const avgWordsPerSentence = sentences ? words / sentences : 0;

  const longSentences = sentenceList
    .map((s) => ({ text: s, words: (s.match(/[\p{L}\p{M}'’-]+/gu) ?? []).length }))
    .filter((s) => s.words > 30)
    .sort((a, b) => b.words - a.words)
    .slice(0, 4);

  const syllables = wordList.reduce((sum, w) => sum + countSyllables(w), 0);
  const readabilityRaw = words
    ? 207 - 1.015 * avgWordsPerSentence - 73.6 * (syllables / Math.max(words, 1))
    : 0;
  const readability = Math.max(0, Math.min(100, Math.round(readabilityRaw)));
  const readabilityLabel =
    readability >= 80
      ? "Très facile"
      : readability >= 65
        ? "Facile"
        : readability >= 50
          ? "Standard"
          : readability >= 35
            ? "Assez difficile"
            : "Difficile (registre soutenu)";

  const lower = ` ${clean.toLowerCase()} `;

  const connectorsFound = CONNECTORS.map((c) => {
    const re = new RegExp(`(?<![\\p{L}])${c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}])`, "giu");
    const count = (lower.match(re) ?? []).length;
    return { word: c, count };
  })
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  const totalConnectors = connectorsFound.reduce((s, c) => s + c.count, 0);
  const connectorDensity = words ? Math.round((totalConnectors / words) * 1000) / 10 : 0;

  const frequency = new Map<string, number>();
  for (const raw of wordList) {
    const w = raw.toLowerCase();
    if (w.length < 4 || STOP_WORDS.has(w)) continue;
    frequency.set(w, (frequency.get(w) ?? 0) + 1);
  }
  const repetitions = [...frequency.entries()]
    .map(([word, count]) => ({ word, count }))
    .filter((r) => r.count >= 3)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const uniqueWords = new Set(wordList.map((w) => w.toLowerCase())).size;
  const lexicalRichness = words ? Math.round((uniqueWords / words) * 100) : 0;

  const fillers = FILLERS.map((f) => {
    const re = new RegExp(`(?<![\\p{L}])${f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}])`, "giu");
    return { word: f, count: (lower.match(re) ?? []).length };
  })
    .filter((f) => f.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const rawProfile = TYPE_MARKERS.map((marker) => {
    const hits = marker.patterns.reduce(
      (sum, pattern) => sum + (clean.match(pattern) ?? []).length,
      0,
    );
    return { slug: marker.slug, label: marker.label, hits };
  });
  const totalHits = rawProfile.reduce((s, p) => s + p.hits, 0) || 1;
  const typeProfile = rawProfile
    .map((p) => ({ slug: p.slug, label: p.label, score: Math.round((p.hits / totalHits) * 100) }))
    .sort((a, b) => b.score - a.score);

  const advice: string[] = [];
  if (words === 0) advice.push("Commencez à écrire : l'analyse se met à jour en direct.");
  if (avgWordsPerSentence > 28)
    advice.push("Vos phrases dépassent 28 mots en moyenne : segmentez pour gagner en clarté.");
  if (words > 120 && avgWordsPerSentence < 9)
    advice.push("Phrases très courtes : liez-les par des connecteurs pour montrer la logique.");
  if (words > 150 && connectorDensity < 1.2)
    advice.push("Peu de connecteurs logiques : la progression du raisonnement risque d'être implicite.");
  if (connectorDensity > 6)
    advice.push("Densité de connecteurs très élevée : certains liens sont probablement redondants.");
  if (repetitions.length > 0 && words > 120)
    advice.push(`Répétition notable : « ${repetitions[0].word} » apparaît ${repetitions[0].count} fois.`);
  if (fillers.length > 0)
    advice.push(`Tournures à resserrer : ${fillers.map((f) => `« ${f.word} »`).join(", ")}.`);
  if (longSentences.length > 0)
    advice.push(`${longSentences.length} phrase(s) de plus de 30 mots à scinder.`);
  if (words > 200 && lexicalRichness < 35)
    advice.push("Richesse lexicale faible : variez le vocabulaire et évitez les reprises du même terme.");
  if (advice.length === 0 && words > 0) advice.push("Équilibre satisfaisant : relisez à voix haute pour le rythme.");

  return {
    words,
    sentences,
    paragraphs,
    characters: clean.length,
    avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
    longSentences,
    readability,
    readabilityLabel,
    lexicalRichness,
    connectorsFound,
    connectorDensity,
    repetitions,
    fillers,
    typeProfile,
    readingTime: Math.max(1, Math.round(words / 200)),
    advice,
  };
}

export function countWords(text: string): number {
  return (text.match(/[\p{L}\p{M}'’-]+/gu) ?? []).length;
}
