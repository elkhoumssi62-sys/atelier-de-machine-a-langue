import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import WritingStudio from "@/components/WritingStudio";
import { getGenre, getProject } from "@/lib/data";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Éditeur" };

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projectId = Number(id);
  if (!Number.isFinite(projectId)) notFound();

  const user = await getCurrentUser();
  if (!user) redirect(`/connexion?next=${encodeURIComponent(`/atelier/${id}`)}`);

  const project = await getProject(projectId, user.id);
  if (!project) notFound();

  const genre = await getGenre(project.genreSlug);

  return <WritingStudio project={project} genre={genre} />;
}
