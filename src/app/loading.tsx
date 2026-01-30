// app/loading.tsx

import ExperienceSkeleton from "@/components/modules/home/ExperienceSkeleton";
import HeroSkeleton from "@/components/modules/home/HeroSkeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background space-y-6">
      <HeroSkeleton />
      <ExperienceSkeleton/>
      {/* You can add more section skeletons here later */}
    </main>
  );
}