import AboutSection from "@/components/modules/home/AboutSection";
import HeroSection from "@/components/modules/home/HeroSection";

async function getProfile() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
      cache: "no-store",
      next: { revalidate: 3600 },
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
    <main className="min-h-screen ">
      <div className="container mx-auto ">
        {/* Hero Section */}
          <section className="w-full  bg-white pb-8 rounded-b-xl">
           <HeroSection profile={profile} />
          </section>
        

        {/* Profile Summary / About Me */}
        <section className="mt-8">
          <AboutSection bio={profile.bio}/>
        </section>

        {/* Experience Timeline */}
        <section className="mt-8">
          <h2 className="text-3xl font-bold">Experience</h2>
          {/* Experience content */}
        </section>

        {/* Skills */}
        <section className="mt-8">
          <h2 className="text-3xl font-bold">Skills</h2>
          {/* Skills content */}
        </section>

        {/* Coding Profiles */}
        <section className="mt-8">
          <h2 className="text-3xl font-bold">Coding Profiles</h2>
          {/* GitHub, LeetCode, etc. */}
        </section>

        {/* Featured Projects (2-3) */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Featured Projects</h2>
            <a href="/projects" className="text-primary hover:underline">
              View all projects →
            </a>
          </div>
          {/* Featured projects cards */}
        </section>

        {/* Featured Events (2-3) */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Featured Events</h2>
            <a href="/events" className="text-primary hover:underline">
              View all events →
            </a>
          </div>
          {/* Featured events cards */}
        </section>

        {/* Featured Blogs (2-3) */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Featured Blogs</h2>
            <a href="/blogs" className="text-primary hover:underline">
              View all blogs →
            </a>
          </div>
          {/* Featured blogs cards */}
        </section>

        {/* Gallery Preview (4-6 images) */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Gallery</h2>
            <a href="/gallery" className="text-primary hover:underline">
              View full gallery →
            </a>
          </div>
          {/* Gallery preview */}
        </section>

        {/* Achievements */}
        <section className="mt-8">
          <h2 className="text-3xl font-bold">Achievements</h2>
          {/* Achievements content */}
        </section>

        {/* Contact CTA */}
        <section className="mt-8 mb-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Let's Build Something Together</h2>
          <a href="/contact" className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition">
            Contact Me
          </a>
        </section>
      </div>
    </main>
  );
}