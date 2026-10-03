export type TextTypeSeed = {
  slug: string;
  name: string;
  tagline: string;
  intention: string;
  definition: string;
  accent: string;
  icon: string;
  features: string[];
  grammar: string[];
  lexicon: string[];
  uses: string[];
  structure: { title: string; detail: string }[];
  pitfalls: string[];
  sample: string;
  sampleNote: string;
  exercises: string[];
};

export const textTypeSeeds: TextTypeSeed[] = [
  {
    slug: "narratif",
    name: "Narratif",
    tagline: "Raconter une histoire ou une suite d'actions situées dans le temps",
    intention: "Raconter une histoire ou une suite d'actions situées dans le temps.",
    definition:
      "Le texte narratif rapporte des événements réels ou fictifs organisés dans une chronologie. Il repose sur un narrateur (point de vue), des personnages, un cadre spatio-temporel et une transformation : une situation initiale est bouleversée, puis rééquilibrée. Narrer, c'est choisir un ordre (chronologie, retour en arrière, anticipation) et un rythme (sommaire, scène, ellipse, pause).",
    accent: "amber",
    icon: "📖",
    features: [
      "Utilisation du schéma narratif en cinq étapes (quinaire).",
      "Verbes d'action et succession des procès.",
      "Indicateurs temporels : d'abord, soudain, le lendemain, trois ans plus tard.",
      "Temps du récit : passé simple (premier plan) / imparfait (arrière-plan) ou présent de narration.",
      "Présence d'un narrateur : interne, externe ou omniscient.",
      "Alternance récit / dialogue / description.",
    ],
    grammar: [
      "Passé simple : actions de premier plan, ponctuelles et successives.",
      "Imparfait : décor, habitudes, descriptions, actions en cours.",
      "Plus-que-parfait : antériorité, retour en arrière (analepse).",
      "Présent de narration : effet d'immédiateté et de vivacité.",
      "Connecteurs chronologiques et organisateurs temporels.",
    ],
    lexicon: [
      "Verbes de mouvement : s'élancer, franchir, gravir, rebrousser chemin.",
      "Verbes de parole : murmurer, rétorquer, s'exclamer, confier.",
      "Marqueurs : aussitôt, dès lors, à l'aube, peu après, enfin.",
    ],
    uses: ["Contes", "Romans et nouvelles", "Faits divers", "Comptes rendus d'événements", "Récits de vie"],
    structure: [
      { title: "Situation initiale", detail: "Qui ? Où ? Quand ? Équilibre de départ, à l'imparfait le plus souvent." },
      { title: "Élément perturbateur", detail: "Un fait qui rompt l'équilibre : « Un matin, … », passé simple." },
      { title: "Péripéties", detail: "Actions, obstacles, adjuvants et opposants, progression de la tension." },
      { title: "Dénouement", detail: "Résolution du problème, action décisive." },
      { title: "Situation finale", detail: "Nouvel équilibre, parfois morale ou ouverture." },
    ],
    pitfalls: [
      "Mélanger les temps du récit sans logique (passé simple / présent).",
      "Changer de point de vue narratif sans raison.",
      "Accumuler les actions sans tension ni enjeu.",
      "Oublier d'ancrer le récit dans un espace et un temps précis.",
    ],
    sample:
      "La ruelle dormait encore sous une lumière grise. Hakim rangeait ses cageots comme chaque matin, sans rien attendre du jour. Soudain, un cri déchira le silence : la devanture du libraire venait de céder. Il laissa tomber ses oranges et courut. Quand il revint, une heure plus tard, la ruelle n'était plus tout à fait la même, et lui non plus.",
    sampleNote:
      "Imparfait (« dormait », « rangeait ») pour l'arrière-plan ; passé simple (« déchira », « courut ») pour le premier plan ; « Soudain » marque l'élément perturbateur.",
    exercises: [
      "Réécrivez un fait divers de cinq lignes en respectant le schéma quinaire.",
      "Transposez un récit du passé simple au présent de narration et commentez l'effet.",
      "Insérez une analepse d'une phrase dans un récit existant.",
    ],
  },
  {
    slug: "descriptif",
    name: "Descriptif",
    tagline: "Représenter un lieu, un objet, un personnage ou un paysage",
    intention: "Représenter un lieu, un objet, un personnage (portrait) ou un paysage.",
    definition:
      "Le texte descriptif donne à voir. Il suspend le temps de l'action pour organiser l'espace et les qualités d'un référent. Toute description obéit à un ordre (du général au particulier, de haut en bas, du proche au lointain) et à un point de vue : celui qui regarde détermine ce qui est vu et la valeur (méliorative ou péjorative) de ce qui est décrit.",
    accent: "emerald",
    icon: "🖼️",
    features: [
      "Indicateurs spatiaux : au premier plan, à droite, au loin, en contrebas.",
      "Abondance d'adjectifs qualificatifs et de compléments du nom.",
      "Verbes d'état et verbes de perception : paraître, sembler, se dresser, s'étendre.",
      "Comparaisons et métaphores pour rendre sensible l'objet décrit.",
      "Imparfait descriptif ou présent de description.",
      "Organisation en plans successifs selon un parcours du regard.",
    ],
    grammar: [
      "Imparfait : description dans un récit au passé.",
      "Présent : description intemporelle (guide, notice, document).",
      "Expansions du nom : adjectif, complément du nom, proposition relative.",
      "Tournures présentatives : il y avait, on apercevait, se détachait.",
    ],
    lexicon: [
      "Champ lexical des sens : visuel, auditif, olfactif, tactile, gustatif.",
      "Couleurs et matières : ocre, mordoré, rugueux, satiné.",
      "Vocabulaire mélioratif / péjoratif pour orienter le regard.",
    ],
    uses: ["Portraits littéraires", "Descriptions physiques et morales", "Guides touristiques", "Fiches produits", "Ekphrasis"],
    structure: [
      { title: "Cadrage", detail: "Nommer l'objet décrit et poser le point de vue (qui regarde, d'où ?)." },
      { title: "Vue d'ensemble", detail: "Impression dominante, atmosphère générale." },
      { title: "Parcours organisé", detail: "Plans successifs : premier plan, second plan, arrière-plan." },
      { title: "Détails signifiants", detail: "Deux ou trois détails porteurs de sens plutôt qu'un inventaire." },
      { title: "Clôture", detail: "Retour à l'impression d'ensemble, effet produit sur l'observateur." },
    ],
    pitfalls: [
      "L'inventaire : accumuler les détails sans hiérarchie.",
      "Les adjectifs vagues : beau, joli, grand, intéressant.",
      "Perdre le point de vue en cours de description.",
      "Décrire sans fonction dramatique dans un récit.",
    ],
    sample:
      "La maison se dressait au bout du sentier, trapue, les volets mangés de sel. Au premier plan, un figuier étendait son ombre sur une dalle fendue ; plus loin, la mer battait contre les rochers comme une respiration lente. Tout, ici, semblait avoir été poli par le vent.",
    sampleNote:
      "Indicateurs spatiaux (« au bout », « au premier plan », « plus loin »), verbes d'état et de position, comparaison finale qui unifie l'impression.",
    exercises: [
      "Décrivez une même pièce selon deux points de vue opposés (mélioratif / péjoratif).",
      "Rédigez un portrait en reliant trois traits physiques à trois traits moraux.",
      "Transformez une liste de détails en description organisée par plans.",
    ],
  },
  {
    slug: "explicatif",
    name: "Explicatif / Informatif",
    tagline: "Faire comprendre un phénomène, analyser une idée, transmettre un savoir",
    intention: "Faire comprendre un phénomène, analyser une idée ou transmettre un savoir.",
    definition:
      "Le texte explicatif répond à une question du type « pourquoi ? » ou « comment ? ». Il part d'un fait problématique, le décompose, l'éclaire par des causes, des mécanismes, des exemples et des définitions. Sa posture est celle de l'objectivité : l'énonciateur s'efface derrière le savoir qu'il transmet et vise un lecteur supposé non spécialiste.",
    accent: "sky",
    icon: "🔬",
    features: [
      "Vocabulaire spécialisé, défini au besoin.",
      "Ton neutre et objectif, effacement énonciatif.",
      "Connecteurs logiques : car, donc, en effet, ainsi, c'est pourquoi.",
      "Présent de vérité générale.",
      "Procédés : définition, reformulation, exemplification, comparaison, analyse causale.",
      "Organisation visible : titres, paragraphes, schémas, énumérations.",
    ],
    grammar: [
      "Présent de l'indicatif à valeur générale.",
      "Tournures impersonnelles et passives : il s'agit de, on observe que, est provoqué par.",
      "Subordonnées causales et consécutives : parce que, de sorte que.",
      "Appositions explicatives et incises définitoires.",
    ],
    lexicon: [
      "Verbes du savoir : désigner, résulter de, se traduire par, impliquer.",
      "Marqueurs de reformulation : autrement dit, c'est-à-dire, en d'autres termes.",
      "Marqueurs d'illustration : ainsi, par exemple, notamment, en particulier.",
    ],
    uses: ["Articles encyclopédiques", "Manuels scolaires", "Rapports d'analyse", "Vulgarisation scientifique", "Notices"],
    structure: [
      { title: "Phase de questionnement", detail: "Poser le fait et la question : pourquoi, comment ?" },
      { title: "Phase explicative", detail: "Causes, mécanismes, étapes, facteurs, hiérarchisés." },
      { title: "Illustration", detail: "Exemples, chiffres, analogies qui rendent l'explication concrète." },
      { title: "Phase conclusive", detail: "Synthèse du mécanisme, conséquences, ouverture." },
    ],
    pitfalls: [
      "Glisser vers l'argumentation en défendant une opinion.",
      "Employer un jargon non défini.",
      "Juxtaposer des informations sans lien logique explicite.",
      "Confondre cause et conséquence.",
    ],
    sample:
      "L'effet de serre résulte d'un mécanisme physique simple. Le rayonnement solaire traverse l'atmosphère et réchauffe la surface terrestre ; celle-ci réémet alors un rayonnement infrarouge. Or certains gaz — vapeur d'eau, dioxyde de carbone, méthane — absorbent une partie de ce rayonnement et le renvoient vers le sol. C'est pourquoi la température moyenne du globe s'établit autour de 15 °C et non de −18 °C.",
    sampleNote:
      "Présent de vérité générale, lexique spécialisé défini par énumération, connecteurs causaux et consécutifs (« alors », « or », « c'est pourquoi »).",
    exercises: [
      "Expliquez un phénomène de votre discipline en 150 mots sans employer « je ».",
      "Reformulez trois termes techniques pour un lecteur de 15 ans.",
      "Transformez un paragraphe argumentatif en paragraphe explicatif neutre.",
    ],
  },
  {
    slug: "argumentatif",
    name: "Argumentatif",
    tagline: "Convaincre ou persuader le lecteur de partager une thèse",
    intention: "Convaincre ou persuader le lecteur de partager une thèse.",
    definition:
      "Le texte argumentatif vise à modifier les représentations du destinataire. Il articule une thèse (position défendue), des arguments (raisons générales) et des exemples (preuves concrètes). Convaincre passe par la raison (logos), persuader par l'émotion (pathos) ; la crédibilité de l'énonciateur (ethos) soutient l'ensemble. Une argumentation solide anticipe la thèse adverse pour la réfuter.",
    accent: "rose",
    icon: "⚖️",
    features: [
      "Présence explicite ou implicite d'une thèse.",
      "Arguments hiérarchisés, chacun illustré par un exemple.",
      "Connecteurs logiques d'addition, d'opposition, de concession, de conclusion.",
      "Vocabulaire appréciatif ou dépréciatif, modalisateurs.",
      "Réfutation de la thèse adverse (concession puis objection).",
      "Procédés rhétoriques : question oratoire, antithèse, gradation.",
    ],
    grammar: [
      "Présent d'énonciation et de vérité générale.",
      "Modalisateurs : certainement, sans doute, il semble que, il faut.",
      "Subordonnées concessives et oppositives : bien que, quoique, alors que.",
      "Impératif et première personne du pluriel inclusive dans la persuasion.",
    ],
    lexicon: [
      "Verbes d'opinion : affirmer, soutenir, contester, nuancer, concéder.",
      "Mots évaluatifs : décisif, contestable, néfaste, salutaire.",
      "Connecteurs argumentatifs : certes… mais, non seulement… mais encore, en définitive.",
    ],
    uses: ["Essais", "Plaidoyers et réquisitoires", "Articles d'opinion et éditoriaux", "Lettres de motivation", "Dissertations"],
    structure: [
      { title: "Accroche et enjeu", detail: "Situer le débat, montrer qu'il y a problème." },
      { title: "Thèse", detail: "Formuler clairement la position défendue." },
      { title: "Argument 1 + exemple", detail: "Argument le plus solide, illustré et analysé." },
      { title: "Argument 2 + exemple", detail: "Nouvel angle : économique, social, éthique, esthétique." },
      { title: "Concession / réfutation", detail: "Certes… mais : reconnaître la force adverse puis la dépasser." },
      { title: "Conclusion", detail: "Bilan de la démonstration, appel ou ouverture." },
    ],
    pitfalls: [
      "Confondre argument (raison générale) et exemple (cas particulier).",
      "Affirmer sans prouver ni illustrer.",
      "Attaquer l'adversaire plutôt que sa thèse.",
      "Juxtaposer les arguments sans gradation ni connecteurs.",
    ],
    sample:
      "L'écriture manuscrite doit garder sa place à l'école. D'abord, parce qu'elle engage le corps : tracer une lettre, c'est en mémoriser la forme, et les études en neurosciences de l'éducation montrent une meilleure rétention orthographique chez les élèves qui écrivent à la main. Certes, le clavier accélère la production et facilite la révision des textes. Mais la vitesse n'est pas l'apprentissage : ce qui s'inscrit sans effort s'efface aussi sans trace.",
    sampleNote:
      "Thèse en ouverture, argument appuyé sur une preuve, mouvement concessif « Certes… Mais » qui réfute l'objection.",
    exercises: [
      "Rédigez un paragraphe argumentatif en suivant le schéma AEA (Argument – Exemple – Analyse).",
      "Transformez un argument en son contraire et construisez la réfutation.",
      "Repérez les modalisateurs d'un éditorial et mesurez son degré d'engagement.",
    ],
  },
  {
    slug: "injonctif",
    name: "Injonctif / Prescriptif",
    tagline: "Donner des ordres, des instructions, des conseils ou imposer des règles",
    intention: "Donner des ordres, des instructions, des conseils ou imposer des règles.",
    definition:
      "Le texte injonctif cherche à faire agir. Il s'adresse directement à un destinataire et organise l'action en étapes ordonnées. Son efficacité tient à la clarté : une opération par phrase, un ordre chronologique strict, aucune ambiguïté référentielle. Le degré d'injonction varie du conseil (devriez) à l'obligation absolue (il est interdit de).",
    accent: "violet",
    icon: "📋",
    features: [
      "Impératif, infinitif ou subjonctif d'ordre.",
      "Tournures impersonnelles : il convient de, il est interdit de, nul ne peut.",
      "Structure énumérative : listes, numérotation, puces.",
      "Phrases courtes, lexique univoque, verbes d'action en tête.",
      "Précision des quantités, durées, outils, conditions.",
      "Mise en page fonctionnelle : titres, étapes, avertissements.",
    ],
    grammar: [
      "Impératif présent : mélangez, vérifiez, n'ouvrez pas.",
      "Infinitif de consigne : préchauffer le four, couper l'alimentation.",
      "Futur à valeur prescriptive dans les règlements : le candidat déposera.",
      "Modalités déontiques : devoir, pouvoir, être tenu de.",
    ],
    lexicon: [
      "Verbes opératoires : brancher, incorporer, serrer, soumettre, joindre.",
      "Marqueurs d'ordre : d'abord, ensuite, puis, enfin, avant de, une fois que.",
      "Marqueurs de précaution : attention, veillez à, en cas de.",
    ],
    uses: ["Recettes de cuisine", "Règlements intérieurs", "Modes d'emploi", "Consignes d'examen", "Protocoles et procédures"],
    structure: [
      { title: "Objectif", detail: "Ce que l'on va réaliser et le résultat attendu." },
      { title: "Prérequis", detail: "Matériel, ingrédients, conditions, public concerné." },
      { title: "Étapes numérotées", detail: "Une action par étape, dans l'ordre d'exécution." },
      { title: "Avertissements", detail: "Risques, erreurs fréquentes, cas particuliers." },
      { title: "Vérification", detail: "Comment savoir que l'opération a réussi." },
    ],
    pitfalls: [
      "Mélanger impératif et infinitif dans une même liste.",
      "Supposer des connaissances implicites chez le destinataire.",
      "Omettre les quantités, les durées ou les unités.",
      "Rédiger des étapes qui contiennent plusieurs opérations à la fois.",
    ],
    sample:
      "1. Préchauffer le four à 180 °C. 2. Mélanger la farine et le sucre dans un saladier. 3. Incorporer les œufs un à un, sans cesser de battre. 4. Verser la préparation dans un moule beurré. 5. Enfourner 25 minutes. Attention : ne pas ouvrir la porte du four avant la vingtième minute.",
    sampleNote:
      "Infinitif de consigne homogène, numérotation, une opération par étape, avertissement final isolé.",
    exercises: [
      "Rédigez en huit étapes la procédure d'inscription à un examen.",
      "Réécrivez une consigne ambiguë en supprimant tout implicite.",
      "Transposez un règlement du futur prescriptif à l'impératif et comparez l'effet.",
    ],
  },
  {
    slug: "expressif",
    name: "Expressif / Émotif",
    tagline: "Exprimer des sentiments, des émotions ou des états d'âme",
    intention: "Exprimer des sentiments, des émotions ou des états d'âme.",
    definition:
      "Le texte expressif place le sujet énonciateur au centre : il dit le « je » qui éprouve. Sa force ne vient pas de l'intensité des mots employés mais de la justesse des images et du rythme. L'émotion se montre (par une scène, un détail, une sensation) plus qu'elle ne se nomme.",
    accent: "fuchsia",
    icon: "🕯️",
    features: [
      "Emploi de la première personne et des marques de subjectivité.",
      "Ponctuation expressive : exclamation, interrogation, suspension.",
      "Champ lexical des émotions et des sensations.",
      "Figures d'intensité : métaphore, anaphore, hyperbole, gradation.",
      "Rythme travaillé : phrases brèves, reprises, silences.",
      "Adresse possible à un destinataire (apostrophe lyrique).",
    ],
    grammar: [
      "Présent d'énonciation, passé composé du témoignage.",
      "Phrases exclamatives et nominales.",
      "Modalisateurs affectifs : hélas, heureusement, trop, si.",
      "Subjonctif du souhait et du regret.",
    ],
    lexicon: [
      "Émotions : effroi, allégresse, mélancolie, soulagement, nostalgie.",
      "Sensations : étourdissement, brûlure, frisson, vertige.",
      "Images : comparaisons concrètes tirées du corps et du paysage.",
    ],
    uses: ["Poésie lyrique", "Journaux intimes", "Correspondances personnelles", "Récits de soi", "Billets personnels"],
    structure: [
      { title: "Situation d'énonciation", detail: "Qui parle, à qui, dans quelles circonstances." },
      { title: "Déclencheur", detail: "L'objet, le lieu ou le souvenir qui provoque l'émotion." },
      { title: "Montée", detail: "Développement de la sensation par images et rythme." },
      { title: "Point culminant", detail: "Formule brève, image centrale, paradoxe." },
      { title: "Retombée", detail: "Apaisement, lucidité, question ouverte." },
    ],
    pitfalls: [
      "Nommer l'émotion au lieu de la faire éprouver (« j'étais très triste »).",
      "Multiplier les points d'exclamation à la place des images.",
      "Recourir aux clichés : « un cœur brisé », « des larmes amères ».",
      "Perdre la cohérence énonciative en glissant du « je » au « on ».",
    ],
    sample:
      "Je suis retourné dans la cour. Le même gravier, le même banc, la même odeur de craie montant des classes vides. Rien n'avait changé, et c'était insupportable : tout ce qui était resté mesurait exactement ce que j'avais perdu.",
    sampleNote:
      "L'émotion n'est jamais nommée ; elle naît de l'anaphore « le même », du détail sensoriel et du paradoxe final.",
    exercises: [
      "Exprimez la peur sans employer les mots peur, effrayé, terrible.",
      "Écrivez une page de journal intime en dix phrases dont trois nominales.",
      "Réécrivez un passage lyrique en supprimant toutes les exclamations.",
    ],
  },
];
