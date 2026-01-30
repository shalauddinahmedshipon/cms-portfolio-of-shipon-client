// components/modules/home/HeroSkeleton.tsx
export default function HeroSkeleton() {
  return (
    <section className="w-full pt-6 animate-pulse">
      {/* Banner skeleton */}
      <div className="relative h-[220px] sm:h-[280px] md:h-[320px] rounded-xl bg-muted/70" />

      <div className="relative px-4 sm:px-6 lg:px-8">
        {/* Avatar skeleton */}
        <div className="relative mx-auto md:mx-0 md:ml-auto -mt-16 md:-mt-20 h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-background bg-muted/80" />

        {/* Info skeleton */}
        <div className="mt-4 md:mt-6 text-center md:text-left max-w-3xl mx-auto md:mx-0">
          <div className="h-10 w-3/5 mx-auto md:mx-0 bg-muted/80 rounded-md" />
          <div className="mt-2 h-6 w-48 mx-auto md:mx-0 bg-muted/70 rounded" />
          <div className="mt-4 h-5 w-4/5 mx-auto md:mx-0 bg-muted/60 rounded" />
          <div className="mt-3 h-5 w-32 mx-auto md:mx-0 bg-muted/60 rounded" />

          {/* Buttons skeleton */}
          <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
            <div className="h-10 w-32 bg-muted/80 rounded-md" />
            <div className="h-10 w-32 bg-muted/70 rounded-md" />
          </div>
        </div>
      </div>
    </section>
  );
}