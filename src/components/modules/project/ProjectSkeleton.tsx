"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="min-h-screen max-w-6xl mx-auto bg-background px-4 py-10">
      {/* Header skeleton */}
      <div className="mb-10 space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-2 mb-10">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-lg" />
        ))}
      </div>

      {/* Projects grid skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
