import HeroSection from "@/components/modules/home/HeroSection";

async function getProfile() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
      cache: "no-store",
      next: { revalidate: 3600 }, // optional: ISR if data doesn't change often
    });

    if (!res.ok) {
      console.error("Profile fetch failed", res.status);
      return null;
    }

    const json = await res.json();
    return json.data ?? null;
  } catch (err) {
    console.error("getProfile error:", err);
    return null;
  }
}

export default async function HomePage() {
  const profile = await getProfile();

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <HeroSection profile={profile} />
        {/* <Suspense fallback={<OtherSectionSkeleton />}>
          <OtherSection />
        </Suspense> */}
      </div>
    </main>
  );
}