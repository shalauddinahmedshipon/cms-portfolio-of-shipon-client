"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProjectCard from "@/components/modules/home/ProjectCard";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectsResponse } from "@/types/api.response.types";

interface Props {
  initialData: ProjectsResponse;
}

export default function ProjectsClient({ initialData }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState<"ALL" | "LEARNING" | "LIVE">(
    (searchParams.get("category") as "LEARNING" | "LIVE") || "ALL"
  );

  const { data: projects, meta } = initialData;

  const handleSearch = (value: string) => {
    setSearch(value);
    updateURL({ search: value, page: "1" });
  };

  const handleCategoryChange = (value: "ALL" | "LEARNING" | "LIVE") => {
    setCategory(value);
    updateURL({ 
      category: value === "ALL" ? undefined : value,
      page: "1"
    });
  };

  const handlePageChange = (page: number) => {
    updateURL({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateURL = (params: Record<string, string | undefined>) => {
    const current = new URLSearchParams(searchParams);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });

    router.push(`/project?${current.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="container mx-auto max-w-6xl py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Projects</h1>
          <p className="text-muted-foreground">
            Explore all {meta.total} projects
          </p>
        </div>

        {/* Filters */}
        <Card className="border-none shadow-lg mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as "ALL" | "LEARNING" | "LIVE")}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                >
                  <option value="ALL">All Categories</option>
                  <option value="LEARNING">Learning</option>
                  <option value="LIVE">Live</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <Card className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing {((meta.page - 1) * meta.limit) + 1} to{" "}
                      {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} projects
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(meta.page - 1)}
                        disabled={meta.page === 1}
                        className="p-2 rounded-lg border hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => {
                          // Show first page, last page, current page, and pages around current
                          const showPage =
                            page === 1 ||
                            page === meta.totalPages ||
                            (page >= meta.page - 1 && page <= meta.page + 1);

                          if (!showPage && page === 2) {
                            return <span key={page} className="px-2">...</span>;
                          }
                          if (!showPage && page === meta.totalPages - 1) {
                            return <span key={page} className="px-2">...</span>;
                          }
                          if (!showPage) return null;

                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`min-w-[40px] px-3 py-2 rounded-lg transition-all ${
                                page === meta.page
                                  ? "bg-primary text-primary-foreground"
                                  : "border hover:bg-accent"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => handlePageChange(meta.page + 1)}
                        disabled={meta.page === meta.totalPages}
                        className="p-2 rounded-lg border hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        aria-label="Next page"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No projects found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
