"use client";

import { Card, CardContent } from "@/components/ui/card";
import ProjectCard from "./ProjectCard";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Project } from "@/types/project.types";

interface Props {
  projects: Project[];
}

export default function FeaturedProjectsSection({ projects }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!projects?.length) return null;

  const featured = projects.filter((p) => p.isFavorite && p.isActive);
  
  if (!featured.length) return null;

  // Update items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(2); // lg screens: 2 items
      } else if (window.innerWidth >= 768) {
        setItemsPerView(2); // md screens: 2 items
      } else {
        setItemsPerView(1); // mobile: 1 item
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, featured.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  return (
    <Card className="border-none shadow-lg">
      <CardContent className="pt-6 md:pt-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          
          {/* View All Button */}
          <Link 
            href="/project"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Navigation Controls */}
        {featured.length > itemsPerView && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <button
              onClick={handlePrev}
              disabled={!canGoPrev}
              className="p-2 rounded-full border hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-muted-foreground min-w-[60px] text-center">
              {currentIndex + 1} - {Math.min(currentIndex + itemsPerView, featured.length)} of {featured.length}
            </span>
            <button
              onClick={handleNext}
              disabled={!canGoNext}
              className="p-2 rounded-full border hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Next project"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Carousel Container */}
        <div 
          className="relative overflow-hidden" 
          ref={containerRef}
        >
          <div
            className="flex transition-transform duration-500 ease-out gap-4"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {featured.map((project) => (
              <div
                key={project.id}
                className="flex-shrink-0"
                style={{
                  width: `calc(${100 / itemsPerView}% - ${((itemsPerView - 1) * 16) / itemsPerView}px)`,
                }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>

        {/* Dot Indicators */}
        {featured.length > itemsPerView && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
