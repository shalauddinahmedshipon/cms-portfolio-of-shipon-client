import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface EventsSkeletonProps {
  count?: number;
}

export default function EventsSkeleton({ count = 12 }: EventsSkeletonProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-10">
        {/* Header skeleton */}
        <div className="mb-10">
          <Skeleton className="h-10 w-48 mt-10" />
        </div>

        {/* Tabs skeleton */}
        <div className="mb-10 border-b">
          <div className="flex gap-2 overflow-x-auto pb-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-8 w-24 md:w-32 rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Grid of event cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {Array.from({ length: count }).map((_, i) => (
            <Card key={i} className="overflow-hidden border bg-card">
              <div className="relative w-full h-48 bg-muted">
                <Skeleton className="h-full w-full" />
              </div>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-10 w-full rounded-lg mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination skeleton */}
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-11 w-11 rounded-lg" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-10 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-11 w-11 rounded-lg" />
        </div>
      </div>
    </div>
  );
}