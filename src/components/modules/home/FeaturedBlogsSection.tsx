// components/modules/blog/FeaturedBlogsSection.tsx
"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Blog } from "@/types/blog.types";
import BlogCard from "../blog/BlogCard";

interface Props {
  blogs: Blog[];
}

export default function FeaturedBlogsSection({ blogs }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  const featured = blogs.filter(b => b.isFeatured && b.isActive);

  if (!featured.length) return null;

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setItemsPerView(3);
      else if (window.innerWidth >= 768) setItemsPerView(2);
      else setItemsPerView(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, featured.length - itemsPerView);

  const prev = () => setCurrentIndex(i => Math.max(0, i - 1));
  const next = () => setCurrentIndex(i => Math.min(maxIndex, i + 1));

  return (
    <Card className="border-none shadow-lg">
      <CardContent className="pt-6 md:pt-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Latest Articles
          </h2>
          <Link
            href="/blog"
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out gap-6"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {featured.map(blog => (
              <div
                key={blog.id}
                className="flex-shrink-0"
                style={{ width: `calc(${100 / itemsPerView}% - ${((itemsPerView - 1) * 24) / itemsPerView}px)` }}
              >
                <BlogCard blog={blog} />
              </div>
            ))}
          </div>
        </div>

        {/* Simple dots or arrows if you want */}
      </CardContent>
    </Card>
  );
}