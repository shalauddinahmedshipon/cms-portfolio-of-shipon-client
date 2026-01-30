// components/modules/home/ExperienceSkeleton.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExperienceSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <Skeleton className="h-9 w-40 mb-6" />

        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="flex gap-4">
                <Skeleton className="h-12 w-12 rounded-lg flex-shrink-0" />
                
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-5 w-full max-w-2xl" />
                </div>
              </div>
              
              <Skeleton className="h-20 w-full mt-4" />
              
              {i < 3 && <div className="mt-8 border-b" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}