// app/loading.tsx

import ExperienceSkeleton from "@/components/modules/home/ExperienceSkeleton";
import HeroSkeleton from "@/components/modules/home/HeroSkeleton";
import SkillSkeleton from "@/components/modules/home/SkillSkeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background space-y-6">
      <HeroSkeleton />
      <ExperienceSkeleton/>
      <SkillSkeleton />
      {/* You can add more section skeletons here later */}
    </main>
  );
}