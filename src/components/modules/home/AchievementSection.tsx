"use client";

import { Card, CardContent } from "@/components/ui/card";
import AchievementCard from "./AchievementCard";
import { Achievement } from "@/types/achievement";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Props {
  achievements: Achievement[];
}

export default function AchievementSection({ achievements }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!achievements?.length) return null;

  const visible = achievements.filter((a) => a.isActive);
  
  if (!visible.length) return null;

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

  const maxIndex = Math.max(0, visible.length - itemsPerView);

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
            Achievements
          </h2>
          
          {/* Navigation Controls */}
          {visible.length > itemsPerView && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={!canGoPrev}
                className="p-2 rounded-full border hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Previous achievement"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-muted-foreground min-w-[60px] text-center">
                {currentIndex + 1} - {Math.min(currentIndex + itemsPerView, visible.length)} of {visible.length}
              </span>
              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className="p-2 rounded-full border hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Next achievement"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

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
            {visible.map((achievement) => (
              <div
                key={achievement.id}
                className="flex-shrink-0"
                style={{
                  width: `calc(${100 / itemsPerView}% - ${((itemsPerView - 1) * 16) / itemsPerView}px)`,
                }}
              >
                <AchievementCard achievement={achievement} />
              </div>
            ))}
          </div>
        </div>

        {/* Dot Indicators */}
        {visible.length > itemsPerView && (
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
                aria-label={`Go to achievement ${index + 1}`}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
