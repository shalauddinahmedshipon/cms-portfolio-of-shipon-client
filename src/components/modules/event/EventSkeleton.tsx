import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function EventDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-5 py-10 md:py-16 lg:py-20">
        {/* Back link skeleton */}
        <div className="mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>

        {/* Hero image skeleton */}
        <div className="mb-8 md:mb-10">
          <div className="relative rounded-xl md:rounded-2xl overflow-hidden border bg-muted aspect-[4/3] sm:aspect-[5/3] md:aspect-[16/7] lg:aspect-[16/6]">
            <Skeleton className="h-full w-full" />
          </div>

          {/* Thumbnails skeleton */}
          <div className="flex gap-3 mt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                className="w-20 h-14 sm:w-24 sm:h-16 md:w-28 md:h-20 rounded-lg flex-shrink-0"
              />
            ))}
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Description area */}
          <div className="lg:col-span-8 order-2 lg:order-1 space-y-8 md:space-y-10">
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-7 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-5 w-full" />
            </div>
          </div>

          {/* Sidebar info card */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            <Card className="bg-card/80 backdrop-blur-sm border shadow-md">
              <CardContent className="p-5 md:p-6 space-y-6">
                <Skeleton className="h-7 w-40" />
                <div className="space-y-5">
                  <div className="flex gap-3">
                    <Skeleton className="h-5 w-5 mt-1" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-4/5" />
                      <Skeleton className="h-4 w-3/5" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Skeleton className="h-5 w-5 mt-1" />
                    <Skeleton className="h-5 w-3/4" />
                  </div>
                  <div className="flex gap-3">
                    <Skeleton className="h-5 w-5 mt-1" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}