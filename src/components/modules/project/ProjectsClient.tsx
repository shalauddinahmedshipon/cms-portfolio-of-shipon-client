"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProjectCard from "@/components/modules/home/ProjectCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectsResponse } from "@/types/api.response.types";
import { cn } from "@/lib/utils";
import { getProjects } from "@/lib/api";
import ProjectsSkeleton from "./ProjectSkeleton";

export default function ProjectsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [projectsData, setProjectsData] = useState<ProjectsResponse>({
    data: [],
    meta: { page: 1, limit: 12, total: 0, totalPages: 1 },
  });
  const [loading, setLoading] = useState(true);

  const currentCategory = searchParams.get("category") as "LEARNING" | "LIVE" | null;
  const currentFavorite = searchParams.get("isFavorite") === "true";
  const currentPage = Number(searchParams.get("page") || 1);

  // Active tab logic
  const activeTab = currentFavorite
    ? "FAVORITES"
    : currentCategory || "ALL";

  const fetchProjects = async () => {
    setLoading(true);
    const data = await getProjects({
      page: currentPage,
      limit: 12,
      category: currentCategory ?? undefined,
      isFavorite: currentFavorite || undefined,
    });
    setProjectsData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCategory, currentFavorite, currentPage]);

  const handleTabChange = (tab: "ALL" | "LEARNING" | "LIVE" | "FAVORITES") => {
    const params = new URLSearchParams(searchParams.toString());

    if (tab === "ALL") {
      params.delete("category");
      params.delete("isFavorite");
    } else if (tab === "FAVORITES") {
      params.delete("category");
      params.set("isFavorite", "true");
    } else {
      params.set("category", tab);
      params.delete("isFavorite");
    }

    params.set("page", "1");
    router.push(`/project?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/project?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { data: projects, meta } = projectsData;

  if (loading) {
    return <ProjectsSkeleton count={12}/>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight mt-10">Projects</h1>
         
        </div>

        {/* Tabs */}
        <div className="mb-10 border-b">
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {(["ALL", "LEARNING", "LIVE", "FAVORITES"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={cn(
                  "px-6 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap",
                  activeTab === tab
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {tab === "ALL" ? "All" : tab === "FAVORITES" ? "Favorites" : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => handlePageChange(meta.page - 1)}
                  disabled={meta.page === 1}
                  className="p-3 rounded-lg border hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex-1 overflow-x-auto scrollbar-hide">
                  <div className="flex items-center gap-2 min-w-max">
                    {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={cn(
                          "min-w-[40px] h-10 px-4 rounded-lg text-sm font-medium transition-all",
                          page === meta.page
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "border hover:bg-accent hover:border-primary/50"
                        )}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handlePageChange(meta.page + 1)}
                  disabled={meta.page === meta.totalPages}
                  className="p-3 rounded-lg border hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <Card className="border-none shadow-md">
            <CardContent className="py-16 text-center">
              <h3 className="text-xl font-medium mb-2">No projects found</h3>
              <p className="text-muted-foreground">
                Try switching to a different filter
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
