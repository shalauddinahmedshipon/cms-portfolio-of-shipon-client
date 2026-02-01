import AboutSection from "@/components/modules/home/AboutSection";
import AchievementSection from "@/components/modules/home/AchievementSection";
import CodingProfileSection from "@/components/modules/home/CodingProfileSection";
import EducationTimeline from "@/components/modules/home/EducationTimeline";
import ExperienceSection from "@/components/modules/home/ExperienceSection";
import FeaturedProjectsSection from "@/components/modules/home/FeaturedProjectSection";
import Footer from "@/components/modules/home/Footer";
import HeroSection from "@/components/modules/home/HeroSection";
import HomeGallery from "@/components/modules/home/HomeGallery";
import SkillSection from "@/components/modules/home/SkillSection";
import { getAchievements, getCodingProfiles, getEducation, getExperiences, getFeaturedProjects, getProfile, getSkills } from "@/lib/api";




export default async function HomePage() {
  const profile = await getProfile();
    const experiences = await getExperiences();
    const skills = await getSkills();
    const codingProfiles = await getCodingProfiles();
    const achievements = await getAchievements();
    const education = await getEducation()
      const featuredProjects = await getFeaturedProjects();


  return (
    <main className="min-h-screen  max-w-6xl mx-auto">
      <div className="container mx-auto ">
        {/* Hero Section */}
          <section className="w-full  bg-white pb-8 rounded-b-xl">
           <HeroSection profile={profile} />
          </section>
        

        {/* Profile Summary / About Me */}
        <section className="mt-8 w-full">
         <AboutSection 
  bio={profile?.bio} 
  contactInfo={profile?.contactInfo} 
/>
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

       
        {/* Featured Projects */}
        <section className="mt-8">
          <FeaturedProjectsSection projects={featuredProjects} />
        </section>

        {/* Featured Events (2-3) */}
        <section className="mt-8">
          
        </section>

        {/* Featured Blogs (2-3) */}
        <section className="mt-8">
          
         
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
         <Footer/>
        </section>
      </div>
    </main>
  );
}