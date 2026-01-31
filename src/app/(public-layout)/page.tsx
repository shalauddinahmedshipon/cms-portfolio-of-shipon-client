import AboutSection from "@/components/modules/home/AboutSection";
import AchievementSection from "@/components/modules/home/AchievementSection";
import CodingProfileSection from "@/components/modules/home/CodingProfileSection";
import EducationTimeline from "@/components/modules/home/EducationTimeline";
import ExperienceSection from "@/components/modules/home/ExperienceSection";
import HeroSection from "@/components/modules/home/HeroSection";
import HomeGallery from "@/components/modules/home/HomeGallery";
import SkillSection from "@/components/modules/home/SkillSection";
import { Achievement } from "@/types/achievement";
import { Experience } from "@/types/experience.types";
import { CodingProfile } from "@/types/profile.types";
import { SkillCategory } from "@/types/skill.types";


async function getProfile() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
      cache: "no-store",
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

async function getExperiences(): Promise<Experience[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/experience`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Experience fetch failed", res.status);
      return [];
    }

    const json = await res.json();
    return json.data ?? [];
  } catch (err) {
    console.error("getExperiences error:", err);
    return [];
  }
}

async function getSkills(): Promise<SkillCategory[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skill/categories`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Skills fetch failed", res.status);
      return [];
    }

    const json = await res.json();
    return json.data ?? [];
  } catch (err) {
    console.error("getSkills error:", err);
    return [];
  }
}


async function getCodingProfiles(): Promise<CodingProfile[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/profile/coding-profiles`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.error("Coding profiles fetch failed", res.status);
      return [];
    }

    const json = await res.json();
    return json.data ?? [];
  } catch (err) {
    console.error("getCodingProfiles error:", err);
    return [];
  }
}

async function getAchievements(): Promise<Achievement[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/achievements`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.error("Achievements fetch failed", res.status);
      return [];
    }

    const json = await res.json();
    return json.data ?? [];
  } catch (err) {
    console.error("getAchievements error:", err);
    return [];
  }
}

async function getEducation() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/education`,
    { cache: "no-store" }
  )
  const json = await res.json()
  return json.data
}




export default async function HomePage() {
  const profile = await getProfile();
    const experiences = await getExperiences();
    const skills = await getSkills();
    const codingProfiles = await getCodingProfiles();
    const achievements = await getAchievements();
    const education = await getEducation()


  return (
    <main className="min-h-screen  max-w-6xl mx-auto">
      <div className="container mx-auto ">
        {/* Hero Section */}
          <section className="w-full  bg-white pb-8 rounded-b-xl">
           <HeroSection profile={profile} />
          </section>
        

        {/* Profile Summary / About Me */}
        <section className="mt-8 w-full">
          <AboutSection bio={profile.bio}/>
        </section>

        {/* Experience Timeline */}
        <section className="mt-8">
       <ExperienceSection experiences={experiences} />
        </section>

        {/* Skills */}
        <section className="mt-8">
           <SkillSection categories={skills} />
        </section>

        {/* Coding Profiles */}
        <section className="mt-8">
           <CodingProfileSection profiles={codingProfiles} />
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
  <AchievementSection achievements={achievements} />
</section>

<section className="mt-8">
   <EducationTimeline education={education} />
</section>

<section className="mt-8">
   <HomeGallery />
</section>


        {/* Contact CTA */}
        <section className="mt-8 pb-5 text-center">
          <h2 className="text-3xl font-bold mb-4">Let's Build Something Together</h2>
          <a href="/contact" className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition">
            Contact Me
          </a>
        </section>
      </div>
    </main>
  );
}