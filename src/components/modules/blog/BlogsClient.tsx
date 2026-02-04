// components/modules/blog/BlogsClient.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BlogsResponse, Blog } from "@/types/blog.types";
import { getBlogs } from "@/lib/api";
import BlogCard from "./BlogCard";
import { cn } from "@/lib/utils";

const CATEGORIES = ["ALL", "TECHNOLOGY", "PROGRAMMING", "LIFESTYLE", "TUTORIAL", "NEWS"] as const;
type CategoryTab = typeof CATEGORIES[number];

export default function BlogsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [blogsData, setBlogsData] = useState<BlogsResponse>({
    data: [],
    meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
  });
  const [loading, setLoading] = useState(true);

  const currentCategory = searchParams.get("category") as Blog["category"] | null;
  const currentPage = Number(searchParams.get("page") || 1);

  const activeTab: CategoryTab = currentCategory || "ALL";

  const fetchBlogs = async () => {
    setLoading(true);
    const data = await getBlogs({
      page: currentPage,
      limit: 10,
      category: currentCategory ?? undefined,
    });
    setBlogsData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentCategory, currentPage]);

  const handleTabChange = (tab: CategoryTab) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "ALL") {
      params.delete("category");
    } else {
      params.set("category", tab);
    }
    params.set("page", "1");
    router.push(`/blog?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/blog?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { data: blogs, meta } = blogsData;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-6xl mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(9).fill(0).map((_, i) => (
              <div key={i} className="h-96 rounded-xl bg-muted/50 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-20">
        <h1 className="text-3xl font-semibold tracking-tight mb-10">Post</h1>

        {/* Category Tabs */}
        <div className="mb-10 border-b">
          <div className="flex gap-2 overflow-x-auto pb-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleTabChange(cat)}
                className={cn(
                  "px-5 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap",
                  activeTab === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {cat === "ALL" ? "All Posts" : cat}
              </button>
            ))}
          </div>
        </div>

        {blogs.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>

            {meta.totalPages > 1 && (
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => handlePageChange(meta.page - 1)}
                  disabled={meta.page === 1}
                  className="p-3 rounded-lg border hover:bg-accent disabled:opacity-40"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex-1 overflow-x-auto">
                  <div className="flex items-center gap-2 min-w-max">
                    {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={cn(
                          "min-w-[40px] h-10 px-4 rounded-lg text-sm font-medium",
                          p === meta.page
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "border hover:bg-accent"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handlePageChange(meta.page + 1)}
                  disabled={meta.page === meta.totalPages}
                  className="p-3 rounded-lg border hover:bg-accent disabled:opacity-40"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <Card className="border-none shadow-md">
            <CardContent className="py-16 text-center">
              <h3 className="text-xl font-medium mb-2">No blog posts found</h3>
              <p className="text-muted-foreground">Try a different category</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}