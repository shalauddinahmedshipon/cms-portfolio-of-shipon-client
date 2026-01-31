import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkillSkeleton() {
  return (
    <Card className="border-none shadow-lg">
      <CardContent className="pt-6">
        <Skeleton className="h-9 w-32 mb-8" />

        <div className="space-y-8">
          {[1, 2, 3].map((cat) => (
            <div key={cat}>
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton
                    key={i}
                    className="h-10 w-28 rounded-full"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
