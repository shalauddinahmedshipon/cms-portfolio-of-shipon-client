"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Tag } from "lucide-react";
import { format } from "date-fns";
import { Blog } from "@/types/blog.types";

interface Props {
  blog: Blog;
}

export default function BlogDetailClient({ blog }: Props) {
  const date = new Date(blog.createdAt);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-5 py-20">
        {/* Back */}
        <Link
          href="/blog"
          className="group mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Blog
        </Link>

        {/* Cover */}
        {blog.coverImage && (
          <div className="relative w-full h-80 md:h-[450px] rounded-2xl overflow-hidden mb-10 shadow-xl">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4" />
            <time>{format(date, "MMMM d, yyyy")}</time>
          </div>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            {blog.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
          {blog.title}
        </h1>

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
      </div>
    </div>
  );
}