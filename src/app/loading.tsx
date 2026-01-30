// app/loading.tsx

import HeroSkeleton from "@/components/modules/home/HeroSkeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSkeleton />
      {/* You can add more section skeletons here later */}
    </main>
  );
}