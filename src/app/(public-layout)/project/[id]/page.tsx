import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/api";
import ProjectDetails from "./ProjectDetails";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailsPage({ params }: Props) {
  const resolvedParams = await params; // ✅ MUST exist
  const id = resolvedParams?.id;

  // 🛑 HARD GUARD (IMPORTANT)
  if (!id) {
    notFound();
  }

  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return <ProjectDetails project={project} />;
}
