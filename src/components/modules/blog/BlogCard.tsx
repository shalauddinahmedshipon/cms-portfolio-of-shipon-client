"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Tag } from "lucide-react";
import { format } from "date-fns";
import { Blog } from "@/types/blog.types";

interface Props {
  blog: Blog;
}

export default function BlogCard({ blog }: Props) {
  const date = new Date(blog.createdAt);
  const firstTag = blog.tags?.[0];

  return (
    <div className="group rounded-xl border bg-card hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
      {blog.coverImage ? (
        <div className="relative w-full h-48 overflow-hidden bg-muted">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-muted to-muted/70 flex items-center justify-center text-muted-foreground">
          No cover image
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            {blog.category && (
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                {blog.category}
              </span>
            )}
            {firstTag && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Tag className="w-3 h-3" /> {firstTag}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {blog.title}
          </h3>
        </div>

        <div className="mt-auto text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4" />
            <time dateTime={blog.createdAt}>{format(date, "MMM d, yyyy")}</time>
          </div>
        </div>

        <Link
          href={`/blog/${blog.id}`}
          className="mt-4 block text-center py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          Read Article →
        </Link>
      </div>
    </div>
  );
}