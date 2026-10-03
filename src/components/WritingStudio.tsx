"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { GenreRow, ProjectRow } from "@/db/schema";
import { analyse } from "@/lib/analyse";

type Section = { title: string; goal: string; content: string };

const STATUSES = ["brouillon", "en révision", "finalisé"];

export default function WritingStudio({
  project,
  genre,
}: {
  project: ProjectRow;
  genre: GenreRow | null;
}) {
  const [title, setTitle] = useState(project.title);
  const [subject, setSubject] = useState(project.subject);
  const [status, setStatus] = useState(project.status);
  const [targetWords, setTargetWords] = useState(project.targetWords);
  const [sections, setSections] = useState<Section[]>(
    project.sections.length > 0
      ? project.sections
      : [{ title: "Texte", goal: "Rédaction libre", content: "" }],
  );
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>(
    project.checklistState ?? {},
  );
  const [notes, setNotes] = useState(project.notes);
  const [active, setActive] = useState(0);
  const [panel, setPanel] = useState<"analyse" | "plan" | "ressources" | "checklist">("analyse");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const firstRender = useRef(true);

  const fullText = useMemo(
    () => sections.map((section) => section.content).join("\n\n"),
    [sections],
  );
  const stats = useMemo(() => analyse(fullText), [fullText]);

  const save = useCallback(async () => {
    setSaveState("saving");
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subject, status, targetWords, sections, checklistState, notes }),
      });
      setSaveState(response.ok ? "saved" : "error");
    } catch {
      setSaveState("error");
    }
  }, [project.id, title, subject, status, targetWords, sections, checklistState, notes]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setSaveState("saving");
    const timer = window.setTimeout(() => {
      void save();
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [save]);

  function updateSection(index: number, content: string) {
    setSections((current) =>
      current.map((section, i) => (i === index ? { ...section, content } : section)),
    );
  }

  function insertAtCursor(snippet: string) {
    const element = textareaRef.current;
    const current = sections[active]?.content ?? "";
    if (!element) {
      updateSection(active, `${current}${current.endsWith(" ") || current === "" ? "" : " "}${snippet}`);
      return;
    }
    const start = element.selectionStart ?? current.length;
    const end = element.selectionEnd ?? current.length;
    const next = `${current.slice(0, start)}${snippet}${current.slice(end)}`;
    updateSection(active, next);
    window.requestAnimationFrame(() => {
      element.focus();
      const caret = start + snippet.length;
      element.setSelectionRange(caret, caret);
    });
  }

  function exportMarkdown() {
    const body = sections
      .map((section) => `## ${section.title}\n\n${section.content.trim()}`)
      .join("\n\n");
    const markdown = `# ${title}\n\n> Genre : ${genre?.name ?? project.genreSlug}${
      subject ? `\n> Sujet : ${subject}` : ""
    }\n\n${body}\n`;
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.replace(/[^\p{L}\p{N}]+/gu, "-").toLowerCase()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const planStep = genre?.plan[active];
  const sectionTarget = planStep ? Math.round((planStep.share / 100) * targetWords) : null;
  const sectionWords = analyse(sections[active]?.content ?? "").words;
  const progress = Math.min(100, Math.round((stats.words / Math.max(targetWords, 1)) * 100));
  const checkedCount = genre
    ? genre.checklist.filter((item) => checklistState[item]).length
    : 0;

  return (
    <div className="space-y-5">
      <header className="card rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/atelier" className="text-xs font-semibold uppercase tracking-[0.16em] text-ocre hover:underline">
            ← Mes projets
          </Link>
          <div className="flex items-center gap-3 text-xs">
            <span
              className={`rounded-full px-3 py-1 font-semibold ${
                saveState === "saved"
                  ? "bg-forest/10 text-forest"
                  : saveState === "saving"
                    ? "bg-sand text-ink/60"
                    : saveState === "error"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-sand text-ink/50"
              }`}
            >
              {saveState === "saved"
                ? "Enregistré ✓"
                : saveState === "saving"
                  ? "Enregistrement…"
                  : saveState === "error"
                    ? "Échec de l'enregistrement"
                    : "Synchronisé"}
            </span>
            <button
              type="button"
              onClick={exportMarkdown}
              className="rounded-lg border border-ink/15 px-3 py-1.5 font-semibold hover:bg-sand"
            >
              Exporter (.md)
            </button>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(fullText)}
              className="rounded-lg border border-ink/15 px-3 py-1.5 font-semibold hover:bg-sand"
            >
              Copier le texte
            </button>
          </div>
        </div>

        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="font-display mt-4 w-full rounded-xl border border-transparent bg-transparent px-1 text-3xl font-semibold focus:border-ink/15 focus:bg-white"
        />
        <input
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          placeholder="Sujet ou consigne…"
          className="mt-1 w-full rounded-xl border border-transparent bg-transparent px-1 text-sm text-ink/65 focus:border-ink/15 focus:bg-white"
        />

        <div className="mt-4 flex flex-wrap items-center gap-4">
          {genre && (
            <Link
              href={`/genres/${genre.slug}`}
              className="rounded-lg bg-ocre/10 px-3 py-1.5 text-xs font-semibold text-ocre hover:bg-ocre/20"
            >
              {genre.name} · fiche méthode
            </Link>
          )}
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-lg border border-ink/15 bg-white px-3 py-1.5 text-xs font-semibold capitalize"
          >
            {STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-xs text-ink/60">
            Objectif
            <input
              type="number"
              min={100}
              step={50}
              value={targetWords}
              onChange={(event) => setTargetWords(Number(event.target.value) || 100)}
              className="w-24 rounded-lg border border-ink/15 bg-white px-2 py-1.5 text-xs"
            />
            mots
          </label>
          <div className="flex min-w-[180px] flex-1 items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-sand">
              <div className="h-full rounded-full bg-forest/70" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs font-semibold text-ink/60">
              {stats.words}/{targetWords}
            </span>
          </div>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* EDITEUR */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {sections.map((section, index) => (
              <button
                key={`${section.title}-${index}`}
                type="button"
                onClick={() => setActive(index)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  index === active
                    ? "bg-ink text-parchment"
                    : "card text-ink/70 hover:bg-sand"
                }`}
              >
                {index + 1}. {section.title}
              </button>
            ))}
          </div>

          <div className="card rounded-2xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-semibold">{sections[active]?.title}</h2>
                <p className="text-sm text-ink/60">{sections[active]?.goal}</p>
              </div>
              <div className="text-right text-xs text-ink/55">
                <p className="font-semibold text-ink">{sectionWords} mots</p>
                {sectionTarget !== null && <p>cible ≈ {sectionTarget}</p>}
              </div>
            </div>

            {planStep && planStep.prompts.length > 0 && (
              <ul className="mt-3 space-y-1 rounded-xl border border-forest/20 bg-forest/5 p-3 text-sm text-ink/70">
                {planStep.prompts.map((prompt) => (
                  <li key={prompt} className="flex gap-2">
                    <span className="text-forest">?</span>
                    <span>{prompt}</span>
                  </li>
                ))}
              </ul>
            )}

            <textarea
              ref={textareaRef}
              value={sections[active]?.content ?? ""}
              onChange={(event) => updateSection(active, event.target.value)}
              placeholder="Rédigez cette section…"
              className="mt-4 min-h-[420px] w-full resize-y rounded-xl border border-ink/12 bg-white p-4 text-[15px] leading-[1.8] text-ink/90"
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-ink/55">
              <span>
                Section {active + 1} / {sections.length}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={active === 0}
                  onClick={() => setActive((i) => Math.max(0, i - 1))}
                  className="rounded-lg border border-ink/15 px-3 py-1.5 font-semibold disabled:opacity-40"
                >
                  ← Précédente
                </button>
                <button
                  type="button"
                  disabled={active === sections.length - 1}
                  onClick={() => setActive((i) => Math.min(sections.length - 1, i + 1))}
                  className="rounded-lg border border-ink/15 px-3 py-1.5 font-semibold disabled:opacity-40"
                >
                  Suivante →
                </button>
              </div>
            </div>
          </div>

          <div className="card rounded-2xl p-5">
            <h3 className="font-display text-lg font-semibold">Notes de travail</h3>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Idées, citations, références à vérifier…"
              className="mt-2 min-h-[120px] w-full resize-y rounded-xl border border-ink/12 bg-white p-3 text-sm"
            />
          </div>
        </div>

        {/* PANNEAU LATERAL */}
        <aside className="space-y-4">
          <div className="card sticky top-[84px] rounded-2xl p-4">
            <div className="flex flex-wrap gap-1">
              {([
                ["analyse", "Analyse"],
                ["plan", "Plan"],
                ["ressources", "Ressources"],
                ["checklist", `Check-list ${genre ? `${checkedCount}/${genre.checklist.length}` : ""}`],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPanel(key)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                    panel === key ? "bg-ink text-parchment" : "text-ink/60 hover:bg-sand"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-4 max-h-[70vh] overflow-y-auto pr-1">
              {panel === "analyse" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    {[
                      { k: stats.words, l: "mots" },
                      { k: stats.sentences, l: "phrases" },
                      { k: stats.avgWordsPerSentence, l: "mots/phrase" },
                      { k: `${stats.lexicalRichness} %`, l: "richesse lexicale" },
                    ].map((item) => (
                      <div key={item.l} className="rounded-xl border border-ink/10 bg-white/70 p-2">
                        <p className="font-display text-xl font-semibold text-ocre">{item.k}</p>
                        <p className="text-[10px] uppercase tracking-wide text-ink/50">{item.l}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink/55">
                      Lisibilité · {stats.readabilityLabel}
                    </p>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-sand">
                      <div className="h-full rounded-full bg-ocre/70" style={{ width: `${stats.readability}%` }} />
                    </div>
                    <p className="mt-1 text-[11px] text-ink/50">
                      Indice {stats.readability}/100 · lecture ≈ {stats.readingTime} min
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink/55">
                      Profil typologique détecté
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {stats.typeProfile.slice(0, 4).map((item) => {
                        const expected = genre?.dominantTypes.includes(item.slug);
                        return (
                          <li key={item.slug} className="text-xs">
                            <div className="flex justify-between">
                              <span className={expected ? "font-semibold text-forest" : "text-ink/65"}>
                                {item.label} {expected && "• attendu"}
                              </span>
                              <span className="text-ink/50">{item.score} %</span>
                            </div>
                            <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-sand">
                              <div
                                className={`h-full rounded-full ${expected ? "bg-forest/70" : "bg-ink/25"}`}
                                style={{ width: `${item.score}%` }}
                              />
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink/55">
                      Connecteurs repérés · densité {stats.connectorDensity} ‰
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {stats.connectorsFound.length === 0 && (
                        <span className="text-xs text-ink/50">Aucun connecteur détecté.</span>
                      )}
                      {stats.connectorsFound.map((connector) => (
                        <span key={connector.word} className="rounded-md bg-ocre/10 px-2 py-0.5 text-[11px] text-ocre">
                          {connector.word} ×{connector.count}
                        </span>
                      ))}
                    </div>
                  </div>

                  {stats.repetitions.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-ink/55">Répétitions</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {stats.repetitions.map((rep) => (
                          <span key={rep.word} className="rounded-md bg-sand px-2 py-0.5 text-[11px] text-ink/70">
                            {rep.word} ×{rep.count}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {stats.longSentences.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-ink/55">
                        Phrases trop longues
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {stats.longSentences.map((sentence) => (
                          <li
                            key={sentence.text.slice(0, 40)}
                            className="rounded-lg border border-amber-200 bg-amber-50/70 p-2 text-[11px] text-ink/70"
                          >
                            <strong>{sentence.words} mots :</strong> {sentence.text.slice(0, 110)}…
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink/55">Conseils</p>
                    <ul className="mt-2 space-y-1.5 text-xs text-ink/70">
                      {stats.advice.map((item) => (
                        <li key={item} className="flex gap-2 rounded-lg bg-white/70 p-2">
                          <span className="text-ocre">▸</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {panel === "plan" && genre && (
                <ol className="space-y-3">
                  {genre.plan.map((step, index) => (
                    <li
                      key={step.title}
                      className={`rounded-xl border p-3 text-xs ${
                        index === active ? "border-ocre/40 bg-ocre/5" : "border-ink/10 bg-white/70"
                      }`}
                    >
                      <button type="button" onClick={() => setActive(index)} className="text-left">
                        <p className="font-display text-sm font-semibold">
                          {index + 1}. {step.title}{" "}
                          <span className="text-ink/45">({step.share} %)</span>
                        </p>
                        <p className="mt-1 text-ink/65">{step.goal}</p>
                      </button>
                    </li>
                  ))}
                  <li className="rounded-xl border border-ink/10 bg-white/70 p-3 text-xs text-ink/70">
                    <p className="font-semibold">Méthode</p>
                    <ul className="mt-1 list-disc space-y-1 pl-4">
                      {genre.method.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </li>
                </ol>
              )}

              {panel === "ressources" && genre && (
                <div className="space-y-4 text-xs">
                  <div>
                    <p className="font-semibold uppercase tracking-wide text-ink/55">
                      Connecteurs du genre — cliquez pour insérer
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {genre.connectors.map((connector) => (
                        <button
                          key={connector}
                          type="button"
                          onClick={() => insertAtCursor(`${connector} `)}
                          className="rounded-lg border border-ink/12 bg-white/70 px-2 py-1 hover:border-ocre/40 hover:text-ocre"
                        >
                          {connector}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold uppercase tracking-wide text-ink/55">Amorces et formules</p>
                    <ul className="mt-2 space-y-1.5">
                      {genre.phrases.map((phrase) => (
                        <li key={phrase}>
                          <button
                            type="button"
                            onClick={() => insertAtCursor(phrase)}
                            className="w-full rounded-lg border border-ink/12 bg-white/70 px-2 py-1.5 text-left italic hover:border-ocre/40 hover:text-ocre"
                          >
                            « {phrase} »
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold uppercase tracking-wide text-ink/55">Erreurs à éviter</p>
                    <ul className="mt-2 space-y-1">
                      {genre.pitfalls.map((pitfall) => (
                        <li key={pitfall} className="rounded-lg bg-rose-50/70 px-2 py-1.5 text-ink/75">
                          ✕ {pitfall}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link href="/ressources" className="block text-center font-semibold text-ocre hover:underline">
                    Ouvrir la banque complète →
                  </Link>
                </div>
              )}

              {panel === "checklist" && genre && (
                <div className="space-y-4 text-xs">
                  <ul className="space-y-2">
                    {genre.checklist.map((item) => (
                      <li key={item}>
                        <label className="flex cursor-pointer gap-2 rounded-lg border border-ink/10 bg-white/70 p-2">
                          <input
                            type="checkbox"
                            checked={Boolean(checklistState[item])}
                            onChange={(event) =>
                              setChecklistState((current) => ({
                                ...current,
                                [item]: event.target.checked,
                              }))
                            }
                            className="mt-0.5 accent-[#1f4d3f]"
                          />
                          <span className={checklistState[item] ? "text-ink/45 line-through" : "text-ink/75"}>
                            {item}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                  <div>
                    <p className="font-semibold uppercase tracking-wide text-ink/55">Grille d&apos;évaluation</p>
                    <ul className="mt-2 space-y-2">
                      {genre.criteria.map((criterion) => (
                        <li key={criterion.label}>
                          <div className="flex justify-between">
                            <span className="text-ink/75">{criterion.label}</span>
                            <span className="text-ink/50">{criterion.weight} %</span>
                          </div>
                          <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-sand">
                            <div className="h-full rounded-full bg-forest/70" style={{ width: `${criterion.weight}%` }} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {(panel === "plan" || panel === "ressources" || panel === "checklist") && !genre && (
                <p className="text-xs text-ink/55">Aucune fiche de genre associée à ce projet.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
