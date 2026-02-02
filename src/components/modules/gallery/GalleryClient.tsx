"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { getGallery } from "@/lib/api";
import { GalleryItem, GalleryResponse } from "@/types/gallery.types";
import { cn } from "@/lib/utils";

export default function GalleryClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [galleryData, setGalleryData] = useState<GalleryResponse>({
    data: [],
    meta: { page: 1, limit: 12, total: 0, totalPages: 1 },
  });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  const currentPage = Number(searchParams.get("page") || 1);
  const { data: images, meta } = galleryData;

  /* ---------------- fetch ---------------- */
  useEffect(() => {
    setLoading(true);
    getGallery({ page: currentPage, limit: 12 }).then((res) => {
      setGalleryData(res);
      setLoading(false);
    });
  }, [currentPage]);

  /* ---------------- keyboard ---------------- */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!selected) return;
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, images]);

  const index = images.findIndex((i) => i.id === selected?.id);

  const next = () =>
    setSelected(images[(index + 1) % images.length]);

  const prev = () =>
    setSelected(images[(index - 1 + images.length) % images.length]);

  /* ---------------- pagination ---------------- */
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/gallery?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---------------- loading ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-6xl mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(9).fill(0).map((_, i) => (
              <div key={i} className="h-72 rounded-xl bg-muted/50 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* PAGE WRAPPER (same as blog) */}
      <div className="min-h-screen bg-background">
        <div className="container max-w-6xl mx-auto px-4 py-20">
          <h1 className="text-3xl font-semibold tracking-tight mb-10">
            Gallery
          </h1>

          {/* GRID */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {images.map((img) => (
              <button
                key={img.id}
                onClick={() => setSelected(img)}
                className="group text-left rounded-xl overflow-hidden border hover:shadow-md transition"
              >
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={img.image}
                    alt={img.title || "Gallery"}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* TITLE (small cards) */}
                <div className="p-4">
                  <p className="text-sm font-medium line-clamp-2">
                    {img.title || "Untitled"}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* PAGINATION (same logic as blog) */}
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
                <div className="flex gap-2 min-w-max">
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
        </div>
      </div>

      {/* LIGHTBOX */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setSelected(null)}
        >
          <button className="absolute top-4 right-4 text-white">
            <X size={32} />
          </button>

          <button
            className="absolute left-4 text-white"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
          >
            <ChevronLeft size={40} />
          </button>

          <button
            className="absolute right-4 text-white"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          >
            <ChevronRight size={40} />
          </button>

          {/* FIXED HEIGHT IMAGE */}
          <div
            className="relative w-[90vw] max-w-5xl"
            style={{ height: "80vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selected.image}
              alt={selected.title || "Gallery"}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
