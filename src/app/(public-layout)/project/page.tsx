import ProjectsClient from "@/components/modules/project/ProjectsClient";
import { getProjects } from "@/lib/api";

interface Props {
  searchParams: {
    page?: string;
    search?: string;
    category?: "LEARNING" | "LIVE";
  };
}

export default async function ProjectsPage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const search = searchParams.search;
  const category = searchParams.category;

  const projectsData = await getProjects({
    page,
    limit: 12,
    search,
    category,
    isActive: true,
  });

  return <ProjectsClient initialData={projectsData} />;
}

export const metadata = {
  title: "Projects",
  description: "Browse all my projects and work",
};
